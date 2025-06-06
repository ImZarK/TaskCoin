const Debt = require('../models/debt');
const Finance = require('../models/finance');

const addDebt = async (req, res) => {
  try {
    const {amount,creditor,description} = req.body;
    const userId = req.user.id;
   if ((creditor.name && creditor.user) 
    && (!creditor.name && !creditor.user)) {
    return res.status(400).json({message:'Debes proporcionar o un nombre o un ID de usuario, no ambos.'})
   }
    const newDebt =  new Debt({debtor: userId,amount,description, creditor}); 
    await newDebt.save();
    res.status(201).json({message:'Deuda creada correctamente.', debt: newDebt})
  } catch (error) {
    console.error(error)
    res.status(500).json({message:'Ocurrio un error al crear la deuda.', error: error.message});
  }
}

const getDebts = async (req, res) => {
  try {
      const userId = req.user.id;
    const debts = await Debt.find({debtor: userId}).sort({createdAt: -1});
    if (debts.length === 0) {
        return res.status(404).json({message:'No tienes ninguna deuda registrada.'});
    }
    res.status(200).json({message: 'Deudas encontradas:', debts})
  } catch (error) {
    console.error(error)
    res.status(500).json({message:'Ocurrio un error al crear la deuda.', error: error.message});
  }
    
}

const payDebt = async (req,res) => {
   try {
     const userId = req.user.id;
     const debtId = req.params.id;
     const debt = await Debt.findById(debtId);

     if (!debt) {
        return res.status(404).json({message: 'No se ha encontrado la deuda'});
     }
     if (debt.debtor.toString() !== userId) {
        return res.status(403).json({message: 'No tienes permiso para modificar esta deuda'})
     }
     if (debt.status === 'pagado') { 
        return res.status(400).json({message:'Esta deuda ya esta pagada.'});
     }

     debt.status = 'pagado';
     debt.paidAt = Date.now();
     await debt.save();

  
     const creditorName = debt.creditor?.name || 'Acreedor Desconocido';
     const expenseDescription = debt.description 
                                ? `Pago de deuda: ${debt.description}` 
                                : `Pago de deuda a ${creditorName}`;

     const newExpense = new Finance({
        user: userId,
        type: 'expense',
        amount: debt.amount,
        description: expenseDescription
     });
     await newExpense.save();
    

     res.status(200).json({message: 'Deuda pagada correctamente y gasto registrado.', debt});

   } catch (error) {
    console.error(error)
    res.status(500).json({message:'Error al pagar la deuda.', error: error.message});
   }
}

const getDebtsSummary = async (req,res) => {
  try {
      const userId = req.user.id;
    const debts = await Debt.find({debtor: userId});
    if (debts.length === 0) {
        return res.status(404).json({message:'No tienes ninguna deuda registrada'});
    }
    let totalPending = 0;
    let totalPaid = 0;
    debts.forEach(debt => {
        if (debt.status === 'pendiente') {
            totalPending += debt.amount;
        }else if(debt.status === 'pagado'){
            totalPaid += debt.amount
        }
    });
    res.status(200).json({totalPending,totalPaid});
  } catch (error) {
      console.error(error)
    res.status(500).json({message:'Error al obtener el resumen de deudas.', error: error.message});
  }
}

const deleteDebt = async (req,res) => {
    try {
        const userId = req.user.id;
    const debtId = req.params.id;
    const debt = await Debt.findById(debtId);
    if (!debt) {
        return res.status(404).json({message:'La deuda no existe.'});
    }
    if (debt.debtor.toString() !== userId) {
        return res.status(403).json({message:'No tienes permisos para eliminar esta deuda.'});
    }
     await Debt.findByIdAndDelete(debtId);
    res.status(200).json({message:'Deuda eliminada correctamente'});
    } catch (error) {
        console.error(error)
    res.status(500).json({message:'Error al eliminar la deuda.', error: error.message});
    }
}

const updateDebt = async (req,res)  => {
  try {
    const userId = req.user.id;
    const debtId = req.params.id;
    const debt = await Debt.findById(debtId);
    if (!debt) {
      return res.status(400).json({message:'Deuda no encontrada'});
    }
    if (debt.debtor.toString() !== userId) {
      return res.status(403).json({message:'No tienes permiso para modificar esta deuda'});
    }
    const allowedFields = ['amount','description','creditor']
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
      }
    });
    const newDebt = await Debt.findByIdAndUpdate(debtId,updates,{new: true, runValidators: true});
    res.status(200).json({message:'Deuda actualizada correctamente', debt: newDebt});
  } catch (error) {
    console.error(error)
    res.status(500).json({message:'Error al actualizar la deuda.', error: error.message});
  }
}

module.exports = {addDebt, deleteDebt, getDebts, getDebtsSummary, payDebt, updateDebt}

