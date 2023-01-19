const jwt = require('jsonwebtoken');

/**
 * Create custom error
 * @param {number} statusCode Response status code
 * @param {string} message Response error message
 * @returns Error Object with custom status code and error message
 */
const customError = (status=500, message='Something went wrong') => {
    let err = new Error(message);
    err.status = status;
    return err;
};

/**
 * Send error message in response to the request
 * @param {object} res Response to the request
 * @param {object} err Error occured
 */
const sendError = (res, err) => {
    if (err.isJoi === true) {
		err.status = 400;
	}
    const status = err.status || 500;
    const message = err.message || err.data.message || 'Something went wrong';
    return res.status(status).send({
        message
    });
};

/**
 * Sends HTTP success response
 * @param {object} res HTTP response object
 * @param {*} message response message
 * @returns implementation of response.send
 */
const sendOK = (res, message) => {
	return res.status(200).send({
        message
    });
};

/**
 * Authentication Middleware
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @param {*} next 
 */
const authenticateUser = (req,res,next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = authenticateUser;


module.exports = {
    customError,
    sendError,
    sendOK,
    authenticateUser
}