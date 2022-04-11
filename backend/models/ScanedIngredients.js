const mongoose = require("mongoose");

const scannedIngredientsSchema = mongoose.Schema({
    userID: { type: String, unique: true },
    ingredients: []
});

module.exports = mongoose.model('ScannedIngredients', scannedIngredientsSchema);
