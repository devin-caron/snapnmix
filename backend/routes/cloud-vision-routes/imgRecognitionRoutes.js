//Dependencies
const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const stringSimilarity = require("string-similarity");
const common = require("../../common");
const jwt = require('jsonwebtoken');


//Models
const ScannedIngredientsModel = require('../../models/ScanedIngredients');

//Import Google's cliud vision api package
const vision = require("@google-cloud/vision");
const internal = require("stream");
const ScanedIngredients = require("../../models/ScanedIngredients");

//Use types: TEXT_DETECTION and maybe LOGO_DETECTION
router.post("/", async (req, res) => {
  try {
    // Encode the image -> Later use req.body.encodedimg
    // const encoded_img = encodeBase64('./public/media/bottles7.jpg');
    const encoded_img = req.body.base64img;

    // Creat epost body for TEXT_DETECTION and LOGO_DETECTION
    const postBodyTextDetect = {
      requests: [
        {
          image: {
            content: encoded_img,
          },
          features: [
            {
              type: "TEXT_DETECTION",
              maxResults: 15,
            },
          ],
        },
      ],
    };
    const postBodyLabelDetect = {
      "requests": [
        {
          "image": {
            "content": encoded_img
          },
          "features": [
            {
              "maxResults": 25,
              "type": "LABEL_DETECTION"
            }
          ]
        }
      ]
    };

    // Make a call to Cloud Vision API and store it in arrays
    let main_detection_array = [];
    try {
      const text_detect_result = await axios.post(
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC6AbFNsHWTqOvonPF-CIXHESWcQ5rcksA",
        postBodyTextDetect
      );

      const text_detection_string = text_detect_result.data.responses[0].fullTextAnnotation.text;
      main_detection_array = text_detection_string.split("\n");

    } catch (error) {
      console.log('Error: ', error.message);
    }



    // Make a call to Cloud Vision API and store it in arrays
    const label_detect_result = await axios.post(
      "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC6AbFNsHWTqOvonPF-CIXHESWcQ5rcksA",
      postBodyLabelDetect
    );

    const label_detection_obj_array = label_detect_result.data.responses[0].labelAnnotations;
    label_detection_obj_array.forEach((obj) => {
      main_detection_array.push(obj.description);
      console.log(obj.description);
    });


    //Filter the data for the results
    let best_match = { score: Number, text: String };
    let matched_ingredients = [];
    counter = 0;
    main_detection_array.forEach((txt_detected) => {
      best_match = findBestMatch(common.ingredients, txt_detected);
      if (best_match !== null) {
        matched_ingredients.push(best_match.text);
      }
    });


    matched_ingredients = matched_ingredients.filter((item, index) => matched_ingredients.indexOf(item) === index);

    console.log(matched_ingredients);

    res.send(matched_ingredients);

  } catch (error) {
    console.log(error);
    res.send(error);
  }

});

/**
 * Final POST  requiest for getting the acutall drinks
 */
router.post("/submit", async (req, res) => {
  // const submitted_ingredients = req.body.ingredients;
  // const submitted_ingredients = ["gin", "vodka", "lemon", "rum"];

  const submitted_ingredients = req.body.ingredients;

  //Check if the user is logged in
  const token = req.header('auth-token');
  if (token) {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET); //This returns the id of the user
    console.log(verified);

    //Check if user has scanned ingredients
    const exits = await ScannedIngredientsModel.findOne({ userID: 'si' + verified._id });
    if (!exits) {
      const scannedIngredientsModel = new ScannedIngredientsModel({
        userID: 'si' + verified._id,
        ingredients: req.body.ingredients
      })

      await scannedIngredientsModel.save();

    } else {
      console.log('inside else statmeent!');

      for (let i = 0; i < submitted_ingredients.length; i++) {
        const updateIngredients = await ScannedIngredientsModel.findOneAndUpdate(
          { userID: 'si' + verified._id },
          { $addToSet: { ingredients: submitted_ingredients[i] } },
          { new: true }
        );
      };

    }

  }

  
  //Final result object
  let cocktails_json = [];

  let cocktails_array = [];


  let comb_string = "";
  for (let n = 0; n < submitted_ingredients.length; n++) {
    comb_string += n.toString();
  }

  let combinations = [];
  function string_recurse(active, rest) {
    if (rest.length == 0) {
      if (active.length > 1) {
        combinations.push(active);
      }
    } else {
      string_recurse(active + rest.charAt(0), rest.substring(1, rest.length));
      string_recurse(active, rest.substring(1, rest.length));
    }
  }
  string_recurse("", comb_string);

  console.log(combinations);


  //Different kind of for loop that waits to finish before executing next line
  await Promise.all(
    combinations.map(async (combination) => {
      if (combination !== "") {
        const num_split = combination.split("");

        csv_drinks = "";
        num_split.forEach((index) => {
          csv_drinks += submitted_ingredients[parseInt(index)] + ",";
        });
        csv_drinks = csv_drinks.substring(0, csv_drinks.length - 1);

        const response = await axios.get(
          `https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_DB_API_KEY}/filter.php?i=${csv_drinks}`
        );
        if (response) {
          if (response.data.drinks !== "None Found") {
            response.data.drinks.forEach((singleCocktail) => {
              cocktails_array.push({
                score: num_split.length,
                cocktail: singleCocktail,
              });
            });
          }
        }
      }
    })
  );

  //Clean up the cocktails array
  var cleanCocktailsArray = cocktails_array.filter((cocktails_array, index, self) =>
    index === self.findIndex((t) => (t.cocktail.strDrink === cocktails_array.cocktail.strDrink)))

  
  cocktails_json.push({
    title: 'Best Match',
    cocktails_arr: cleanCocktailsArray
  })

  // Get the recipes for the each of the ingredients
  for (let i = 0; i < submitted_ingredients.length; i++) {
    const response = await axios.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_DB_API_KEY}/filter.php?i=${submitted_ingredients[i]}`);
    if (response) {
      // console.log(response.data.drinks);
      cocktails_json.push({
        title: 'Drinks with ' + submitted_ingredients[i],
        cocktails_arr: response.data.drinks
      })

    }
  }


  res.send(cocktails_json);
});


/**
 * Custom function for checking if the ingredient exists in the db
 */
function findBestMatch(ingredients, txt_result) {
  txt_result = txt_result.toLowerCase();
  let best_matches = [];

  ingredients.forEach((ingredient) => {
    ingredient = ingredient.toLowerCase();

    //Check the whole phrase
    var full_similarity = stringSimilarity.compareTwoStrings(ingredient, txt_result);
    if (full_similarity > 0.8) {
      best_matches.push({ score: full_similarity, text: ingredient });
      return;
    }

    //Check each word if separated ' '
    text_result_parts = txt_result.split(" ");
    text_result_parts.forEach((text_part) => {
      var similarity = stringSimilarity.compareTwoStrings(ingredient, text_part);
      if (similarity > 0.8) {
        best_matches.push({ score: similarity, text: ingredient });
      }
    });
  });

  const best_score = Math.max.apply(
    Math,
    best_matches.map((o) => o.score)
  );
  const best_match = best_matches.find((o) => o.score === best_score);

  if (typeof best_match !== "undefined") {
    return best_match;
  } else {
    return null;
  }
}

/**
 * Encode the local image to base 64 string needed
 * for Cloud Vision API
 */
function encodeBase64(imgpath) {
  //Convert image to base64
  const base64 = fs.readFileSync(imgpath, "base64");
  return base64;
}

module.exports = router;
