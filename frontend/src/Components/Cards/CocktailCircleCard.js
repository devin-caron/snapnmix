import "./CocktailCircleCard.css"
import { Redirect, useHistory, useLocation } from 'react-router-dom'
import CocktailDetailer from "../Cards/CocktailDetailer";
import { useEffect } from "react";
import axios from 'axios'


const CocktailCircleCard = (props) =>{
    let history = useHistory();
    let location = useLocation();
    const cardClickHandler = () =>{
        if (props.type === "drink"){
        props.clickHandler(<CocktailDetailer id={props.id} avatar={props.avatar} title={props.title} ingredients={props.ingredients} instructions={props.instructions} closeDetailsHandler={closeDetailsHandler} updateFavorites={props.updateFavorites} favoriteIDs={props.favoriteIDs} iscustom={false} />)
        }

        if (props.type === "customdrink"){
            props.clickHandler(<CocktailDetailer id={props.id} avatar={props.avatar} title={props.title} ingredients={props.ingredients} instructions={props.instructions} closeDetailsHandler={closeDetailsHandler} updateFavorites={props.updateFavorites} favoriteIDs={props.favoriteIDs} iscustom={true} updateMyBarList={props.updateMyBarList} />)
            }

        if (props.type === "communitycustomdrink"){
            props.clickHandler(<CocktailDetailer createdBy={props.createdBy} id={props.id} avatar={props.avatar} title={props.title} ingredients={props.ingredients} instructions={props.instructions} closeDetailsHandler={closeDetailsHandler} updateFavorites={props.updateFavorites} favoriteIDs={props.favoriteIDs} iscommunitycustom={true} updateMyBarList={props.updateMyBarList} />)
        }

        if (props.type === "category"){
            props.clickHandler(props.title);
        }
        if (props.type === "signupDrink"){
            history.push("/login");
        }
    }


    const closeDetailsHandler = () =>{
        props.clickHandler('');
    }

    return(<div className="cockTailCircleCardContainer" onClick={cardClickHandler}><img className="cocktailAvatar" src={props.avatar}></img> <p>{props.title}</p> </div>);
}

export default CocktailCircleCard;