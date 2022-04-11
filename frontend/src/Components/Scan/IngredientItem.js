import React from "react";
import "./IngredientItem.css";

const IngredientItem = (props) => {
  const deleteHandler = () => {
    props.onDelete(props.item);
  };

  return (
    <div className="ingredient">
      <div className="ingredient_inner">{props.item}</div>
      <div className="ingredient_icon" onClick={deleteHandler}>
        <ion-icon name="trash-outline"></ion-icon>
      </div>
    </div>
  );
};

export default IngredientItem;
