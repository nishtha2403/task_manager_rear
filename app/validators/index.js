const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);

const userRegistrationValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    role: Joi.string().required(),
    password: joiPassword.string()
                .minOfSpecialCharacters(1)
                .minOfLowercase(1)
                .minOfUppercase(1)
                .minOfNumeric(1)
                .noWhiteSpaces()
                .messages({
                    'password.minOfUppercase': 'Password should contain at least 1 uppercase character',
                    'password.minOfSpecialCharacters': 'Password should contain at least 1 special character',
                    'password.minOfLowercase': 'Password should contain at least 1 lowercase character',
                    'password.minOfNumeric': 'Password should contain at least 1 numeric character',
                    'password.noWhiteSpaces': 'Password should not contain white spaces'})
                .required(),
    tasks: Joi.array(),
    team: Joi.string()
});

const userLoginValidation = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: joiPassword.string()
                .minOfSpecialCharacters(1)
                .minOfLowercase(1)
                .minOfUppercase(1)
                .minOfNumeric(1)
                .noWhiteSpaces()
                .messages({
                    'password.minOfUppercase': 'Password should contain at least 1 uppercase character',
                    'password.minOfSpecialCharacters': 'Password should contain at least 1 special character',
                    'password.minOfLowercase': 'Password should contain at least 1 lowercase character',
                    'password.minOfNumeric': 'Password should contain at least 1 numeric character',
                    'password.noWhiteSpaces': 'Password should not contain white spaces'})
                .required()
});

module.exports = {
    userRegistrationValidation,
    userLoginValidation
}