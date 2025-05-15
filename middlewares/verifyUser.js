const {body, validationResult} = require('express-validator');


const verifyUser = [
    body('username')
    .isString()
    .withMessage('El nombre de usuario debe ser texto.')
    .isLength({min: 3})
    .withMessage('El nombre de usuario debe ter almenos 3 caracteres.'),

    body('email')
    .isEmail()
    .withMessage('Debes ingresar un email valido.'),

    body('password')
    .isLength({min: 6})
    .withMessage('La contraseña debe tener al menos 6 caracteres.'),

    body('balance')
    .optional()
    .isFloat({min: 0})
    .withMessage('El balance debe ser un numero positivo'),
   (req,res,next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array()});
        }
        next();
    }
];

module.exports = verifyUser;
