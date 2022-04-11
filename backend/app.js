//Libraries
const express = require('express');
const app = express();
const mongoose = require('mongoose');       
const dotenv = require('dotenv').config();  //For setting up the environment variables
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const common = require('./common');


//Import routes
const authRoute = require('./routes/user_account_routes/auth');
const recipeRoute = require('./routes/cocktail_recipe_routes/recipeRoute');
const imgRecognitionRoute = require('./routes/cloud-vision-routes/imgRecognitionRoutes');
const { exit } = require('process');
const { response } = require('express');
const { any } = require('joi');


//Middleware
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cors({origin: "*" }));


//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/cocktails', recipeRoute);
app.use('/api/imgrecognition/', imgRecognitionRoute);


//Connect to DB
mongoose.connect(process.env.MONGODB_URI);


// Inital setup functions
getAllIngredients()
.then( (response) => {
    common.ingredients = response;
})
.catch( (error) => {
    console.log(error);
});

// Additional Functions
 



/**
 * Get all the ingredients from the cocktailDB API
 */
 async function getAllIngredients() {

    try {
      var ingredients = new Array();
      const response = await axios.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_DB_API_KEY}/list.php?i=list`);
  
      //Populate array with only values of the ingreadients
      response.data.drinks.forEach(ingredient => {
        ingredients.push(ingredient.strIngredient1)
      });
  
      //Return the array
      return ingredients
  
    } catch (error) {
      console.log('[ERROR]: in getAllIngredients!');
      return 'error2' + error;
    }
  
}


module.exports = app;