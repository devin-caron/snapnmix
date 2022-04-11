import React from 'react';
import { useEffect } from "react";
import "./CocktailCard.css";
import axios from "axios";


let RECIPE_DATA = [];
let splitRECIPE_DATA = [];


class CocktailDetails extends React.Component {


    state = {
        drinkData: []
    };


    componentDidMount() {
        let urlElements = window.location.pathname.split('/');
        axios.get(`http://localhost:3001/api/cocktails/search/` + urlElements[2])
            .then((data) => {
                this.setState({ drinkData: data.data.drinks[0] });
                console.log(this.state.drinkData);
            })
            .catch(error => {
                this.setState(null);
                console.log('ERROR: ' + error);
            })
    }


    render() {
        return (
            <div className="cocktailDetailsContainer">
                <p>
                <br></br>
                <br></br>
                {this.state.drinkData.strDrink}
                <br></br>
                {this.state.drinkData.strAlcoholic}
                <br></br>
                {this.state.drinkData.strInstructions}
                {this.state.drinkData.strDrinkThumb}
            </p>
            </div>
        )
    }
}

export default CocktailDetails