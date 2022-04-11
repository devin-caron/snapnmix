import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./SearchedCocktails.css";
import CocktailCircleCard from "../Cards/CocktailCircleCard";
import "../Browse/Browse.css";
import AuthContext from "../store/auth-context";
import Loading from "./Loading";
import "../Browse/Browse.css";
import noDrinks from "./nofavorite.jpg";

const startUrl = "https://sandmbackendnew.herokuapp.com/";

const SearchedCocktails = (props) => {
  const [cocktailArray, setCocktailArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ingredientsArrState, setIngredientsArrState] = useState([]);
  const [displayDetails, setDisplayDetails] = useState();

  let NO_DRINKS = {
    strDrink: "No Drinks Found!",
    strDrinkThumb: noDrinks,
    alterText: 1,
  };

  const authCtx = useContext(AuthContext);
  const loadedCocktails = [];

  const loadCocktails = async () => {
    let ingredientArrayCopy = JSON.parse(
      window.localStorage.getItem("curIngredients")
    );

    if (props.ingredientArray.length > 0) {
      ingredientArrayCopy = props.ingredientArray.map((ingredient) => {
        return ingredient.item;
      });
    }

    window.localStorage.setItem(
      "curIngredients",
      JSON.stringify(ingredientArrayCopy)
    );

    const ingredients = {
      ingredients: ingredientArrayCopy,
    };

    try {
      await axios
        .post(startUrl + "api/imgrecognition/submit", ingredients)
        .then((api_response) => {
          for (let i = 0; i < api_response.data.length; i++) {
            loadedCocktails.push(api_response.data[i]);
          }
          loadedCocktails.forEach((item) => {
            if (item.cocktails_arr !== "None Found") {
              if (item.title.includes("Best Match")) {
                item.cocktails_arr.forEach((drink) => {
                  drink.cocktail["instructions"] = "";
                  drink.cocktail["ingredients"] = [];
                });
              } else {
                item.cocktails_arr.forEach((drink) => {
                  drink["instructions"] = "";
                  drink["ingredients"] = [];
                });
              }
            }
          });
        });
    } catch (error) {
      console.log(error);
    }

    // Merge all cocktails into one array
    for (let i = 0; i < loadedCocktails.length; i++) {
      if (loadedCocktails[i].cocktails_arr === "None Found") {
        let tempArr = [];
        tempArr.push(NO_DRINKS);
        loadedCocktails[i].cocktails_arr = tempArr;
        //bestMatchArray.push(NO_DRINKS);
      }
    }

    // Sort best match array
    console.log(loadedCocktails);
    setIngredientsArrState(ingredientArrayCopy);
    setCocktailArray(loadedCocktails);
    setIsLoading(false);
  };

  const cardClickHandler = (state) => {
    setDisplayDetails(state);
  };

  const arrowListScrollHandler = (direction, list) => {
    let catList = document.querySelector("." + list);

    if (direction === 0) {
      catList.scrollLeft = catList.scrollLeft - 300;
    } else {
      catList.scrollLeft = catList.scrollLeft + 300;
    }
  };

  const titleCase = (string) => {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  };

  useEffect(() => {
    loadCocktails();
  }, []);

  return (
    <React.Fragment>
      {displayDetails}
      {!isLoading && (
        <React.Fragment>
          <h5 className="listHeader">Best Matched Cocktails</h5>
          <div className="listDiv">
            <ul className="searchedCocktailList">
              {
                <button
                  className="arrowListLeftScroll"
                  onClick={() =>
                    arrowListScrollHandler(0, "searchedCocktailList")
                  }
                >
                  <ion-icon name="chevron-back-outline"></ion-icon>
                </button>
              }
              {cocktailArray[0].cocktails_arr.map((cocktailData) => (
                <CocktailCircleCard
                  id={cocktailData.cocktail.idDrink}
                  type={cocktailData.cocktail.alterText === 1 ? "" : "drink"}
                  title={cocktailData.cocktail.strDrink}
                  avatar={cocktailData.cocktail.strDrinkThumb}
                  ingredients={cocktailData.cocktail.ingredients}
                  instructions={cocktailData.cocktail.instructions}
                  clickHandler={cardClickHandler}
                  favouriteIDs={authCtx.favIDs}
                  updateFavorites={false}
                />
              ))}
            </ul>
            {
              <button
                className="arrowListRightScroll"
                onClick={() =>
                  arrowListScrollHandler(1, "searchedCocktailList")
                }
              >
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </button>
            }
          </div>
          {ingredientsArrState.map((ingredient, index) => (
            <React.Fragment>
              <h5 className="listHeader">
                Drinks With {titleCase(ingredient)}
              </h5>
              <div className="listDiv">
                <ul className={"searchedCocktailList list" + index}>
                  {
                    <button
                      className="arrowListLeftScroll"
                      onClick={() => arrowListScrollHandler(0, "list" + index)}
                    >
                      <ion-icon name="chevron-back-outline"></ion-icon>
                    </button>
                  }
                  {cocktailArray.map(
                    (cocktailData) =>
                      cocktailData.title
                        .toLowerCase()
                        .includes(ingredient.toLowerCase()) &&
                      cocktailData.cocktails_arr !== "None Found" &&
                      cocktailData.cocktails_arr.map((cocktail) => (
                        <CocktailCircleCard
                          id={cocktail.idDrink}
                          type={cocktail.alterText === 1 ? "" : "drink"}
                          title={cocktail.strDrink}
                          avatar={cocktail.strDrinkThumb}
                          ingredients={cocktail.ingredients}
                          instructions={cocktail.instructions}
                          clickHandler={cardClickHandler}
                          favouriteIDs={authCtx.favIDs}
                          updateFavorites={false}
                        />
                      ))
                  )}
                </ul>
                {
                  <button
                    className="arrowListRightScroll"
                    onClick={() => arrowListScrollHandler(1, "list" + index)}
                  >
                    <ion-icon name="chevron-forward-outline"></ion-icon>
                  </button>
                }
              </div>
            </React.Fragment>
          ))}
        </React.Fragment>
      )}
      {isLoading && <Loading />}
    </React.Fragment>
  );
};

export default SearchedCocktails;
