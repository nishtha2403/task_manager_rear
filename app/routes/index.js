const express = require('express');
const router = express.Router();

const { 
    register,
    login,
    refreshToken,
    createTeam,
    allTeamMembers,
    newMember,
    updateMember,
    deleteMember,
    allTask,
    newTask,
    updateTask,
    deleteTask
} = require('../controllers');
const { authenticateUser } = require('../helpers');

router.post('/register', register);
router.post('/login', login);
router.get('/refresh-token', refreshToken);
router.post('/team', authenticateUser, createTeam)
      .get('/team/:id', authenticateUser, allTeamMembers);
router.post('/member', authenticateUser, newMember)
      .put('/member/:id', authenticateUser, updateMember)
      .delete('/member/:id', authenticateUser, deleteMember);
router.get('/task', authenticateUser, allTask)
      .post('/task', authenticateUser, newTask)
      .put('/task/:id', authenticateUser, updateTask)
      .delete('/task/:id', authenticateUser, deleteTask);

module.exports = router;