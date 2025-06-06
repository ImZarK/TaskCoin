const express = require('express');
const router = express.Router()
const verifyFinance = require('../middlewares/verifyFinance');
const verifyToken = require('../middlewares/verifyToken');
const verifyFinanceUpdate = require('../middlewares/verifyFinanceUpdate');


const {
  addExpense,
  addFinance,
  addIncome,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
  getBalance,
  getBalanceSummary,
  getRecentExpenses,
  getRecentIncomes,
  getExpenses,
  getIncomes
} = require('../controllers/financeController');

router.post('/add-expense', verifyToken, verifyFinance, addExpense);
router.post('/add-income', verifyToken, verifyFinance, addIncome);
router.post('/add-transaction', verifyToken, verifyFinance, addTransaction);
router.post('/add-finance', verifyToken, addFinance);

router.put('/update-transaction/:id', verifyToken, verifyFinanceUpdate, updateTransaction);
router.delete('/delete-transaction/:id', verifyToken, deleteTransaction);

router.get('/all-transactions', verifyToken, getAllTransactions);
router.get('/expenses', verifyToken, getExpenses);
router.get('/incomes', verifyToken, getIncomes);
router.get('/recent-expenses', verifyToken, getRecentExpenses);
router.get('/recent-incomes', verifyToken, getRecentIncomes);

router.get('/balance', verifyToken, getBalance);
router.get('/balance-summary', verifyToken, getBalanceSummary);

module.exports = router;

