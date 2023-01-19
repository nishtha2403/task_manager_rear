const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
    userRegistrationValidation,
    userLoginValidation
} = require('../validators');
const {
    registerUser, findUserByEmail
} = require('../dals');
const {
    sendError,
    sendOK
} = require('../helpers');
const { saltrounds } = require('../constants');

/**
 * @desc Register a new manager with it's team details
 * @route /setup
 * @param {*} req 
 * @param {*} res 
 */
const register = async (req, res) => {
    try {
        const { name, email, mobile, role, password, team } = await userRegistrationValidation.validateAsync(req.body);   
        const salt = bcrypt.genSaltSync(saltrounds);   
        const encryptedPassword = bcrypt.hashSync(password, salt);  
        const user = await registerUser({ name, email, mobile, role, team, password: encryptedPassword });
        return sendOK(res, user);
    } catch(err) {
        console.error('ERROR | register | ', err);
        return sendError(res, err);
    }
}

/**
 * @desc Login user with email and password
 * @route /login
 * @param {*} req 
 * @param {*} res 
 */
const login = async (req, res) => {
    try {
        const { email, password: enteredPassword } = await userLoginValidation.validateAsync(req.body);   
        
        const { password } = await findUserByEmail(email);
        if (!password) throw customError(400, `User doesn't exist`);

        const isPasswordCorrect = bcrypt.compareSync(enteredPassword, password);
        if (isPasswordCorrect) {
            const accessToken = jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: '2d' });
            const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET);
            return sendOK(res, { accessToken, refreshToken });
        } else {
            throw customError(400, 'Password Incorrect');
        }
    } catch(err) {
        console.error('ERROR | login | ', err);
        return sendError(res, err);
    }
}

/**
 * @desc Refresh Token 
 * @route /refresh-token
 * @param {*} req 
 * @param {*} res 
 */
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken) return res.sendStatus(401);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,user) => {
            if(err) return res.sendStatus(403);
            const accessToken = jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn: '2d'});
            return sendOK(res, { accessToken });
        })
    } catch(err) {
        console.error('ERROR | refreshToken | ', err);
        return sendError(res, err);
    }
}

module.exports = {
    register,
    login,
    refreshToken
}