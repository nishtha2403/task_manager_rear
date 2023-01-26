const objectID = require('mongoose').Types.ObjectId;
const User = require('../models/users');
const Tasks = require('../models/tasks');
const Teams = require('../models/teams');

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
    return User.findOne({ email }).populate('tasks');
}

const registerTeam = ({ team_id, name, members, manager }) => {
    members = members.map(member => member._id);
    return Teams.create({
        team_id,
        name,
        members,
        manager
    });
}

const updateTeamMembers = ({ id, userId }) => {
    return Teams.findByIdAndUpdate(id, { $push: { members: userId } });
}

const updateUserData = ({ id, data}) => {
    return User.findByIdAndUpdate(id, data);
}

const deleteUserFromDB = (id) => {
    return User.deleteOne({ _id: id })
}

const findUserById = (id) => {
    return User.findById(id);
}

const removeEmployeeFromTasks = (id) => {
    return Tasks.updateMany({ assignee: id}, { $unset: { assignee: "" }}, { multi: true });
}

const removeEmployeeFromTeam = async (teamId, memberId) => {
    const { members } = await Teams.findById(teamId);
    const updatedMembers = members.filter(member => member.toString() !== memberId.toString());
    return Teams.findByIdAndUpdate(teamId, { members: updatedMembers });
}

const createNewTaskInDB = (taskDetails) => {
    return Tasks.create(taskDetails);
}

const updateTaskDetails = (taskId, newTaskDetails) => {
    return Tasks.findByIdAndUpdate(taskId, newTaskDetails);
}

const updateUserTasks = ({id, taskId}) => {
    return User.findByIdAndUpdate(id, { $push: { tasks: taskId } })
}

const removeTaskFromUser = async (userId, taskId) => {
    const { tasks } = await User.findById(userId);
    const updatedtasks = tasks.filter(task => task.toString() !== taskId.toString());
    return User.findByIdAndUpdate(userId, { tasks: updatedtasks });
}

const removeTaskFromAssignee = async (taskId) => {
    const { assignee } = await Tasks.findById(taskId, { assignee: 1 });
    return assignee ? removeTaskFromUser(assignee, taskId) : '';
}

const deleteTaskFromDb = (taskId) => {
    return Tasks.deleteOne({ _id: taskId });
}

const getTeamDetails = (teamId) => {
    return Teams.findById(teamId).populate([{path: 'manager', select: 'name email mobile'}, {path: 'members', select: 'name email mobile'}]);
}

module.exports = {
    registerUser,
    findUserByEmail,
    registerTeam,
    updateTeamMembers,
    updateUserData,
    deleteUserFromDB,
    findUserById,
    removeEmployeeFromTasks,
    removeEmployeeFromTeam,
    createNewTaskInDB,
    updateTaskDetails,
    updateUserTasks,
    removeTaskFromUser,
    removeTaskFromAssignee,
    deleteTaskFromDb,
    getTeamDetails
}