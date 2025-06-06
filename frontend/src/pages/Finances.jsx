import React, { useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../axiosConfig';

// Iconos
const PlusIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path></svg>;
const MinusIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>;
const EditIconSmall = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>;
const DeleteIconSmall = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>;


const FinancesPage = () => {
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [operationError, setOperationError] = useState(null); 
    const [activeFilter, setActiveFilter] = useState('todos');

    const [showFormModal, setShowFormModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [formData, setFormData] = useState({ description: '', amount: '', type: 'income' }); 
    const [formError, setFormError] = useState('');

 const fetchData = useCallback(async (showLoading = true) => {
        if(showLoading) setIsLoading(true);
        setError(null); 
        setOperationError(null); 

        try {
            const summaryPromise = apiClient.get('/finance/balance-summary');
            const transactionsPromise = apiClient.get('/finance/all-transactions');
            
            
            const results = await Promise.allSettled([summaryPromise, transactionsPromise]);

            let criticalError = null;

            
            const summaryResult = results[0];
            if (summaryResult.status === 'fulfilled') {
                setSummary(summaryResult.value.data);
            } else { 
                console.error("Error fetching balance summary:", summaryResult.reason);
                
                if (summaryResult.reason?.response?.status === 401 || summaryResult.reason?.response?.status === 403) {
                    criticalError = "Error de autenticación.";
                } else {
            
                  
                    if (summaryResult.reason?.response?.status !== 404) {
                        criticalError = criticalError || "No se pudo cargar el resumen financiero.";
                    } else {
                         console.warn("getBalanceSummary devolvió 404, lo cual es inesperado. Ver logs del backend.");
                         criticalError = criticalError || "Error al cargar resumen financiero (404 inesperado).";
                    }
                }
            }

            const transactionsResult = results[1];
            if (transactionsResult.status === 'fulfilled') {
                setTransactions(transactionsResult.value.data?.transactions || []);
            } else { 
                console.error("Error fetching all transactions:", transactionsResult.reason);
                if (transactionsResult.reason?.response?.status === 401 || transactionsResult.reason?.response?.status === 403) {
                    criticalError = "Error de autenticación.";
                } else if (transactionsResult.reason?.response?.status === 404 && transactionsResult.reason?.response?.data?.message === 'No se encontro ninguna transaccion') {
                  
                    console.log("Nota: No se encontraron transacciones para este usuario.");
                    setTransactions([]); 
                } else {
                  
                    criticalError = criticalError || "No se pudieron cargar las transacciones.";
                }
            }

            if (criticalError) {
                setError(criticalError);
                if (criticalError === "Error de autenticación.") {
                   
                }
            }

        } catch (err) {
           
            console.error("Error general en fetchData:", err);
            setError("Ocurrió un error inesperado al cargar los datos.");
        } finally {
            if(showLoading) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredTransactions = useMemo(() => {
        if (activeFilter === 'ingresos') {
            return transactions.filter(t => t.type === 'income');
        }
        if (activeFilter === 'gastos') {
            return transactions.filter(t => t.type === 'expense');
        }
        return transactions; 
    }, [transactions, activeFilter]);

    const openFormModal = (mode, transactionOrType = null) => {
        setModalMode(mode);
        setOperationError(null);
        setFormError('');
        if (mode === 'edit' && transactionOrType) { 
            setEditingTransaction(transactionOrType);
            setFormData({
                description: transactionOrType.description || '',
                amount: transactionOrType.amount.toString(),
                type: transactionOrType.type 
            });
        } else { 
            setEditingTransaction(null);
            setFormData({ description: '', amount: '', type: transactionOrType || 'income' });
        }
        setShowFormModal(true);
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        setEditingTransaction(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError(''); 
        setOperationError(null);

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setFormError('El monto debe ser un número positivo.');
            return;
        }

        const payload = {
            amount: parseFloat(formData.amount),
            description: formData.description || '',
            type: formData.type 
        };

        try {
            if (modalMode === 'add') {
                const endpoint = payload.type === 'income' ? '/finance/add-income' : '/finance/add-expense';
                await apiClient.post(endpoint, payload);
            } else if (modalMode === 'edit' && editingTransaction) {
               
                const updatePayload = {
                    amount: payload.amount,
                    description: payload.description,
                    type: payload.type
                };
                await apiClient.put(`/finance/update-transaction/${editingTransaction._id}`, updatePayload);
            }
            
            closeFormModal();
            await fetchData(false);
        } catch (err) {
            console.error(`Error ${modalMode === 'add' ? 'adding' : 'updating'} transaction:`, err.response?.data || err.message);
            const errorMsg = err.response?.data?.errors 
                             ? err.response.data.errors.map(errItem => errItem.msg).join(', ') 
                             : (err.response?.data?.message || `No se pudo ${modalMode === 'add' ? 'añadir' : 'actualizar'} la transacción.`);
            setFormError(errorMsg);
        }
    };
        
    const handleDeleteTransaction = async (transactionId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
            return;
        }
        setOperationError(null);
        try {
            await apiClient.delete(`/finance/delete-transaction/${transactionId}`);
            await fetchData(false); 
        } catch (err) {
            console.error("Error deleting transaction:", err);
            setOperationError(err.response?.data?.message || "No se pudo eliminar la transacción.");
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center flex-grow p-8">Cargando finanzas...</div>;
    }

    if (error && transactions.length === 0 && !isLoading) {
        return <div className="flex flex-col justify-center items-center flex-grow p-8 text-red-500">
                   <p>{error}</p>
                   <button onClick={() => fetchData(true)} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm">Reintentar</button>
               </div>;
    }

    return (
        <>
            <div className="container mx-auto p-4 md:p-8 flex flex-col flex-grow min-h-0">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
                    <h3 className="text-xl font-semibold text-gray-800 text-center sm:text-left">Gestión de Ingresos y Gastos</h3>
                    <div className="flex space-x-3 w-full sm:w-auto">
                        <button 
                            onClick={() => openFormModal('add', 'income')}
                            className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out text-sm">
                            Añadir Ingreso
                        </button>
                        <button 
                            onClick={() => openFormModal('add', 'expense')}
                            className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out text-sm">
                            Añadir Gasto
                        </button>
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h4 className="text-md font-semibold text-gray-500 mb-1">Ingresos Totales</h4>
                        <p className="text-2xl font-bold text-green-500">${summary.totalIncome?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h4 className="text-md font-semibold text-gray-500 mb-1">Gastos Totales</h4>
                        <p className="text-2xl font-bold text-red-500">${summary.totalExpense?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h4 className="text-md font-semibold text-gray-500 mb-1">Balance Actual</h4>
                        <p className="text-2xl font-bold text-gray-800">${summary.balance?.toFixed(2) || '0.00'}</p>
                    </div>
                </div>
            
                 <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3 sm:mb-0">Historial de Transacciones</h4>
                    <div className="flex space-x-2">
                        <button onClick={() => setActiveFilter('todos')} className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:z-10 transition-colors duration-150 ${activeFilter === 'todos' ? 'bg-blue-500 text-white ring-blue-500' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100'}`}>Todos</button>
                        <button onClick={() => setActiveFilter('ingresos')} className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:z-10 transition-colors duration-150 ${activeFilter === 'ingresos' ? 'bg-green-500 text-white ring-green-500' : 'text-green-700 bg-green-100 border border-green-300 hover:bg-green-200'}`}>Ingresos</button>
                        <button onClick={() => setActiveFilter('gastos')} className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:z-10 transition-colors duration-150 ${activeFilter === 'gastos' ? 'bg-red-500 text-white ring-red-500' : 'text-red-700 bg-red-100 border border-red-300 hover:bg-red-200'}`}>Gastos</button>
                    </div>
                </div>

                {error && transactions.length === 0 && !isLoading && (
                     <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center">
                        {error} <button onClick={() => fetchData(true)} className="ml-2 underline font-semibold">Reintentar</button>
                    </div>
                )}
                {operationError && (
                     <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center">
                        {operationError}
                    </div>
                )}

                <div className="bg-white shadow-lg rounded-xl overflow-hidden flex-grow">
                    {filteredTransactions.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {filteredTransactions.map((transaction) => (
                                <li key={transaction._id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`p-2 rounded-full mr-3 ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {transaction.type === 'income' ? <PlusIcon /> : <MinusIcon />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{transaction.description || "Sin descripción"}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(transaction.createdAt).toLocaleDateString()} - 
                                                    <span className="capitalize"> {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                            </p>
                                            <div className="text-xs mt-1">
                                                <button onClick={() => openFormModal('edit', transaction)} className="text-gray-400 hover:text-blue-600 mr-2" title="Editar"><EditIconSmall /></button>
                                                <button onClick={() => handleDeleteTransaction(transaction._id)} className="text-gray-400 hover:text-red-600" title="Eliminar"><DeleteIconSmall /></button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                       
                        <div className="text-center text-gray-500 p-10">
                            <p>No hay transacciones que mostrar {activeFilter !== 'todos' ? 'con el filtro actual' : ''}.</p>
                        </div>
                       
                    )}
                </div>
            </div>

            {showFormModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                            {modalMode === 'add' ? `Añadir ${formData.type === 'income' ? 'Ingreso' : 'Gasto'}` : 'Editar Transacción'}
                        </h2>
                        {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Monto <span className="text-red-500">*</span></label>
                                <input 
                                    type="number" 
                                    name="amount" 
                                    id="amount" 
                                    value={formData.amount} 
                                    onChange={handleFormChange} 
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                    placeholder="0.00"
                                    step="0.01"
                                    required 
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea 
                                    name="description" 
                                    id="description" 
                                    value={formData.description} 
                                    onChange={handleFormChange} 
                                    rows="3" 
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="(Opcional)"
                                ></textarea>
                            </div>
                            {modalMode === 'edit' && (
                                <div className="mb-6">
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                    <select 
                                        name="type" 
                                        id="type" 
                                        value={formData.type} 
                                        onChange={handleFormChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="income">Ingreso</option>
                                        <option value="expense">Gasto</option>
                                    </select>
                                </div>
                            )}
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={closeFormModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300">Cancelar</button>
                                <button type="submit" className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm ${
                                    modalMode === 'add' ? (formData.type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700')
                                                      : 'bg-blue-600 hover:bg-blue-700'
                                }`}>
                                    {modalMode === 'add' ? `Añadir ${formData.type === 'income' ? 'Ingreso' : 'Gasto'}` : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default FinancesPage;