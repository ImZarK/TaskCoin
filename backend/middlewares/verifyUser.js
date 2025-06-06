
const {body, validationResult} = require('express-validator');

const verifyUser = [
    body('username')
        .optional()
        .isString()
        .withMessage('El nombre de usuario debe ser texto.')
        .isLength({min: 3})
        .withMessage('El nombre de usuario debe ter almenos 3 caracteres.'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Debes ingresar un email valido.'),

    body('password')
        .optional()
        .isLength({min: 6})
        .withMessage('La contraseña debe tener al menos 6 caracteres.'),


   (req,res,next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
];

module.exports = verifyUser;