import "./CocktailDetailer.css";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../store/auth-context";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

let dataInstructions_TEMP = "";
let dataIngredients_TEMP = [];

const startUrl = "https://sandmbackendnew.herokuapp.com/";

const CocktailDetailer = (props) => {
  const authCtx = useContext(AuthContext);
  const [favButtonIcon, setFavButtonIcon] = useState("");
  const [dataInstructions, setDataInstructions] = useState("");
  const [dataIngredients, setDataIngredients] = useState([]);

  const postFavorites = () => {
    try {
      const url = startUrl + "api/cocktails/favorites/add/" + props.id;
      axios
        .post(
          url,
          {},
          {
            headers: { "auth-token": authCtx.token },
          }
        )
        .then((res) => {
          console.log("Post Success!");
          if (props.updateFavorites != false) {
            props.updateFavorites();
          } else {
            authCtx.favIDs.push(props.id);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      // Error handle
    }
  };

  const removeFavorites = () => {
    try {
      const url = startUrl + "api/cocktails/favorites/remove/" + props.id;
      axios
        .post(
          url,
          {},
          {
            headers: { "auth-token": authCtx.token },
          }
        )
        .then((res) => {
          console.log("Post Success! removed");
          props.updateFavorites();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      // Error handle
    }
  };

  const removeMyBarItemHandler = () => {
    try {
      const url = startUrl + "api/cocktails/custom/remove/" + props.id;
      axios
        .post(
          url,
          {},
          {
            headers: { "auth-token": authCtx.token },
          }
        )
        .then((res) => {
          console.log("Post Success! removed");
          props.closeDetailsHandler();
          props.updateMyBarList();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      // Error handle
    }
  };

  const favoriteButtonHandler = () => {
    if (authCtx.isLoggedIn) {
      if (favButtonIcon === "heart-outline") {
        inFavorites(true);
      } else {
        inFavorites(false);
      }
    }
  };

  const inFavorites = (condition) => {
    const heart = document.querySelector(".detailsFavoriteButton");
    if (condition === true) {
      setFavButtonIcon("heart");
      heart.style.setProperty("color", "green");
      postFavorites();
    } else {
      setFavButtonIcon("heart-outline");
      heart.style.setProperty("color", "gray");
      removeFavorites();
    }
  };

  const ingredientsHandler = (drink) => {
    let ingredients = [];
    let measurements = [];
    let completeTags = [];
    for (const property in drink) {
      if (property.includes("strIngredient")) {
        if (drink[property] != null && drink[property] != "") {
          ingredients.push(drink[property]);
        }
      }

      if (property.includes("strMeasure")) {
        if (drink[property] != "") {
          measurements.push(drink[property]);
        }
      }
    }

    for (let i = 0; i < ingredients.length; i++) {
      if (measurements[i] === null) {
        completeTags.push(ingredients[i]);
      } else {
        completeTags.push(
          ingredients[i] + " (" + measurements[i].trim() + ") "
        );
      }
    }

    return completeTags;
  };

  useEffect(() => {
    if (authCtx.isLoggedIn === true && props.iscustom === false) {
      const heart = document.querySelector(".detailsFavoriteButton");
      heart.style.setProperty("color", "gray");
      setFavButtonIcon("heart-outline");
    }

    if (authCtx.favIDs.includes(props.id)) {
      const heart = document.querySelector(".detailsFavoriteButton");
      setFavButtonIcon("heart");
      heart.style.setProperty("color", "green");
    }
    if (props.ingredients[0] === undefined) {
      try {
        axios
          .get(
            "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" +
              props.id
          )
          .then((res) => {
            const data = res.data.drinks[0];
            dataInstructions_TEMP = data.strInstructions;
            setDataIngredients(ingredientsHandler(data));

            setDataInstructions(dataInstructions_TEMP);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      dataIngredients_TEMP = props.ingredients.filter((ingredient) => {
        if (ingredient !== null && ingredient !== "") {
          return ingredient;
        }
      });

      setDataIngredients(dataIngredients_TEMP);
      setDataInstructions(props.instructions.trim());
    }
  }, [props.ingredients]);

  return (
    <Modal show={true} centered size="xl">
      <Modal.Header>
        <Modal.Title>{props.title}</Modal.Title>

        <button
          type="button"
          className="btn-close"
          onClick={props.closeDetailsHandler}
          aria-label="Close"
        ></button>
      </Modal.Header>
      <div className="modalImgContainer">
        <img className="cocktailDetailerContainerImg" src={props.avatar}></img>
      </div>
      <Modal.Body>
        <div className="cocktailDetailerDataIngredients">
          {dataIngredients.map((ingredient, key) => (
            <div key={key} className="cocktailIngredientsTag">
              {ingredient}
            </div>
          ))}
        </div>
        <div className="cocktailDetailerDataInstructions">
          {dataInstructions}
        </div>
      </Modal.Body>

      <button className="detailsFavoriteButton" onClick={favoriteButtonHandler}>
        <ion-icon name={favButtonIcon}></ion-icon>
      </button>

      {props.iscustom && (
        <Button
          variant="removeMyBarItemButton"
          onClick={removeMyBarItemHandler}
        >
          <ion-icon name="trash-outline"></ion-icon>
        </Button>
      )}
      {props.iscommunitycustom && (
        <p className="userSubmittedName">Submitted By: {props.createdBy}</p>
      )}
    </Modal>
  );
};

export default CocktailDetailer;
