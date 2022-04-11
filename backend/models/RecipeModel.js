const { array } = require('joi');
const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    userID: { type: String, unique: true },
    favRecipes: []
});


module.exports = mongoose.model('FavoriteRecipes', recipeSchema);


// idDrink: Number,
//         strDrink: String,
//         strDrinkAlternate: String,
//         strTags: [String],
//         strVideo: String,
//         strCategory: String,
//         strIBA: String,
//         strAlcoholic: String,
//         strGlass: String,
//         strInstructions: String,
//         strInstructionsES: String,
//         strInstructionsDE: String,
//         strInstructionsFR: String,
//         strInstructionsIT: String,
//         'strInstructionsZH-HANS': String,
//        'strInstructionsZH-HANT': String,
//         strDrinkThumb: String,
//         strIngredient1: String,
//         strIngredient2: String,
//         strIngredient3: String,
//         strIngredient4: String,
//         strIngredient5: String,
//         strIngredient6: String,
//         strIngredient7: String,
//         strIngredient8: String,
//         strIngredient9: String,
//         strIngredient10: String,
//         strIngredient11: String,
//         strIngredient12: String,
//         strIngredient13: String,
//         strIngredient14: String,
//         strIngredient15: String,
//         strMeasure1: String,
//         strMeasure2: String,
//         strMeasure3: String,
//         strMeasure4: String,
//         strMeasure5: String,
//         strMeasure6: String,
//         strMeasure7: String,
//         strMeasure8: String,
//         strMeasure9: String,
//         strMeasure10: String,
//         strMeasure11: String,
//         strMeasure12: String,
//         strMeasure13: String,
//         strMeasure14: String,
//         strMeasure15: String,
//         strImageSource: String,
//         strImageAttribution: String,
//         strCreativeCommonsConfirmed: String,
//         dateModified: Date