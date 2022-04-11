import "./Scan.css";
import { Route, Switch, useHistory } from "react-router-dom";
import React, { useState, useEffect, useRef, useContext } from "react";
import Camera from "./CameraComp";
import axios from "axios";
import IngredientItem from "./IngredientItem";
import SearchedCocktails from "./SearchedCocktails";
import SearchIngredient from "./SearchIngredient";
import NavBar2 from "../NavBar/NavBar2";
import Loading from "./Loading";
import ScanHelper from "./ScanHelper";
import AuthContext from "../store/auth-context";
import IngredientUpdatedToast from "./IngredientUpdatedToast.js";

const startUrl = "https://sandmbackendnew.herokuapp.com/";

const Scan = (props) => {
  const [useCamera, setUseCamera] = useState(false);
  const [ingredientsRecieved, setIngredientsRecieved] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [cocktailDisplay, setCocktailDisplay] = useState(false);
  const [ingredientAdd, setIngredientAdd] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toasterType, setToasterType] = useState("");
  const [dividerStyle, setDividerStyle] = useState("ingredient_divider_text");

  const history = useHistory();

  const inputFile = useRef(null);
  let searchTextField = useRef(null);

  let currentState = null;

  const cameraClickHandler = () => {
    setUseCamera(true);
    setIngredientsRecieved(false);
    setCocktailDisplay(false);
  };

  const ingredientsDisplayHandler = () => {
    setUseCamera(false);
    setIngredientsRecieved(true);
    setCocktailDisplay(false);
  };

  const displayCocktailsHandler = () => {
    history.push("/scan/cocktail-result");
  };

  const filterIngredients = (arr, comp) => {
    const filtered = arr
      .map((e) => e[comp])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e])
      .map((e) => arr[e]);
    return filtered;
  };

  const handleFileUpload = async (e) => {
    const { files } = e.target;
    if (files && files.length) {
      const filename = files[0];

      const base64 = await convertBase64(filename);
      imageDataHandler(base64);
    }
  };

  const convertBase64 = (img) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(img);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const uploadClickHandler = () => {
    inputFile.current.click();
  };

  const imageDataHandler = async (imgData) => {
    setIsLoading(true);
    imgData = imgData.substring(23, imgData.length);

    try {
      const json_Object = { base64img: imgData };
      const api_response = await axios.post(
        startUrl + "api/imgrecognition",
        json_Object
      );

      const loadedIngredients = [];

      for (let i = 0; i < api_response.data.length; i++) {
        loadedIngredients.push({
          item: api_response.data[i],
          id: i,
        });
      }

      const filteredArr = filterIngredients(loadedIngredients, "item");

      const finalArr = filteredArr.filter((item) => {
        if (
          !item.item.includes("fruit") &&
          !item.item.includes("candy") &&
          !item.item.includes("juice")
        ) {
          return item;
        }
      });

      setIngredients(finalArr);
      setIsLoading(false);
      ingredientsDisplayHandler();
    } catch (error) {
      console.log("ERROR: " + error);
    }
  };

  const deleteIngredientHandler = (itemName) => {
    const updatedItemArray = ingredients.filter(
      (item) => item.item !== itemName
    );

    setToasterType("danger");
    setShowToast(true);
    setIngredients(updatedItemArray);
  };

  const pushIngredientHandler = (itemName) => {
    let newIngredients = ingredients.map((ingr) => {
      return ingr;
    });

    if (newIngredients.length === 0) {
      newIngredients.push({
        item: itemName,
        id: 1,
      });
    } else {
      newIngredients.push({
        item: itemName,
        id: parseInt(newIngredients[newIngredients.length - 1].id) + 1,
      });
    }

    // Clear search text field and ingredient
    searchTextField.value = "";
    setIngredientAdd([]);
    setDividerStyle("ingredient_divider_text");

    // Check for duplicate ingredients
    const filteredArr = filterIngredients(newIngredients, "item");

    // Display Toast and update array
    setToasterType("success");
    setShowToast(true);
    setIngredients(filteredArr);
  };

  const ingredientAddHandler = (event) => {
    if (event.target.value !== "") {
      try {
        axios
          .get(startUrl + "api/cocktails/search/i/" + event.target.value)
          .then((res) => {
            if (res.data.ingredients === null) {
              setIngredientAdd([]);
              setDividerStyle("ingredient_divider_text");
            } else {
              setDividerStyle("ingredient_divider_text_BORDERLESS");
              setIngredientAdd(res.data.ingredients);
            }
          });
      } catch (error) {
        console.log("fail");
      }
    } else {
      setIngredientAdd([]);
      setDividerStyle("ingredient_divider_text");
    }
  };

  const displayScanHelper = () => {
    setShowModal(true);
  };

  const scanMethodHandler = () => {
    if (isLoading === true) {
      currentState = <Loading />;
    } else {
      if (useCamera === true) {
        // =================================
        // CAMERA STATE
        // =================================
        currentState = <Camera onImageData={imageDataHandler} />;
      } else if (ingredientsRecieved === true) {
        // =================================
        // DISPLAY SCAN RESULT
        // =================================
        currentState = (
          <React.Fragment>
            <div className="ingredient_toast_container">
              <div className="ingredient_toast">
                <IngredientUpdatedToast
                  show={showToast}
                  onClose={() => setShowToast(false)}
                  bg={toasterType}
                />
              </div>
            </div>
            <div className="search_Ingredient">
              <div className="ingredient_searchbar">
                <input
                  type="text"
                  className="ingredient_SearchForm_Control"
                  placeholder="Search an ingredient.."
                  aria-label="SSearch an ingredient.."
                  aria-describedby="button-addon2"
                  onChange={ingredientAddHandler}
                  ref={(el) => (searchTextField = el)}
                />
              </div>
              <div className="search_Ingredient_Item">
                {ingredientAdd.length > 0 && (
                  <ul className="ingredientAdd_list">
                    {ingredientAdd.map((ingr) => (
                      <SearchIngredient
                        item={ingr.strIngredient}
                        key={ingr.idIngredient}
                        pushIngredient={pushIngredientHandler}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className={dividerStyle}>Ingredients</div>
            <div className="ingredient_list_container">
              <ul className="ingredient_list">
                {ingredients.map((ingredient) => {
                  return (
                    <IngredientItem
                      item={ingredient.item}
                      key={ingredient.id}
                      onDelete={deleteIngredientHandler}
                    />
                  );
                })}
              </ul>
            </div>
            <div className="display_btn_container">
              <div className="display_btn" onClick={displayCocktailsHandler}>
                <div className="display_btn_text">Search</div>
              </div>
            </div>
          </React.Fragment>
        );
      } else if (cocktailDisplay === true) {
        // =================================
        // SEARCH RESULT AFTER INGREDIENTS
        // =================================
        let ingredientArrayCopy = ingredients;
        currentState = (
          <SearchedCocktails ingredientArray={ingredientArrayCopy} />
        );
      } else {
        // =================================
        // INITIAL SCAN PAGE STATE
        // =================================
        currentState = (
          <div className="scan_container">
            <div className="sp_card">
              <div className="sp_card_scan_container">
                <div
                  className="sp_card_helper_icon"
                  onClick={displayScanHelper}
                >
                  <ion-icon name="help-circle-outline"></ion-icon>
                </div>
                <div className="sp_card_scan_el" onClick={cameraClickHandler}>
                  <div className="sp_card_icon">
                    <ion-icon name="camera-outline"></ion-icon>
                  </div>
                  <div className="sp_card_text">Scan your ingredients</div>
                  <div className="sp_card_scan_btn">Scan</div>
                </div>
              </div>
            </div>
            <div className="sp_divider_text">Or</div>
            <div className="sp_card" onClick={uploadClickHandler}>
              <div className="sp_card_upload_icon">
                <ion-icon name="arrow-down-outline"></ion-icon>
              </div>
              <div className="sp_card_text">Upload an image</div>
              <div className="sp_card_upload_btn">Upload</div>
            </div>
            <input
              type="file"
              id="file"
              ref={inputFile}
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <ScanHelper show={showModal} onHide={() => setShowModal(false)} />
          </div>
        );
      }
    }
  };

  scanMethodHandler();

  useEffect(() => {
    props.navBar(<NavBar2 currPage="2"/>);
  }, []);

  return (
    <React.Fragment>
      <Route path="/scan" exact>
        {currentState}
      </Route>
      <Route path="/scan/cocktail-result" exact>
        <SearchedCocktails ingredientArray={ingredients} />
      </Route>
    </React.Fragment>
  );
};

export default Scan;
