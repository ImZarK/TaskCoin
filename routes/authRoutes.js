const express = require('express');
const router = express.Router();
const {registerUser,loginUser} = require('../controllers/authController.js')

router.post('/register',registerUser);
router.post('/login', loginUser);
router.get('/ping', async (req, res) => {
    res.status(200).json({message: 'Connectado a la API de TaskCoin!'})
})



module.exports = router;