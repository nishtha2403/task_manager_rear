const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide username']
        }, 
        email: {
            type: String,
            required: [true, 'Please provide user email'],
            unique: true
        },
        mobile: {
            type: String,
            required: [true, 'Please provide user mobile number'],
            unique: true
        },
        role: {
            type: String,
            required: [true, 'Please provide user role in team']
        },
        password: {
            type: String,
            required: [true, 'Please provide user password'],
            unique: true
        },
        team: {
            type: mongoose.Schema.ObjectId,
            ref: 'teams'
        },
        tasks: {
            type: Array
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('users', userSchema);