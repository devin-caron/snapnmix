//VALIDATION 
const Joi = require('joi');

/**
 * Validate Register User
*/
const registerValidation = (data) => {
    const validationSchema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).max(30).required()
    });

    return validationSchema.validate(data);
}

/**
 * Validate Login User
 */
const loginValidation = (data) => {
    const validationSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return validationSchema.validate(data);
}




module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;