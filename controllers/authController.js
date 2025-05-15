
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const {username,email,password} = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{email}, {username}]});
        if (existingUser) {
            return res.status(400).json({message: 'El usuario ya existe con ese email o nombre de usuario.'})
        }
        if (typeof password !== 'string' || password.length < 6 ) {
            return res.status(400).json({message:"La contraseña deberia tener al menos 6 caracteres"});
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser =new User({username,email,password: hashedPassword});
        await newUser.save();

        res.status(201).json({message: 'Usuario registrado con exito',
            user: {id: newUser._id, username: newUser.username, email: newUser.email}
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Error en el servidor', error: error.message});
    }
  
};

const loginUser = async (req, res) => {
    const {username,email,password} = req.body;
    try {
        const user = await User.findOne({ $or: [{username},{email}]});
        if (!user) {
            return res.status(404).json({message: 'Usuario no encontrado.'}) ;           
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch) {
            return res.status(404).json({message: 'Contraseña incorrecta.'});
        }

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: '1h'});
        res.status(201).json({message: 'login exitoso',token, user: {id: user._id,username: user.username,email: user.email}});
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Error en el servidor', error: error.message});
    }
    
}

const updateUser = async (req,res) => {
    try {
    const allowedFields = ['username','password','email'];
    const updates = {};

    allowedFields.forEach(field => {
         if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
         }
    });
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
   return res.status(404).json({message:'Usuario no encontrado.'});

    }
    const updatedUser = await User.findByIdAndUpdate(userId,updates,{new: true, runValidators: true});
    res.status(200).json({message:'Usuario actualizado correctamente.', user: updatedUser});
    } catch (error) {
         console.error(error)
        res.status(500).json({message:'Error al actualizar el perfil.', error: error.message});
    }

}


module.exports = { registerUser,loginUser,updateUser};