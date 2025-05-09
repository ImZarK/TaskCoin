const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    type: {type: String, enum: ['income','expense'], required: true},
    amount: {type: Number, required: true},
    description: {type: String, default: ""},
    createdAt: {type: Date, default: Date.now}
})

const Finance = mongoose.model('Finance', financeSchema);

module.exports = Finance;








