const { body, validationResult } = require('express-validator');

const verifyUpdateDebt = [
  body('amount')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('El monto debe ser un número positivo.'),

  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('La descripción no debe superar los 200 caracteres.'),

  body('creditor.user')
    .optional()
    .isMongoId()
    .withMessage('El ID del usuario acreedor no es válido.'),

  body('creditor.name')
    .optional()
    .isString()
    .withMessage('El nombre del acreedor debe ser una cadena de texto.'),

  (req, res, next) => {
    const errors = validationResult(req);
    const { creditor } = req.body;

    if (creditor && creditor.user && creditor.name) {
      return res.status(400).json({
        errors: [
          {
            msg: 'No se puede proporcionar tanto un ID de usuario como un nombre para el acreedor.',
            param: 'creditor',
            location: 'body'
          }
        ]
      });
    }

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  }
];

module.exports = verifyUpdateDebt;
