const mongoose = require('mongoose');

const teamSchema = mongoose.Schema(
    {
        team_id: {
            type: String,
            required: [true, 'Please provide unique team_id'],
            unique: true
        },
        name: {
            type: String
        },
        members: [{
            type: mongoose.Schema.ObjectId,
            ref: 'users'
        }],
        manager: {
            type: mongoose.Schema.ObjectId,
            ref: 'users'
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('teams', teamSchema);