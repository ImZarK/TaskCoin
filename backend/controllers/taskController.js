const Task = require('../models/task.js');

const createTask = async (req, res) => {
    const {title, description} = req.body;
    const userId = req.user.id
try {
    const newTask = new Task({title,description, user: userId});
    await newTask.save();
    res.status(201).json({message: 'Tarea creada con exito.', task: newTask});
} catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error al crear la tarea', error: error.message});
}   
};



const getTasks = async (req, res) => {
   try {
    const userId = req.user.id;
    const tasks = await Task.find({user: userId});
        return res.status(200).json({ tasks })
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Error listando tareas:', error: error.message});
    }
   }


const updateTask = async (req, res, ) => {
    try {
          //Obtener el ID de la tarea desde la URL
    const taskId = req.params.id;
    //Obtener el ID del usuario autenticado
    const userId = req.user.id
    // guardar los datos actualizados
    const allowedFields = ['title','description','status','priority','dueDate']
    const updates = {}
    for (const key of allowedFields){
        if ( req.body[key] !== undefined) {
            updates[key] = req.body[key];
        }
    }
    //Buscar la tarea por su ID
    const task = await Task.findById(taskId);
    //Verificar que esa tarea exriste
    if (!task) {
       return res.status(404).json({message: 'No se ha encontrado la tarea.'}) 
    }
    //Verificar que esa tarea le pertenece al usuario
    if (task.user.toString() !== userId) {
        return res.status(403).json({message: 'No tienes permiso para modificar esta tarea.'}) 
    }
    //Actualizar la tarea con los nuevos datos
    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {new: true, runValidators: true});
    res.status(200).json({message: 'Tarea actualizada con exito!', task: updatedTask});
    //Devolver una respuesta exitosa o con error
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando la tarea.', error: error.message })
    }
}


const deleteTask = async (req, res) => {
try {
    //	Obtener el taskId desde req.params.id	Para saber qué tarea se quiere eliminar
const taskId = req.params.id;
//	Obtener el userId desde req.user.id	Para saber quién está intentando eliminar
const userId = req.user.id;
//	Buscar la tarea en la base de datos con Task.findById	Para verificar si existe
const task = await Task.findById(taskId);
//	Si no existe, devolver un error 404	No se puede borrar algo que no existe
if (!task) {
    return res.status(404).json({message: 'No se ha encontrado la tarea.'}); 
}
//	Verificar si el user de la tarea coincide con userId	Seguridad: no puedes eliminar tareas ajenas
if (task.user.toString() !== userId) {
    return res.status(403).json({message: 'No tienes permiso para modificar esta tarea.'}) 
}
//	Si es el dueño, usar Task.findByIdAndDelete	Eliminar la tarea
    await Task.findByIdAndDelete(taskId);
//	Devolver mensaje de éxito
res.status(200).json({message: 'Tarea eliminada con exito!'})
// 	Confirmación para el frontend
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando la tarea.', error : error.message })
}
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};