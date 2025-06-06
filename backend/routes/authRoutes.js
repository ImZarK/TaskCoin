const express = require('express');
const router = express.Router();
const {registerUser,loginUser,updateUser} = require('../controllers/authController.js');
const verifyUser = require('../middlewares/verifyUser.js');
const verifyToken = require('../middlewares/verifyToken.js');

router.post('/register', verifyUser,registerUser);
router.post('/login', loginUser);
router.put('/update-profile', verifyUser, verifyToken, updateUser);



module.exports = router;