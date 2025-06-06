const express = require('express');
const User = require('../models/user.js');
const verifyToken = require('../middlewares/verifyToken.js');
const router = express.Router();

router.get('/me',verifyToken, async(req,res) => {
try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({user})
} catch (error) {
    res.status(500).json({message:'Error al obtener el usuario.'});
}
});

module.exports = router;