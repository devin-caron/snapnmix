import "./CategoryCircleCard.css"
import { useHistory } from 'react-router-dom'
import CocktailDetailer from "../Cards/CocktailDetailer";
import { useEffect } from "react";
import axios from 'axios'


const CategoryCircleCard = (props) =>{
    let history = useHistory();
    const cardClickHandler = () =>{
        if (props.type === "drink"){
        props.clickHandler(<CocktailDetailer id={props.id} avatar={props.avatar} title={props.title} ingredients={props.ingredients} instructions={props.instructions} closeDetailsHandler={closeDetailsHandler} updateFavorites={props.updateFavorites} favoriteIDs={props.favoriteIDs} />)
        }

        if (props.type === "category"){
            props.clickHandler(props.title);
        }
    }


    const closeDetailsHandler = () =>{
        props.clickHandler(null);
    }

    return(<div className="categoryCircleCardContainer" onClick={cardClickHandler}><img className="categoryAvatar" src={props.avatar}></img><p className="categoryTitle">{props.title}</p></div>);
}

export default CategoryCircleCard;