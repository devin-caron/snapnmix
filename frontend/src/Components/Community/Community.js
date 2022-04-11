import { propTypes } from "react-bootstrap/esm/Image";
import NavBar from "../NavBar/NavBar";
import React, { useEffect, useState, useContext } from "react";
import CustomMixDetailer from "./CustomMixDetailer";
import axios from "axios";
import AuthContext from "../store/auth-context";
import CocktailCircleCard from "../Cards/CocktailCircleCard";
import "./Community.css";
import NavBar2 from "../NavBar/NavBar2";

let CUSTOM_MIXDATA = [];
let CUSTOM_ALLMIXDATA = [];
let CUSTOM_MIXIDS = [];
const startUrl = "https://sandmbackendnew.herokuapp.com/";
let GUEST_CUSTOM = [
  {
    alterClick: 1,
    strDrink: "Sign up to save custom mixes!",
    strDrinkThumb: "nofavorite.jpg",
  },
];

let LOGGEDIN_CUSTOM = [
  {
    alterClick: 2,
    strDrink: "Click the + to make a drink!",
    strDrinkThumb: "nofavorite.jpg",
  },
];

const Community = (props) => {
  const [customDrinkModal, setCustomDrinkModal] = useState();
  const [customMixData, setCustomMixData] = useState([]);
  const [allCustomMixData, setAllCustomMixData] = useState([]);
  const [displayDetails, setDisplayDetails] = useState();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    props.navBar(<NavBar2 currPage="3"/>);
    getCustomMixes(authCtx.isLoggedIn);
    getAllCustomMixes(authCtx.isLoggedIn);
  }, []);

  const createMixHandler = () => {
    setCustomDrinkModal(
      <CustomMixDetailer
        closeDetails={closeDetailsHandler}
        reloadList={() => {
          getCustomMixes(authCtx.isLoggedIn);
        }}
        customMixIDs={CUSTOM_MIXIDS}
        customListUpdate={() =>{
          getAllCustomMixes(authCtx.isLoggedIn);
        }}
      />
    );
  };

  const closeDetailsHandler = () => {
    setCustomDrinkModal();
  };

  const getCustomMixes = (isLoggedIn) => {
    if (isLoggedIn) {
      try {
        axios
          .get(startUrl + "api/cocktails/custom/", {
            headers: { "auth-token": authCtx.token },
          })
          .then((res) => {
            if (res.data.customRecipes === undefined){
              setCustomMixData(LOGGEDIN_CUSTOM);
            } else {
              CUSTOM_MIXDATA = res.data.customRecipes.customRecipes;
            if (CUSTOM_MIXDATA.length === 0){
              setCustomMixData(LOGGEDIN_CUSTOM)
            } else {
              CUSTOM_MIXIDS = CUSTOM_MIXDATA.map((drink) => drink.idDrink);
              setCustomMixData(CUSTOM_MIXDATA);
            }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log("fail");
      }
    } else {
      setCustomMixData(GUEST_CUSTOM);
    }
  };

  const getAllCustomMixes = (isLoggedIn) => {
    if (isLoggedIn) {
      try {
        axios
          .get(startUrl + "api/cocktails/custom/all")
          .then((res) => {
            CUSTOM_ALLMIXDATA = res.data;
            setAllCustomMixData(CUSTOM_ALLMIXDATA);
            console.log(CUSTOM_ALLMIXDATA);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log("fail");
      }
    } else {
      setCustomMixData(GUEST_CUSTOM);
    }
  };

  const cardClickHandler = (state) => {
    setDisplayDetails(state);
  };

  const updateList = () => {
    getCustomMixes(authCtx.isLoggedIn);
    getAllCustomMixes(authCtx.isLoggedIn);
  };

  const arrowListScrollHandler = (direction, list) => {
    let catList = document.querySelector("." + list);

    if (direction === 0) {
      catList.scrollLeft = catList.scrollLeft - 300;
    } else {
      catList.scrollLeft = catList.scrollLeft + 300;
    }
  };

  return (
    <div className="myBarContainer">
      <div>
        {customDrinkModal}
        {displayDetails}
        <h5 className="listHeaderCustomDrinks">Your Drinks</h5>
        <div className="listDiv">
        {authCtx.isLoggedIn && (
                <button
                  className="arrowListLeftScroll"
                  onClick={() =>
                    arrowListScrollHandler(0, "cocktailCustomList")
                  }
                >
                  <ion-icon name="chevron-back-outline"></ion-icon>
                </button>
              )}
        <ul className="cocktailCustomList">
          {customMixData.map((drink) => (
            <CocktailCircleCard
              type={drink.alterClick === 1 ? "signupDrink" : drink.alterClick === 2 ? "" : "customdrink"}
              id={drink.idDrink}
              title={drink.strDrink}
              avatar={drink.strDrinkThumb}
              clickHandler={authCtx.isLoggedIn ? cardClickHandler : ""}
              ingredients={drink.strIngredients}
              instructions={drink.strInstructions}
              favoriteIDs={[]}
              updateMyBarList={updateList}
            />
          ))}
        </ul>
        {authCtx.isLoggedIn && (
              <button
                className="arrowListRightScroll"
                onClick={() => arrowListScrollHandler(1, "cocktailCustomList")}
              >
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </button>
            )}
        </div>
        {authCtx.isLoggedIn && <h5 className="listHeaderCustomDrinks">Community Custom Drinks</h5>}
        <div className="listDiv">
        {authCtx.isLoggedIn && (
                <button
                  className="arrowListLeftScroll"
                  onClick={() =>
                    arrowListScrollHandler(0, "cocktailCustomCommunityList")
                  }
                >
                  <ion-icon name="chevron-back-outline"></ion-icon>
                </button>
              )}
        <ul className="cocktailCustomCommunityList">
          {allCustomMixData.map((drink) => (
            <CocktailCircleCard
              type="communitycustomdrink"
              createdBy={drink.createdBy}
              id={drink.idDrink}
              title={drink.strDrink}
              avatar={drink.strDrinkThumb}
              clickHandler={authCtx.isLoggedIn ? cardClickHandler : ""}
              ingredients={drink.strIngredients}
              instructions={drink.strInstructions}
              favoriteIDs={[]}
              updateMyBarList={updateList}
            />
          ))}
        </ul>
        {authCtx.isLoggedIn &&(
              <button
                className="arrowListRightScroll"
                onClick={() => arrowListScrollHandler(1, "cocktailCustomCommunityList")}
              >
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </button>
            )}
        </div>
      </div>
      <div className="customDrinkButtonDiv">
      {authCtx.isLoggedIn ? (
          <button className="createNewMixButton" onClick={createMixHandler}>
            <ion-icon name="add-outline"></ion-icon>
          </button>
        ) : (
          ""
        )}
        </div>
      </div>
  );
};

export default Community;
