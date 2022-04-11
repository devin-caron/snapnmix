import React from 'react';
import axios from 'axios';

export default class SimpleGet extends React.Component {


    state = {
        recipes: []
    };


    componentDidMount() {
        console.log('Inside DidMount!');
        axios.get(`http://localhost:3001/api/cocktails/categories`)
            .then((data) => {
                this.setState({ recipes: data.data.drinks });
                console.log('Accessing the state object: ' + this.state.recipes[5].strAlcoholic);
            })
            .catch(error => {
                this.setState(null);
                console.log('ERROR: ' + error);
            })
    }


    render() {
        console.log('Inside render!');
        return (
            JSON.stringify(this.state.recipes)
        )
    }
}