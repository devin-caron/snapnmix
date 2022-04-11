import React from "react";
import "./IngredientItem.css";

const SearchIngredient = (props) => {
  const addHandler = () => {
    props.pushIngredient(props.item);
  };

  return (
    <div className="ingredient">
      <div className="ingredient_inner">{props.item}</div>
      <div className="ingredient_icon" onClick={addHandler}>
        <ion-icon name="add-outline"></ion-icon>
      </div>
    </div>
  );
};

export default SearchIngredient;
