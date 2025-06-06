const Finance = require('../models/finance.js');


const addFinance = async (req, res) => {
const {amount,type,description} = req.body;
const userId = req.user.id;
 const newFinance =  new Finance({user: userId,amount,type,description});
 await newFinance.save();
res.status(201).json({message:'Movimiento creado correctamente.'}); 
}

const addExpense = async (req, res) => {
const {amount,type,description} = req.body;
const userId = req.user.id;
if (type !== 'expense') {
    return res.status(400).json({message: "El tipo debe ser expense."})
}
 const newFinance =  new Finance({user: userId,amount,type,description});
 await newFinance.save();
res.status(201).json({message:'Movimiento creado correctamente.'}); 
}

const addIncome = async (req, res) => {
const {amount,type,description} = req.body;
const userId = req.user.id;
if (type !== 'income') {
    return res.status(400).json({message: "El tipo debe ser income."})
}
 const newFinance =  new Finance({user: userId,amount,type,description});
 await newFinance.save();
res.status(201).json({message:'Movimiento creado correctamente.'}); 
}

const addTransaction = async (req, res) => {
const {amount,type,description} = req.body;
const userId = req.user.id;
if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({message: "Introduce un tipo de transaccion valido."})
}
 const newFinance =  new Finance({user: userId,amount,type,description});
 await newFinance.save();
res.status(201).json({message:'Movimiento creado correctamente.'}); 
}



const getAllTransactions = async (req,res) => {
  console.log(`BACKEND: getAllTransactions alcanzado. User ID: ${req.user?.id}`); // LOG
  try {
    const userId = req.user.id;
    const transactions = await Finance.find({user: userId}).sort({createdAt: -1});
    if (transactions.length === 0) {
      console.log(`BACKEND: getAllTransactions - No se encontraron transacciones para el usuario ${userId}`); // LOG
      return res.status(404).json({message:'No se encontro ninguna transaccion'});
    }
    console.log(`BACKEND: getAllTransactions - Transacciones encontradas para el usuario ${userId}:`, transactions.length); // LOG
    res.status(200).json({message:'Transacciones encontradas:',transactions });
  } catch (error) {
    console.error("Error en getAllTransactions:", error); // LOG
    res.status(500).json({message:'Ocurrio un error al listar las transacciones.', error: error.message});
  }
}

const getExpenses = async (req,res) => {
try {
    //sacar  id
    userId = req.user.id
    const expenses = await Finance.find({user: userId, type: 'expense'});
    if (expenses.length === 0) {
        return res.status(404).json({message: 'No se encontro ningun gasto.'});
    }
    //devolver los expenses
    res.status(200).json({message:'Gastos encontrados:', expenses});
    //cerrar el catch
} catch (error) {
    console.error(error)
    res.status(500).json({message:'Error al listar los expenses', error: error.message});
}
}
const getIncomes = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomes = await Finance.find({ user: userId, type: "income" }).sort({ createdAt: -1 });

    if (incomes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron ingresos.' });
    }

    res.status(200).json({ message: 'Ingresos encontrados:', incomes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar los ingresos.', error: error.message });
  }
};

const getRecentExpenses = async (req,res) => {
    try {
    //id
    const userId = req.user.id;
    //buscar los ultimos 3 gastos con .limit() recuerda indicar que es un 'expense'
    const recentExpenses = await Finance.find({user: userId, type: 'expense'}).sort({createdAt: -1}).limit(3);
    //si no se consigue devolver un mensaje de error
    if (recentExpenses.length === 0) {
        return res.status(404).json({message:'No se encontro ningun gasto'});
    }
    //devolver los gastos
    res.status(200).json({message:'Gastos recientes encontrados', recentExpenses});
   //cerrar el catch
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Ocurrio un error al listar los gastos'});
    }
    
}

