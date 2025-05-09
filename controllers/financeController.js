import Finance from '../models/finance';
import { findById } from '../models/user';


const addFinance = async (req, res) => {
    // La función `addFinance` se va a encargar de:
// 1. Recibir los datos desde el cuerpo del request (type, amount, description).
const {amount,type,description} = req.body;
// 2. Obtener el ID del usuario autenticado (viene de req.user.id, gracias al middleware verifyToken).
const userId = req.user.id;
// 3. Crear un nuevo objeto `Finance` con esos datos y guardarlo en MongoDB.
 const newFinance = await new Task({amount,type,description,user: userId});
// 4. Enviar una respuesta al frontend confirmando que la transacción fue guardada correctamente.
res.status(201).json({message:'Movimiento creado correctamente.'}); 
}
