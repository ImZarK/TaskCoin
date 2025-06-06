const express = require('express');
const router = express.Router();
const {addDebt, deleteDebt,getDebts,getDebtsSummary,payDebt, updateDebt} = require('../controllers/debtController.js');
const verifyToken = require('../middlewares/verifyToken.js');
const verifyDebt = require('../middlewares/verifyDebt.js');
const verifyUpdateDebt = require('../middlewares/verifyUpdateDebt.js');


router.post('/add', verifyToken,verifyDebt, addDebt); // crear deuda
router.get('/', verifyToken, getDebts);    // ver todas las deudas del usuario
router.get('/summary', verifyToken, getDebtsSummary); // resumen de deudas
router.delete('/:id', verifyToken, deleteDebt);       // eliminar deuda por ID
router.put('/pay/:id', verifyToken, verifyUpdateDebt, payDebt);
router.put('/:id', verifyToken, verifyUpdateDebt, updateDebt); 


module.exports = router;