const getRecentIncomes = async (req,res) => {
    try {
    //id
    const userId = req.user.id;
    //buscar los ultimos 3 gastos con .limit() recuerda indicar que es un 'expense'
    const recentIncomes = await Finance.find({user: userId, type: 'income'}).sort({createdAt: -1}).limit(3);
    //si no se consigue devolver un mensaje de error
    if (recentIncomes.length === 0) {
        return res.status(404).json({message:'No se encontro ningun ingreso'});
    }
    //devolver los gastos
    res.status(200).json({message:'Ingresos recientes encontrados', recentIncomes});
   //cerrar el catch
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Ocurrio un error al listar los ingresos'});
    }
    
}

const getBalance = async (req, res) => {
    try {
        const userId = req.user.id;
         const allTransactions = await Finance.find({user: userId});
        let balance = 0;
        allTransactions.forEach(transaccion => {
            if (transaccion.type === 'expense') {
                balance -= transaccion.amount;
            }else if(transaccion.type === 'income'){
                balance += transaccion.amount;
            }
        });
        res.status(200).json({balance});
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Ocurrio un error al tratar de encontrar el balance de tu cuenta', error: error.message})
    }
}

async function getBalanceSummary(req, res) {
    console.log(`BACKEND: getBalanceSummary alcanzado. User ID: ${req.user?.id}`); 
    try {
        const userId = req.user.id;
        const transactions = await Finance.find({ user: userId });
        let balance = 0;
        let totalIncome = 0;
        let totalExpense = 0;
        if (transactions.length === 0) {
            console.log(`BACKEND: getBalanceSummary - No hay transacciones para usuario ${userId}, devolviendo ceros.`); 
            return res.status(200).json({ totalIncome: 0, totalExpense: 0, balance: 0 });
        }
        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
                balance += transaction.amount;
            } else if (transaction.type === 'expense') {
                totalExpense += transaction.amount;
                balance -= transaction.amount;
            }
        });
        console.log(`BACKEND: getBalanceSummary - Resumen para usuario ${userId}:`, { totalIncome, totalExpense, balance });
        res.status(200).json({ totalIncome, totalExpense, balance });
    } catch (error) {
        console.error("Error en getBalanceSummary:", error); 
        res.status(500).json({ message: 'Ocurrio un error al calcular tu balance', error: error.message });
    }
}

const updateTransaction = async (req,res) => {
try {
    const transactionId = req.params.id;
const userId = req.user.id;
const {type,amount,description} = req.body;
const transaction = await Finance.findById(transactionId);
if (!transaction) {
    return res.status(404).json({message:'Transaccion no encontrada'});
}
if (transaction.user.toString() !== userId) {
    return res.status(403).json({message: 'No tienes permiso para modificar esta transacción.'})
}
const updatedTransaction = await Finance.findByIdAndUpdate(transactionId,{type,amount,description},{new: true, runValidators:true});
res.status(200).json({ message: 'Transacción actualizada con éxito', transaction: updatedTransaction });

} catch (error) {
    console.error(error);
    res.status(500).json({message:'Ocurrio un error al actualizar la transaccion', error: error.message});
}

}

const deleteTransaction = async (req,res) => {
   try {
     const userId = req.user.id;
    const transactionId = req.params.id;
    const transaction = await Finance.findById(transactionId);
    if (!transaction) {
        return res.status(404).json({message:'Transaccion no encontrada'});
    }
    if (transaction.user.toString() !== userId) {
        return res.status(403).json({message: 'No tienes permiso para eliminar esta transacción.'})
    }    
    const deletedTransaction = await Finance.findByIdAndDelete(transactionId)
    res.status(200).json({message:'Transaccion eliminada correctamente'});
   } catch (error) {
       console.error(error);
    res.status(500).json({message:'Ocurrio un error al eliminar la transaccion', error: error.message});
   }
}

module.exports = {addExpense,addFinance,addIncome,addTransaction,updateTransaction,deleteTransaction,getAllTransactions,getBalance,
    getBalanceSummary,getRecentExpenses,getRecentIncomes,getExpenses,getIncomes}



