const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require('pg');
const { pgPort } = require('./keys');
const pgClient = new Pool ({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    post: pgPort
});
pgClient.on('error', () => console.log('Lost PG Connections'));

pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT) ')
    .catch(err => console.log(err));

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
    // await syntax due to built-in promise support in Postgres library
    const values = await pgClient.query('SELECT * FROM values');

    res.send(values.rows);
});

app.get('/values/current', (req, res) => {
    // callback function no promise support in redis library
    redisClient.hgetall('values', (err, values) => {
        res.values(values);
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index to high');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES$1', [index]);

    res.send({working: true});
});

app.listen(5000, err => {
    console.log('Lisetning');
});

nodule.exports = express();