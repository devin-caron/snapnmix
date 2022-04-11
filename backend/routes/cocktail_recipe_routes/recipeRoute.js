//Dependencies
const express = require("express");
const router = express.Router();
const axios = require('axios');

//Database models
const RecipeModel = require("../../models/RecipeModel");
const CustomRecipeModel = require("../../models/CustomRecipe");

//Validation middlware
const verify_token = require('../verify-token');
const { custom } = require("joi");


/**
 * GET all cocktail categories
 * /api/cocktails/categories
 */
router.get("/categories", async function (req, res) {

    try {
        const api_response = await axios.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_DB_API_KEY}/list.php?c=list`);
        res.status(200).send(api_response.data);
    } catch (error) {
        res.status(400).send('Problems while getting cocktail categories.');
    }

});


/**
 * GET cocktail by categories
 * /api/cocktails/categories/:categoryID
 */
router.get("/categories/:categoryID", async function (req, res) {

    try {
        const api_response = await axios.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_DB_API_KEY}/filter.php?c=${req.params.categoryID}`);
        res.status(200).send(api_response.data);
    } catch (error) {
        res.status(400).send('Problems while looking up the cocktails by their category.');
    }

});


/**
 * GET all cocktails by first letter
 * /api/cocktails/all/:letter
 */
router.get("/all/:letter", async function (req, res) {

    if (req.params.letter < 'a' && req.params.letter > 'z') {
        return res.status(401).send('Search letter must be in tange a-z');
    }

    try {
        const api_response = await axios.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_DB_API_KEY}/search.php?f=${req.params.letter}`);
        res.status(200).send(api_response.data);
    } catch (error) {
        res.status(400).send('Problems while looking up the cocktails by the first letter.');
    }

});


/**
 * GET most popular cocktails
 * /api/cocktails/popular
 */
router.get("/popular", async function (req, res) {

    try {
        const api_response = await axios.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_DB_API_KEY}/popular.php`);
        res.status(200).send(api_response.data);
    } catch (error) {
        res.status(400).send('Problems while looking up the most popular cocktails.');
    }

});



/**
 * GET latest cocktails
 * /api/cocktails/latest
 */
router.get("/latest", async function (req, res) {

    try {
        const api_response = await axios.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_DB_API_KEY}/latest.php`);
        res.status(200).send(api_response.data);
    } catch (error) {
        res.status(400).send('Problems while looking up the latest cocktails.');
    }

});


/**
 * GET random cocktail
 * /api/cocktails/random
 */
router.get("/random", async function (req, res) {

    try {
        const api_response = await axios.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_DB_API_KEY}/random.php`);
        res.status(200).send(api_response.data);
    } catch (error) {
        res.status(400).send('Problems while looking up the random cocktail.');
    }

});


/**
 * Add to favorites
 */
 router.post('/favorites/add/:cocktailID', verify_token, async function (req, res) {

    //Make call to external API using axios to get the recipe
    const response = await axios.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_DB_API_KEY}/lookup.php?i=${req.params.cocktailID}`);
    const pulledRecipe = response.data.drinks[0];
    console.log(pulledRecipe);
    if (!pulledRecipe) return res.status(400).send('Cocktail with the specified ID does not exist.');


    //check if user already in db for favorite recipes
    const userHasFavoriteRecipes = await RecipeModel.findOne({ userID: `sm${req.user._id}` });
    if (userHasFavoriteRecipes) {

        //Check if the recipe already exists
        const favoriteRecipeExists = await RecipeModel.findOne({ userID: `sm${req.user._id}`, "favRecipes": { $elemMatch: { 'idDrink': req.params.cocktailID } } });
        console.log(favoriteRecipeExists);
        if (favoriteRecipeExists) {
            res.send({ success: false, message: 'Recipe already added to favorite recipes' })
        } else {
            // Find the user and add the recipe to the db
            try {
                const theOne = await RecipeModel.findOneAndUpdate(
                    {
                        userID: "sm" + req.user._id
                    },
                    {
                        '$push': { favRecipes: pulledRecipe }
                    }
                )
                res.send({ success: true, message: 'Recipe added succesfuly' });
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    else {

        //Make a db model
        const recipeModel = new RecipeModel({
            userID: `sm${req.user._id}`,
            favRecipes: [pulledRecipe]
        })

        const savedRecipe = await recipeModel.save();
        res.send({ success: true, message: 'Nev record created, recipe added.' })
    }

});


/**
 * Remove to favorites
 */
router.post('/favorites/remove/:removeID', verify_token, async function (req, res) {

    const userHasFavoriteRecipes = await RecipeModel.findOne({ userID: `sm${req.user._id}` });
    if (userHasFavoriteRecipes) {
        //Check if the recipe already exists
        const customRecipeExists = await RecipeModel.findOne({ userID: `sm${req.user._id}`, "favRecipes": { $elemMatch: { 'idDrink': req.params.removeID } } })
        if (customRecipeExists) {
            try {
                const theOne = await RecipeModel.findOneAndUpdate(
                    {
                        userID: "sm" + req.user._id
                    },
                    {
                        '$pull': { favRecipes: { 'idDrink': req.params.removeID } }
                    }
                )
                res.send({ success: true, message: 'Recipe removed succesfuly' });
            } catch (error) {
                console.log(error.message);
            }
        } else {
            res.send({ success: false, message: 'Recipe with the specified ID does not exits.' })
        }
    } else {
        res.send({ success: false, message: 'Customer does not have a list of favorite cocktails.' })
    }

});


/**
 * Get all favorites
 */
router.get('/favorites', verify_token, async function (req, res) {

    try {
        const favorites = await RecipeModel.findOne({ userID: `sm${req.user._id}` });
        if (!favorites) return res.status(200).send({ success: true, message: 'You did not add any recipes to favorites.' });
        res.send({ success: true, favRecipes: favorites });
    } catch (error) {
        res.status(400).send('Error while getting the list of the favorite recipes.');
    }

});


/**
 * Implement Search feature
 */
router.get("/search/:searchWord", async function (req, res) {

    try {
        const api_response = await axios.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_DB_API_KEY}/search.php?s=${req.params.searchWord}`)
        if (!api_response.data) return res.status(400).send('Invalid Search Word.');
        res.status(200).send(api_response.data);
    } catch (error) {
        res.status(400).send('Error while searching for the recipes.');
    }

});

