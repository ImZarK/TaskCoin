const {body, ValidationResult, validationResult} = require('express-validator');
const { validate } = require('../models/finance');

const verifyDebt = [
    body('amount').isFloat({gt: 0}).withMessage('El monto debe ser un numero positivo'),
    body('status').default('pendiente').isIn(['pendiente','pagado']).withMessage('El estado debe ser "pendiente" o "pagado".'),
    body('description').optional().isLength({max: 200}).withMessage('La descripcion no debe superar los 200 caracteres'),
    body('creditor').custom((value) => {
        if (!value || typeof value !== 'object' ) {
            throw new Error('El acreedor debe tener una estructura valida');
        }

        const hasUser = !!value.user;
        const hasName = !!value.name;

        if ((hasUser && hasName) || (!hasUser && !hasName)) {
            throw new Error('Debe especificar solo "user" o "name" como acreedor',)

        }
        return true;

    }),

    (req,res,next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    },
];

module.exports = verifyDebt