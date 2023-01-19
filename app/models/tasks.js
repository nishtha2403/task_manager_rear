const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        title: {
            type: String
        },
        description: {
            type: String
        },
        assignee: {
            type: mongoose.Schema.ObjectId,
            ref: 'user'
        },
        status: {
            type: String
        },
        priority: {
            type: String
        },
        due_date: {
            type: Date
        },
        created_by: {
            type: mongoose.Schema.ObjectId,
            ref: 'user'
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('tasks', taskSchema);