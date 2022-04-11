//Base dependencies
const express = require('express');
const router = express.Router();

//Models
const User = require('../../models/User');
const FavoritesModel = require('../../models/RecipeModel');
const CustomsModel = require('../../models/CustomRecipe');

//Aditional dependencies
const {registerValidation, loginValidation} = require('../../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const verify_token = require('../verify-token');

/**
 * REGISTER A USER
 */
router.post('/register', async (req, res) => {
    
    //Validate the registration of the user
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send({success: false, message: error.details[0].message});

    //Check if the user is already in the database
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send({success: false, message: 'Email already exists.'});

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    //Save the user to the database
    try {
        const savedUser = await user.save();
        res.status(200).send({success: true, user: savedUser._id});
    } catch (error) {
        res.status(500).send({success: false, message: "Iternal server error while adding user to the database"});
    }
    
});


/**
 * LOGIN A USER
 */
router.post('/login', async (req, res) => {

    //Validate the registration of the user
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send({success: false, message: error.details[0].message});

    //Check if the user exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send({success: false, message: 'Incorrect Email or Password.'});

    //Check if the password is correct
    const validPassowrd = await bcrypt.compare(req.body.password, user.password);
    if(!validPassowrd) return res.status(400).send({success: false, message: 'Incorrect password.'});

    //Create and assign JsonWebToken
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).status(200).send({success: true, token: token});

});


/**
 * Get all the user info
 */
router.get('/info', verify_token, async (req, res) => {

    const favorites = await FavoritesModel.findOne({userID: "sm"+req.user._id});
    const customs = await CustomsModel.findOne({userID: "smc"+req.user._id});

    let countFavorites = 0;
    let countCustoms = 0;


    if(favorites !== null) {
        countFavorites = favorites.favRecipes.length;
    }
    
    if(customs !== null){
        countCustoms = customs.customRecipes.length;
    }
        

    console.log(countFavorites);
    console.log(countCustoms);


    const user = await User.findOne({_id: req.user._id});
    res.status(200).send({success: true, message: "User info data", data: {
        name: user.name,
        email: user.email,
        date: user.date,
        favoriteCount: countFavorites,
        customCount: countCustoms
    }});
});



module.exports = router;