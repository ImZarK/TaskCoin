const express = require("express");
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit')
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require("cors");
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const taskRoutes = require('./routes/taskRoutes.js');
const financeRoutes = require('./routes/financeRoutes.js');
const debtRoutes = require('./routes/debtRoutes.js');

const limiter = rateLimit({windowMs: 1*60*1000, max: 100})



const app = express();


// Middleware
app.use(express.json());
app.use(cors());
app.use(mongoSanitize());
app.use(limiter);

// Conectar a MongoDB
const connectDB = async () => {
    
    try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connectado a mongoDB Atlas!!!");
    } catch (error) {
        console.log("Hubo un error al intentar conectarse:", error);
        process.exit(1);
    }
    
};
connectDB();
// Ruta de prueba
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/debt', debtRoutes);

// Levantar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("✅ Servidor corriendo en http://localhost:" +  PORT))

