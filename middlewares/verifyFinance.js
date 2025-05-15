const {body, validationResult} = require('express-validator');

const verifyFinance = [
    body('amount').isFloat({gt: 0}).withMessage('El monto debe ser un numero positivo.'),
    body('type').isIn(['expense','income']).withMessage('El tipo debe ser income o expense.'),
    body('description').optional().isLength({max: 200}).withMessage('La descripcion no debe superar los 200 caracteres'),
    (req,res,next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
];

module.exports = verifyFinance