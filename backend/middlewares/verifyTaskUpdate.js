const { body, validationResult } = require('express-validator');

const verifyTaskUpdate = [
  body('title').optional().isString().withMessage('El título debe ser un texto'),
  body('status').optional().isIn(['pendiente', 'en progreso', 'completada']),
  body('priority').optional().isIn(['baja', 'media', 'alta']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

module.exports = verifyTaskUpdate;
