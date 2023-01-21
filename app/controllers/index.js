const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const objectID = require('mongoose').Types.ObjectId;
const {
    userRegistrationValidation,
    userLoginValidation,
    teamValidation,
    objectIdValidation,
    userUpdationValidation,
    taskValidation
} = require('../validators');
const { registerationService } = require('../services');
const { 
    findUserByEmail, 
    registerTeam, 
    updateUserData, 
    deleteUserFromDB, 
    findUserById,
    updateTeamMembers,
    removeEmployeeFromTasks,
    removeEmployeeFromTeam,
    createNewTaskInDB,
    updateUserTasks,
    removeTaskFromUser,
    removeTaskFromAssignee,
    updateTaskDetails,
    deleteTaskFromDb
} = require('../dals');
const { customError, sendError, sendOK } = require('../helpers');

/**
 * @desc Register a new manager with it's team details
 * @route /setup
 * @param {*} req 
 * @param {*} res 
 */
const register = async (req, res) => {
    try {
        const { name, email, mobile, role, password } = await userRegistrationValidation.validateAsync(req.body);   
        const user = await registerationService({ name, email, mobile, role, password });
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
        
        const { name, mobile, role, password, tasks, team } = await findUserByEmail(email);
        if (!password) throw customError(400, `User doesn't exist`);

        const isPasswordCorrect = bcrypt.compareSync(enteredPassword, password);
        if (isPasswordCorrect) {
            const accessToken = jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: '2d' });
            const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET);
            return sendOK(res, { 
                name,
                email,
                mobile,
                role,
                team,
                tasks,
                token: { accessToken, refreshToken }
            });
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

/**
 * @desc Create a new Team
 * @route /create-team
 * @param {object} req 
 * @param {object} res 
 */
const createTeam = async (req, res) => {
    try {
        const { team_id, name, members } = await teamValidation.validateAsync(req.body);
        const { _id: manager} = await findUserByEmail(req.user.email);
        const pendingValidation = members.map(async (member) => userRegistrationValidation.validateAsync(member));
        const validatedMembers = await Promise.all(pendingValidation);
        const pendingMemberCreation = validatedMembers.map(async (member) => registerationService({ ...member, team: team_id }));
        const registeredMembers = await Promise.all(pendingMemberCreation);
        const registeredTeam = await registerTeam({ team_id, name, members: registeredMembers, manager })
        return sendOK(res, registeredTeam);
    } catch(err) {
        console.error('ERROR | createTeam | ', err);
        return sendError(res, err);
    }
}

/**
 * @desc Create a new Member
 * @route /create-team
 * @param {object} req 
 * @param {object} res 
 */
const newMember = async (req, res) => {
    try {
        const { role } = await findUserByEmail(req.user.email);
        if (role !== 'manager') throw customError(401, 'Only managers are allowed to create member');

        const userDetails = await userRegistrationValidation.validateAsync(req.body);   
        const user = await registerationService(userDetails);

        await updateTeamMembers({ id: userDetails.team, userId: user._id });

        return sendOK(res, user);
    } catch(err) {
        console.error('ERROR | createTeam | ', err);
        return sendError(res, err);
    }
}

/**
 * @desc Update Team Member Details
 * @route /member/:id
 * @param {object} req 
 * @param {object} res 
 */
const updateMember = async (req, res) => {
    try {
        const { role } = await findUserByEmail(req.user.email);
        if (role !== 'manager') throw customError(401, 'Only managers are allowed to update member');
        
        const { id } = await objectIdValidation.validateAsync(req.params);
        if (!objectID.isValid(id)) throw customError(400, 'Enter a valid id');
        
        const data = await userUpdationValidation.validateAsync(req.body);
        const updated = await updateUserData({ id, data });
        return sendOK(res, updated);
    } catch(err) {
        console.error('ERROR | updateMember | ', err);
        return sendError(res, err);
    }
}

/**
 * @desc Delete Team Member
 * @route /member/:id
 * @param {object} req 
 * @param {object} res 
 */
