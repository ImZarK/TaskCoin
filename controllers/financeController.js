const Finance = require('../models/finance.js');


const addFinance = async (req, res) => {
    // La función `addFinance` se va a encargar de:
// 1. Recibir los datos desde el cuerpo del request (type, amount, description).
const {amount,type,description} = req.body;
// 2. Obtener el ID del usuario autenticado (viene de req.user.id, gracias al middleware verifyToken).
const userId = req.user.id;
// 3. Crear un nuevo objeto `Finance` con esos datos y guardarlo en MongoDB.
 const newFinance =  new Finance({user: userId,amount,type,description});
 await newFinance.save();
// 4. Enviar una respuesta al frontend confirmando que la transacción fue guardada correctamente.
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
  try {
      const userId = req.user.id;
    const transactions = await Finance.find({user: userId}).sort({createdAt: -1});
    if (transactions.length === 0) {
        return res.status(404).json({message:'No se encontro ninguna transaccion'});
    }
    res.status(201).json({message:'Transacciones encontradas:',transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({message:'Ocurrior un error al listar las tareas.', error: error.message});
  }

}

const getExpenses = async (req,res) => {
try {
    //sacar el id
    userId = req.user.id
    //buscar los expenses con la condicon type: 'expenses'
    const expenses = await Finance.find({user: userId, type: 'expense'});
    //si el resultado es undefined devolver un mensaje de error
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
        //Obtener el userId desde el req.user.id
        const userId = req.user.id;
         //Como siempre, para filtrar solo los datos del usuario autenticado.
         //Buscar todas las transacciones del usuario con Finance.find({ user: userId })
         const allTransactions = await Finance.find({user: userId});
         //Necesitamos tanto ingresos como gastos.
         //Inicializar un balance en 0
        let balance = 0;
         //Iremos sumando o restando según el tipo de transacción.
         //Recorrer cada transacción con un .forEach()
        allTransactions.forEach(transaccion => {
            //Si el tipo es 'expense', se resta del balance.
            if (transaccion.type === 'expense') {
                balance -= transaccion.amount;
                 //Si el tipo es 'income', se suma al balance.
            }else if(transaccion.type === 'income'){
                balance += transaccion.amount;
            }
        });
        //Devolver el balance como respuesta JSON
        res.status(200).json({balance});
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Ocurrio un error al tratar de encontrar el balance de tu cuenta', error: error.message})
    }
}

const getBalanceSummary = async (req,res) => {
   try {
     const userId = req.user.id;
    const transactions = await Finance.find({user: userId});
    let balance = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    if (transactions.length === 0) {
        return res.status(200).json({totalIncome: 0,totalExpense: 0,balance: 0});
    }
    transactions.forEach(transaction => {
    if (transaction.type === 'income') {
        totalIncome += transaction.amount;
        balance += transaction.amount;
    }else if(transaction.type === 'expense'){
        totalExpense += transaction.amount;
        balance -= transaction.amount;
    }
    });

    res.status(200).json({totalIncome,totalExpense,balance});
   } catch (error) {
    console.error(error)
    res.status(500).json({message:'Ocurrio un error al calcular tu balance', error: error.message});
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



