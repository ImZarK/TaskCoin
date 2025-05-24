const {body, validationResult} = require('express-validator');

const verifyTask = [
    body('title').isString().notEmpty(),
    body('status').isIn(['pendiente','en progreso','completada']),
    body('priority').isIn(['baja','media','alta']),
  (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
        next();   
    }
    
];

module.exports = verifyTask;