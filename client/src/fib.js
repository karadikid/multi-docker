import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: ''
    };

    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
    }

    async fetchValues() {
        const values = await axios.get('/api/values/current');
        this.setState({ values: values.data });
    }

    async fetchIndexes() {
        const seenIndexes = await axios.get('/api/values/all');
        this.setState({
            seenIndexes: seenIndexes.data
        });
    }
    // Event handler for submit, helper method.  Bound function.
    handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index
        });
        this.setState({ index: '' });
    }
    // Note map function and join below iterating over the index array returned from seeIndexes
    // Postgres by default returns an array of objects, in this case one with the number property and a value
    renderSeenIndexes() {
        return this.state.seenIndexes.map(({ number }) => number).join(', ')
    }
    // Redis returns an object with key value pairs within it.  
    // Note how we create a new array with the value for each key
    renderValues() {
        const entries = [];
        for (let key in this.state.values.values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {this.state.values[key]}
                </div>
            );
        }
        return entries;
    }

    // Note text of event handler for input field, especially the this.setState for the value
    render() {
        <div>
            <form onSubmit={this.handleSubmit}>
                <label>Enter your index:</label>
                <input
                    value={this.setState.index}
                    onChange={event => this.setState({ index: event.target.value })}
                />
                <button>Submit</button>
            </form>
            <h3>Indicies I have seen</h3>
            {this.renderSeenIndexes()}

            <h3>Calculated Values:</h3>
            {this.renderValues()}
        </div>
    }
}

export default Fib;