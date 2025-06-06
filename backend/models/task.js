const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, default: ""},
    user: {type: mongoose.Schema.ObjectId, ref: "User", required: true},
    status: {type: String, enum: ['pendiente','en progreso','completada'], default: 'pendiente'},
    priority: {type: String, enum: ['baja','media','alta'], default: 'media'},
    dueDate: {type: Date},
    createdAt: {type: Date, default: Date.now}
});

const Task = mongoose.model('Task',taskSchema);

module.exports = Task;