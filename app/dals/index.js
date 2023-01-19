const objectID = require('mongoose').Types.ObjectId;
const User = require('../models/users');

const registerUser = ({ name, email, mobile, role, team, password }) => {
    const tasks = [];
    return User.create({
        name,
        email,
        mobile,
        role,
        password,
        team,
        tasks
    });
}

const findUserByEmail = (email) => {
    return User.findOne({ email }, { _id: 0, password: 1 });
}

module.exports = {
    registerUser,
    findUserByEmail
}