/* Implement Search ingredient feature
 */
 router.get("/search/i/:searchWord", async function (req, res) {

    try {
        const api_response = await axios.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_DB_API_KEY}/search.php?i=${req.params.searchWord}`)
        if (!api_response.data) return res.status(400).send('Invalid Search Word.');
        res.status(200).send(api_response.data);
    } catch (error) {
        res.status(400).send('Error while searching for the recipes.');
    }

});


/**
 * Add a custom cocktail
 */
router.post('/custom/add/', verify_token, async function (req, res) {

    const userHasCustomRecipes = await CustomRecipeModel.findOne({ userID: `smc${req.user._id}` });
    if (userHasCustomRecipes) {
        console.log('Customer exists!!');

        const customRecipeJson = {
            createdBy: req.body.createdBy,
            idDrink: req.body.idDrink,
            strDrink: req.body.strDrink,
            strCategory: req.body.strCategory,
            strAlcoholic: req.body.strAlcoholic,
            strGlass: req.body.strGlass,
            strInstructions: req.body.strInstructions,
            strDrinkThumb: req.body.strDrinkThumb,
            strIngredients: req.body.strIngredients,
            strMeasures: req.body.strMeasures
        }

        //Check if the recipe already exists
        const customRecipeExists = await CustomRecipeModel.findOne({ userID: `smc${req.user._id}`, "customRecipes": { $elemMatch: { 'strDrink': req.body.strDrink } } })
        if (customRecipeExists) {
            res.send({ success: false, message: 'Recipe already added to custom recipes' })
        } else {
            // Fin the user and add the recipe to the db
            try {
                const theOne = await CustomRecipeModel.findOneAndUpdate(
                    {
                        userID: "smc" + req.user._id
                    },
                    {
                        '$push': { customRecipes: customRecipeJson }
                    }
                )
                res.send({ success: true, message: 'Recipe added succesfuly' });
            } catch (error) {
                console.log(error.message);
            }

        }


    } else {
        const customRecipe = new CustomRecipeModel({
            userID: "smc" + req.user._id,
            userName: req.user.name,
            customRecipes: [{
                createdBy: req.body.createdBy,
                idDrink: req.body.idDrink,
                strDrink: req.body.strDrink,
                strCategory: req.body.strCategory,
                strAlcoholic: req.body.strAlcoholic,
                strGlass: req.body.strGlass,
                strInstructions: req.body.strInstructions,
                strDrinkThumb: req.body.strDrinkThumb,
                strIngredients: req.body.strIngredients,
                strMeasures: req.body.strMeasures
            }]
        });
        const savedRecipe = await customRecipe.save();
        res.send({ success: true, message: 'Nev record created, recipe added.' })
    }

});


/**
 * Remove the custom cocktail
 */
router.post('/custom/remove/:removeID', verify_token, async function (req, res) {
    const userHasCustomRecipes = await CustomRecipeModel.findOne({ userID: `smc${req.user._id}` });
    if (userHasCustomRecipes) {
        //Check if the recipe already exists
        const customRecipeExists = await CustomRecipeModel.findOne({ userID: `smc${req.user._id}`, "customRecipes": { $elemMatch: { 'idDrink': req.params.removeID } } })
        if (customRecipeExists) {
            try {
                const theOne = await CustomRecipeModel.findOneAndUpdate(
                    {
                        userID: "smc" + req.user._id
                    },
                    {
                        '$pull': { customRecipes: { 'idDrink': req.params.removeID } }
                    }
                )
                res.send({ success: true, message: 'Recipe removed succesfuly' });
            } catch (error) {
                console.log(error.message);
            }
        } else {
            res.send({ success: false, message: 'Recipe with the specified ID does not exits.' })
        }
    } else {
        res.send({ success: false, message: 'Customer does not have a list of custom cocktails.' })
    }
});


/**
* Get all the custom cocktailss created by the users
*/
router.get('/custom/all', async function (req, res) {

    //get the user name
    const result = await CustomRecipeModel.find({}).select('customRecipes');
    let allCustomRecipes = [];

    result.forEach(filtered => {
        
        filtered.customRecipes.forEach(customRecipe => {
            allCustomRecipes.push(customRecipe);
        });

    });

    res.send(allCustomRecipes);

});

/**
 * Get all customs for a user
 */
router.get('/custom', verify_token, async function (req, res) {

    try {
        const custom = await CustomRecipeModel.findOne({ userID: `smc${req.user._id}` });
        if (!custom) return res.status(200).send({ success: true, message: 'You did not add any recipes to custom.' });
        res.send({ success: true, customRecipes: custom });
    } catch (error) {
        res.status(400).send('Error while getting the list of the favorite recipes.');
    }

});




module.exports = router;
