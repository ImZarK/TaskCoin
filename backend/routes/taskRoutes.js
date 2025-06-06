const express = require('express');
const router = express.Router();
const {createTask,getTasks,updateTask,deleteTask} = require('../controllers/taskController');
const verifyTask = require('../middlewares/verifyTask');
const verifyToken = require('../middlewares/verifyToken')
const verifyTaskUpdate = require('../middlewares/verifyTaskUpdate');

router.post('/createTask', verifyToken, verifyTask, createTask);
router.get('/',verifyToken, getTasks);
router.put('/:id',verifyToken, updateTask);
router.delete('/:id',verifyToken, deleteTask);

module.exports = router;