const deleteMember = async (req, res) => {
    try {
        const { role } = await findUserByEmail(req.user.email);
        if (role !== 'manager') throw customError(401, 'Only managers are allowed to update member');

        const { id } = await objectIdValidation.validateAsync(req.params);
        if(!objectID.isValid(id)) throw customError(400, 'Enter a valid id');

        const { team } = await findUserById(id);
        await removeEmployeeFromTasks(id);
        await removeEmployeeFromTeam(team, id);

        const deleted = await deleteUserFromDB(id);
        return sendOK(res, deleted);
    } catch(err) {
        console.error('ERROR | deleteMember | ', err);
        return sendError(res, err);
    }
}

/**
 * @desc Create New Task
 * @route /task
 * @param {object} req 
 * @param {object} res 
 */
const newTask = async (req, res) => {
    try {
        const { _id: managerId, role } = await findUserByEmail(req.user.email);
        if (role !== 'manager') throw customError(401, 'Only managers are allowed to create new task');

        const taskDetails = await taskValidation.validateAsync(req.body);
        if(taskDetails.assignee && !objectID.isValid(taskDetails.assignee)) throw customError(400, 'Enter a valid assignee id');

        const due_date = new Date(taskDetails.due_date);
        const task = await createNewTaskInDB({ ...taskDetails, due_date, created_by: managerId });
        await updateUserTasks({ id: managerId, taskId: task._id });
        if (taskDetails.assignee) await updateUserTasks({ id: taskDetails.assignee, taskId: task._id });

        return sendOK(res, task);
    } catch(err) {
        console.error('ERROR | fetchAllTasks | ', err);
        return sendError(res, err);
    }
}

/**
 * @desc Update Task
 * @route /task
 * @param {object} req 
 * @param {object} res 
 */
const updateTask = async (req, res) => {
    try {
        const { _id: managerId, role } = await findUserByEmail(req.user.email);
        if (role !== 'manager') throw customError(401, 'Only managers are allowed to update task');

        const { id } = await objectIdValidation.validateAsync(req.params);
        if(!objectID.isValid(id)) throw customError(400, 'Enter a valid id');

        const newTaskDetails = await taskValidation.validateAsync(req.body);
        if(newTaskDetails.assignee) {
            if(!objectID.isValid(newTaskDetails.assignee)) throw customError(400, 'Enter a valid assignee id');
            await removeTaskFromAssignee(id);
        }

        const task = await updateTaskDetails(id, { 
            ...newTaskDetails, 
            ...newTaskDetails.due_date && { due_date: new Date(newTaskDetails.due_date) }
        });
        await updateUserTasks({ id: managerId, taskId: task._id });
        if (newTaskDetails.assignee) await updateUserTasks({ id: newTaskDetails.assignee, taskId: task._id });

        return sendOK(res, task);
    } catch(err) {
        console.error('ERROR | updateTask | ', err);
        return sendError(res, err);
    }
}

/**
 * @desc Delete Task
 * @route /task
 * @param {object} req 
 * @param {object} res 
 */
const deleteTask = async (req, res) => {
    try {
        const { _id: managerId, role } = await findUserByEmail(req.user.email);
        if (role !== 'manager') throw customError(401, 'Only managers are allowed to delete task');

        const { id: taskId } = await objectIdValidation.validateAsync(req.params);
        if(!objectID.isValid(taskId)) throw customError(400, 'Enter a valid id');
        
        await removeTaskFromAssignee(taskId);
        await removeTaskFromUser(managerId, taskId);

        const deleted = await deleteTaskFromDb(taskId);
        return sendOK(res, deleted);
    } catch(err) {
        console.error('ERROR | updateTask | ', err);
        return sendError(res, err);
    }
}


module.exports = {
    register,
    login,
    refreshToken,
    createTeam,
    newMember,
    updateMember,
    deleteMember,
    newTask,
    updateTask,
    deleteTask
}