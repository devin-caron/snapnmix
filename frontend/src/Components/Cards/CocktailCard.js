import { useEffect } from "react";
import "./CocktailCard.css";

const CocktailCard = (props) => {



  return (
    <div className="cocktailCard">
      <div className="card">
        <div className="card-body">
          <img className="cocktailimg" src={props.imgsrc} alt="Card image cap" />
          <h5>{props.title}</h5>
          <p>
            {props.ingredients}
          </p>

        </div>
      </div>
    </div>
  );
};

export default CocktailCard;
