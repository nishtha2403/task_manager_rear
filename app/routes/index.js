const express = require('express');
const router = express.Router();

const { 
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
} = require('../controllers');
const { authenticateUser } = require('../helpers');

router.post('/register', register);
router.post('/login', login);
router.get('/refresh-token', refreshToken);
router.post('/create-team', authenticateUser, createTeam);
router.post('/member', authenticateUser, newMember)
      .put('/member/:id', authenticateUser, updateMember)
      .delete('/member/:id', authenticateUser, deleteMember);
router.post('/task', authenticateUser, newTask)
      .put('/task/:id', authenticateUser, updateTask)
      .delete('/task/:id', authenticateUser, deleteTask);

module.exports = router;