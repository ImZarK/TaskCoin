import React, { useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../axiosConfig';
import { Link } from 'react-router-dom';

const EditIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>;
const DeleteIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>;
const AddIcon = () => <svg className="w-4 h-4 inline-block mr-2 -mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>;

const TaskFormModal = ({ initialTaskData, onSave, onCancel, formMode }) => {
    const defaultTask = { 
        title: '', 
        description: '', 
        status: 'pendiente', 
        priority: 'media', 
        dueDate: '' 
    };
    const formattedInitialTaskData = initialTaskData 
        ? { ...defaultTask, ...initialTaskData, dueDate: initialTaskData.dueDate ? initialTaskData.dueDate.split('T')[0] : '' }
        : defaultTask;

    const [formData, setFormData] = useState(formattedInitialTaskData);

    useEffect(() => {
         const newFormattedData = initialTaskData 
            ? { ...defaultTask, ...initialTaskData, dueDate: initialTaskData.dueDate ? initialTaskData.dueDate.split('T')[0] : '' }
            : defaultTask;
        setFormData(newFormattedData);
    }, [initialTaskData]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = { ...formData };
        if (!dataToSave.dueDate) { 
            delete dataToSave.dueDate;
        }
        onSave(dataToSave);
    };

    const title = formMode === 'add' ? 'Añadir Nueva Tarea' : 'Editar Tarea';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-40 flex justify-center items-center p-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">{title}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título <span className="text-red-500">*</span></label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                <option value="pendiente">Pendiente</option>
                                <option value="en progreso">En Progreso</option>
                                {formMode === 'edit' && <option value="completada">Completada</option>}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                            <select name="priority" id="priority" value={formData.priority} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                <option value="baja">Baja</option>
                                <option value="media">Media</option>
                                <option value="alta">Alta</option>
                            </select>
                        </div>
                    </div>
                     <div className="mb-6">
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
                        <input type="date" name="dueDate" id="dueDate" 
                               value={formData.dueDate} 
                               onChange={handleChange} 
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm">
                            {formMode === 'add' ? 'Crear Tarea' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [editingTask, setEditingTask] = useState(null); 
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/tasks');
            setTasks(response.data?.tasks || []);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError("No se pudieron cargar las tareas.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const filteredTasks = useMemo(() => {
        if (!searchTerm) return tasks;
        return tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [tasks, searchTerm]);

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'alta': return { borderColor: 'border-red-600', textColor: 'text-red-700', bgColor: 'bg-red-100' };
            case 'media': return { borderColor: 'border-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-100' };
            case 'baja': return { borderColor: 'border-green-500', textColor: 'text-green-700', bgColor: 'bg-green-100' };
            default: return { borderColor: 'border-gray-300', textColor: 'text-gray-700', bgColor: 'bg-gray-100' };
        }
    };
    
    const getStatusStyles = (status) => {
         switch (status) {
            case 'pendiente': return { textColor: 'text-yellow-700', bgColor: 'bg-yellow-100' };
            case 'en progreso': return { textColor: 'text-blue-700', bgColor: 'bg-blue-100' };
            case 'completada': return { textColor: 'text-green-700', bgColor: 'bg-green-100' };
            default: return { textColor: 'text-gray-700', bgColor: 'bg-gray-100' };
        }
    };
    
    const openAddTaskModal = () => {
        setModalMode('add');
        setEditingTask(null); 
        setShowTaskModal(true);
    };

    const openEditModal = (task) => {
        setModalMode('edit');
        setEditingTask(task); 
        setShowTaskModal(true);
    };

    const closeTaskModal = () => {
        setShowTaskModal(false);
        setEditingTask(null); 
    };

    const handleSaveTask = async (taskData) => {
        setError(null);
        if (modalMode === 'add') {
            try {
                const payload = {
                    title: taskData.title,
                    description: taskData.description || "", 
                    status: taskData.status || 'pendiente',
                    priority: taskData.priority || 'media',
                };
                if (taskData.dueDate) {
                    payload.dueDate = taskData.dueDate;
                }

                const response = await apiClient.post('/tasks/createTask', payload);
                if (response.data && response.data.task) {
                    setTasks(prevTasks => [response.data.task, ...prevTasks]);
                    closeTaskModal();
                }
            } catch (err) {
                console.error("Error creating task:", err.response || err);
                setError(err.response?.data?.errors ? err.response.data.errors.map(e => e.msg).join(', ') : (err.response?.data?.message || "No se pudo crear la tarea."));
            }
        } else if (modalMode === 'edit' && editingTask) {
            try {
                const payload = {
                    title: taskData.title,
                    description: taskData.description,
                    status: taskData.status,
                    priority: taskData.priority,
                };
                 if (taskData.dueDate) {
                    payload.dueDate = taskData.dueDate;
                } else {
                    
                }

                const response = await apiClient.put(`/tasks/${editingTask._id}`, payload);
                if (response.data && response.data.task) {
                    setTasks(prevTasks => 
                        prevTasks.map(task => 
                            task._id === editingTask._id ? response.data.task : task
                        )
                    );
                    closeTaskModal();
                }
            } catch (err) {
                console.error("Error updating task:", err.response || err);
                 setError(err.response?.data?.errors ? err.response.data.errors.map(e => e.msg).join(', ') : (err.response?.data?.message || "No se pudo actualizar la tarea."));
            }
        }
    };
        
    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            return;
        }
        setError(null);
        try {
            await apiClient.delete(`/tasks/${taskId}`);
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        } catch (err) {
            console.error("Error deleting task:", err);
            setError(err.response?.data?.message || "No se pudo eliminar la tarea. Inténtalo de nuevo.");
        }
    };
    
    const handleMarkAsComplete = async (taskId) => {
        setError(null);
        try {
            const response = await apiClient.put(`/tasks/${taskId}`, { status: 'completada' });
            if (response.data && response.data.task) {
                setTasks(prevTasks => 
                    prevTasks.map(task => 
                        task._id === taskId ? response.data.task : task
                    )
                );
            }
        } catch (err) {
            console.error("Error marking task as complete:", err);
            setError(err.response?.data?.message || "No se pudo actualizar la tarea. Inténtalo de nuevo.");
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center flex-grow p-8">Cargando tareas...</div>;
    }

    if (error && tasks.length === 0 && !isLoading) { 
        return <div className="flex flex-col justify-center items-center flex-grow p-8 text-red-500">
                   <p>{error}</p>
                   <button onClick={fetchTasks} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm">Reintentar</button>
               </div>;
    }
    
    return (
        <>
            <div className="container mx-auto p-4 md:p-8 flex flex-col flex-grow min-h-0">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
                    <input 
                        type="text" 
                        placeholder="Buscar tarea..." 
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto order-2 sm:order-1"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button 
                        onClick={openAddTaskModal}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-150 ease-in-out text-sm sm:text-base w-full sm:w-auto order-1 sm:order-2"
                    >
                        <AddIcon />
                        Añadir Nueva Tarea
                    </button>
                </div>

                {error && ( 
                     <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center">
                        {error} 
                       
                    </div>
                )}

                <div className="space-y-4 flex-grow overflow-y-auto pb-4">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map(task => {
                            const priorityStyles = getPriorityStyles(task.priority);
                            const statusStyles = getStatusStyles(task.status);
                            return (
                                <div key={task._id} className={`bg-white shadow-lg rounded-xl p-5 border-l-4 ${priorityStyles.borderColor}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                                        <div className="flex space-x-2">
                                            <button onClick={() => openEditModal(task)} className="text-gray-400 hover:text-blue-600" title="Editar Tarea"><EditIcon /></button>
                                            <button onClick={() => handleDeleteTask(task._id)} className="text-gray-400 hover:text-red-600" title="Eliminar Tarea"><DeleteIcon /></button>
                                        </div>
                                    </div>
                                    {task.description && <p className="text-gray-600 text-sm mb-3">{task.description}</p>}
                                    <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs items-center">
                                        <span className={`px-3 py-1 font-bold leading-tight rounded-full ${statusStyles.textColor} ${statusStyles.bgColor}`}>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
                                        <span className={`px-3 py-1 font-bold leading-tight rounded-full ${priorityStyles.textColor} ${priorityStyles.bgColor}`}>Prioridad: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                                        {task.dueDate && <span className="text-gray-500">Vence: {new Date(task.dueDate).toLocaleDateString()}</span>}
                                    </div>
                                    {task.status !== 'completada' && (
                                        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end ">
                                            <button 
                                                onClick={() => handleMarkAsComplete(task._id)}
                                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out"
                                            >
                                                Marcar como Completada
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            <p>No hay tareas que mostrar {searchTerm && 'con los filtros actuales'}.</p>
                            {!searchTerm && !isLoading && <p>¡Intenta añadir una nueva tarea!</p>}
                        </div>
                    )}
                </div>
            </div>
            
            {showTaskModal && (
                <TaskFormModal 
                    initialTaskData={editingTask} 
                    onSave={handleSaveTask}
                    onCancel={closeTaskModal}
                    formMode={modalMode} 
                />
            )}
        </>
    );
};

export default TasksPage;