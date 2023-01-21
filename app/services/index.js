const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
    registerUser
} = require('../dals');
const { saltrounds } = require('../constants');

/**
 * @desc registerationService
 * @route /setup
 * @param {*} req 
 * @param {*} res 
 */
const registerationService = async ({ name, email, mobile, role, password, team }) => {
    try {
        const salt = bcrypt.genSaltSync(saltrounds);   
        const encryptedPassword = bcrypt.hashSync(password, salt);  
        return registerUser({ name, email, mobile, role, password: encryptedPassword, team });
    } catch(err) {
        console.error('ERROR | registerationService | ', err);
        return sendError(res, err);
    }
}

module.exports = {
    registerationService
}