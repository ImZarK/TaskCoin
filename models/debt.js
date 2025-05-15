const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
    debtor: {type: mongoose.Schema.ObjectId, ref: "User", required: true},
    creditor: { type: {
        user:{type: mongoose.Schema.ObjectId, ref: 'User', default: null},
        name:{type: String, default: null}
    }, 
validate: {
    validator: function(value){
        return (value.user !== null || value.name !== null) && !(value.user && value.name);
    },
     message: "El acreedor debe ser un usuario (ID) o un nombre, no ambos."
}, required: true},
amount: {type: Number, required: true},
description: {type: String, default: ""},
status: {type: String, enum: ['pendiente','pagado'], default: 'pendiente'},
createdAt: {type: Date, default: Date.now},
paidAt: {type: Date, default: Date.now}
})

 const Debt = mongoose.model('Debt',debtSchema);

 module.exports = Debt;