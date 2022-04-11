import React from "react";
import Toast from "react-bootstrap/Toast";

const IngredientUpdatedToaster = (props) => {
  let ingredientToast = null;

  const changeToast = () => {
    let toastType = props.bg;
    if (toastType === "success") {
      ingredientToast = "Ingredient Added";
    } else {
      ingredientToast = "Ingredient Removed";
    }
  };

  changeToast();

  return (
    <Toast {...props} className="d-inline-block m-1" delay={3000} autohide>
      <Toast.Header>
        <strong className="me-auto">{ingredientToast}</strong>
      </Toast.Header>
      <Toast.Body>
        <div>Ingredient list has updated.</div>
      </Toast.Body>
    </Toast>
  );
};

export default IngredientUpdatedToaster;
