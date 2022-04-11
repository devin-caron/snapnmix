import "./CustomMixDetailer.css";
import Form from "react-bootstrap/Form";
import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../store/auth-context";
import { Modal, Button } from "react-bootstrap";

let imageCheck = false;
let imageUploaded = false;
const startUrl = "https://sandmbackendnew.herokuapp.com/";

const CustomMixDetailer = (props) => {
  const authCtx = useContext(AuthContext);

  const [customIngredients, setCustomIngredients] = useState([]);

  const [enteredMixName, setEnteredMixName] = useState("");
  const [enteredMixIngredients, setEnteredMixIngredients] = useState("");
  const [enteredMixInstructions, setEnteredMixInstructions] = useState("");
  const [invalidErrorMsg, setInvalidErrorMsg] = useState();
  const [imgurl, setImgUrl] = useState("N/A");
  const [uploadIndicator, setUploadIndicator] = useState();
  const [userAccountData, setUserAccountData] = useState([]);

  const inputFile = useRef(null);

  const handleFileUpload = async (e) => {
    const { files } = e.target;
    if (files && files.length) {
      const filename = files[0];
      const formData = new FormData();
      formData.append("file", filename);
      formData.append("upload_preset", "nx0cmvai");
      const urlPic = "https://api.cloudinary.com/v1_1/scan5/image/upload";
      try {
        axios
          .post(urlPic, formData)
          .then((res) => {
            setImgUrl(res.data.url);
            displayUploadedImage(1, res.data.url);
            imageCheck = true;
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        // Error handle
      }
    }
  };

  const uploadClickHandler = () => {
    inputFile.current.click();
  };

  const mixNameHandler = (event) => {
    setEnteredMixName(event.target.value);
  };

  const mixIngredientsHandler = (event) => {
    setEnteredMixIngredients(event.target.value);
  };

  const mixIngredientAdd = (event) => {
    if (event.keyCode === 13) {
      let ALL_INGREDIENTS = customIngredients.map((ingredient) => ingredient);
      ALL_INGREDIENTS.push(enteredMixIngredients);

      setCustomIngredients(ALL_INGREDIENTS);
      setEnteredMixIngredients("");
    }
  };

  const mixInstructionsHandler = (event) => {
    setEnteredMixInstructions(event.target.value);
  };

  const removeIngredientsTag = (deleteKey) => {
    const newArray = customIngredients.filter((ingredient, key) => {
      if (key != deleteKey) {
        return ingredient;
      }
    });

    setCustomIngredients(newArray);
  };

  const customMixSubmitHandler = () => {
    if (enteredMixName === "") {
      setInvalidErrorMsg(<p className="customMixErrorMsg">Set a name!</p>);
    } else if (customIngredients.length < 1) {
      setInvalidErrorMsg(<p className="customMixErrorMsg">Add some ingredients!</p>);
    } else if (enteredMixInstructions === "") {
      setInvalidErrorMsg(<p className="customMixErrorMsg">Set the Instructions!</p>);
    } else if (imageCheck === false) {
      setInvalidErrorMsg(<p className="customMixErrorMsg">"Upload an image!"</p>);
    } else if (props.customMixIDs.includes(enteredMixName)) {
      setInvalidErrorMsg(<p className="customMixErrorMsg">You must set a unique name!</p>);
    }
    else {

      imageCheck = false;
      const url = startUrl + "api/cocktails/custom/add/";
      const customMixData = {
        createdBy: userAccountData.name,
        idDrink: enteredMixName,
        strDrink: enteredMixName,
        strCategory: "",
        strAlcoholic: "",
        strGlass: "",
        strInstructions: enteredMixInstructions,
        strDrinkThumb: imgurl,
        strIngredients: customIngredients,
        strMeasures: [""],
      };
      try {
        axios
          .post(url, customMixData, {
            headers: { "auth-token": authCtx.token },
          })
          .then((res) => {
            props.closeDetails();
            props.reloadList();
            props.customListUpdate();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        // Error handle
      }
    }
  };

useEffect(() =>{
  displayUploadedImage(0);
  
  try {
    axios
      .get(startUrl + "api/user/info", {
        headers: { "auth-token": authCtx.token },
      })
      .then((res) => {
        setUserAccountData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log("fail");
  }
},[]);

  const displayUploadedImage = (value, img) =>{
    if (value === 0){
      setUploadIndicator(<div><div className="sp_card_custommix" onClick={uploadClickHandler}>
      <div className="sp_card_icon">
        <ion-icon name="arrow-down-outline"></ion-icon>
      </div>
      <div className="sp_card_text">Upload the Thumbnail</div>
      <div className="sp_card_upload_btn">Upload</div>
    </div>
    <input
      type="file"
      id="file"
      ref={inputFile}
      onChange={handleFileUpload}
      style={{ display: "none" }}
    /></div>);
    } else {
      setUploadIndicator(<React.Fragment><img className="customCocktailImage" onClick={uploadClickHandler} src={img}></img><input
      type="file"
      id="file"
      ref={inputFile}
      onChange={handleFileUpload}
      style={{ display: "none" }}
    /></ React.Fragment>);
    }
  }

  return (
    <Modal show={true} centered size="xl">
      <Modal.Header>
        <Modal.Title>Create Drink</Modal.Title>
        <button
          type="button"
          className="btn-close"
          onClick={() => props.closeDetails()}
          aria-label="Close"
        ></button>
      </Modal.Header>
      <Modal.Body>
        {invalidErrorMsg}
        <label className="mixformLabel">Name</label>
        <Form.Control
          placeholder="Start by typing the name of your masterpiece.."
          value={enteredMixName}
          onChange={mixNameHandler}
        />
        <label className="mixformLabel">Ingredients</label>
        <Form.Control
          placeholder="Enter one ingredients at a time.."
          onChange={mixIngredientsHandler}
          value={enteredMixIngredients}
          onKeyDown={mixIngredientAdd}
        />
        <ul className="customIngredientsList">
          {customIngredients.map((ingredient, key) => (
            <div
              key={key}
              className="ingredientsTag"
              onClick={() => removeIngredientsTag(key)}
            >
              {ingredient} <ion-icon name="close-circle-outline"></ion-icon>
            </div>
          ))}
        </ul>
        <label className="mixformLabel">Instructions</label>
        <Form.Control
          placeholder="Enter the steps to take to create it!"
          value={enteredMixInstructions}
          onChange={mixInstructionsHandler}
        />

        <div className="customMixUploadButton">
        {uploadIndicator}
        </div>
        <input
          type="file"
          id="file"
          ref={inputFile}
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </Modal.Body>
      <Modal.Footer>
     <Button variant="custom"
        className="customMixSubmitButton"
        onClick={customMixSubmitHandler}
      >
        Submit
      </Button>
      </Modal.Footer>
    </Modal>
  );

  // return (
  //   <div className="customMixDetailerContainer">
  //     <ion-icon
  //       name="close-outline"
  //       onClick={() => props.closeDetails()}
  //     ></ion-icon>
  //     <div className="customMixDetailerHeader">
  //       <h1>Create Drink</h1>
  //     </div>
  //     <p>{invalidErrorMsg}</p>

  //     <div className="createMixForm-input">
  //       <label className="mixformLabel">Name</label>
  //       <Form.Control
  //         placeholder="Start by typing the name of your masterpiece.."
  //         value={enteredMixName}
  //         onChange={mixNameHandler}
  //       />
  //     </div>
  //     <div className="createMixForm-input">
  //       <label className="mixformLabel">Ingredients</label>
  //       <Form.Control
  //         placeholder="Enter one ingredients at a time.."
  //         onChange={mixIngredientsHandler}
  //         value={enteredMixIngredients}
  //         onKeyDown={mixIngredientAdd}
  //       />
  //       <ul className="customIngredientsList">
  //         {customIngredients.map((ingredient, key) => (
  //           <div
  //             key={key}
  //             className="ingredientsTag"
  //             onClick={() => removeIngredientsTag(key)}
  //           >
  //             {ingredient} <ion-icon name="close-circle-outline"></ion-icon>
  //           </div>
  //         ))}
  //       </ul>
  //     </div>
  //     <div className="createMixForm-input">
  //       <label className="mixformLabel">Instructions</label>
  //       <Form.Control
  //         placeholder="Enter the steps to take to create it!"
  //         value={enteredMixInstructions}
  //         onChange={mixInstructionsHandler}
  //       />
  //     </div>

  //     <button className="uploadCustomPicButton" onClick={uploadClickHandler}>
  //       Upload
  //     </button>
  //     <input
  //       type="file"
  //       id="file"
  //       ref={inputFile}
  //       onChange={handleFileUpload}
  //       style={{ display: "none" }}
  //     />

  //     <button
  //       className="customMixSubmitButton"
  //       onClick={customMixSubmitHandler}
  //     >
  //       Submit
  //     </button>
  //     <img className="customCocktailImage" src={imgurl}></img>
  //   </div>
  // );
};

export default CustomMixDetailer;
