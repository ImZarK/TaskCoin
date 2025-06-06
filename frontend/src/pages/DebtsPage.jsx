import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../axiosConfig';
import { Link } from 'react-router-dom';

const AddDebtIcon = () => <svg className="w-4 h-4 inline-block mr-2 -mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>;
const EditIconSmall = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>;
const DeleteIconSmall = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>;

const DebtsPage = () => {
    const [summary, setSummary] = useState({ totalPending: 0, totalPaid: 0 });
    const [debts, setDebts] = useState([]);
    const [financialBalance, setFinancialBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [operationError, setOperationError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentDebt, setCurrentDebt] = useState(null); 
    const [formData, setFormData] = useState({ amount: '', description: '', creditorName: '' });
    const [formError, setFormError] = useState('');

    const fetchData = useCallback(async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        setError(null);
        setOperationError(null);
        try {
            const debtSummaryPromise = apiClient.get('/debt/summary');
            const debtsPromise = apiClient.get('/debt');
            const financeSummaryPromise = apiClient.get('/finance/balance-summary');
            
            const results = await Promise.allSettled([debtSummaryPromise, debtsPromise, financeSummaryPromise]);

            const debtSummaryResult = results[0];
            if (debtSummaryResult.status === 'fulfilled' && debtSummaryResult.value.data) {
                setSummary(debtSummaryResult.value.data);
            } else {
                console.error("Error fetching debt summary:", debtSummaryResult.reason);
                setSummary({ totalPending: 0, totalPaid: 0 });
            }

            const debtsResult = results[1];
            if (debtsResult.status === 'fulfilled' && debtsResult.value.data.debts) {
                setDebts(debtsResult.value.data.debts);
            } else {
                 console.error("Error fetching debts list:", debtsResult.reason);
                 setDebts([]);
            }

            const financeSummaryResult = results[2];
            if (financeSummaryResult.status === 'fulfilled' && financeSummaryResult.value.data) {
                setFinancialBalance(financeSummaryResult.value.data.balance);
            } else {
                console.error("Error fetching financial balance:", financeSummaryResult.reason);
                setFinancialBalance(0);
            }

        } catch (err) {
            console.error("Failed to fetch debts page data:", err);
            setError("No se pudieron cargar los datos.");
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const openModal = (mode, debt = null) => {
        setModalMode(mode);
        setCurrentDebt(debt);
        setFormError('');
        setOperationError(null);
        if (mode === 'edit' && debt) {
            setFormData({
                amount: debt.amount.toString(),
                description: debt.description || '',
                creditorName: debt.creditor?.name || ''
            });
        } else {
            setFormData({ amount: '', description: '', creditorName: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentDebt(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setFormError('El monto debe ser un número positivo.');
            return;
        }
        if (!formData.creditorName.trim()) {
            setFormError('El nombre del acreedor es requerido.');
            return;
        }
        const payload = {
            amount: parseFloat(formData.amount),
            description: formData.description || '',
            creditor: { name: formData.creditorName.trim() }
        };
        try {
            if (modalMode === 'add') {
                await apiClient.post('/debt/add', payload);
            } else if (modalMode === 'edit' && currentDebt) {
                await apiClient.put(`/debt/${currentDebt._id}`, payload);
            }
            closeModal();
            await fetchData(false);
        } catch (err) {
            const errorMsg = err.response?.data?.errors ? err.response.data.errors.map(item => item.msg).join(', ') : (err.response?.data?.message || `Error al ${modalMode === 'add' ? 'añadir' : 'actualizar'} la deuda.`);
            setFormError(errorMsg);
        }
    };
    
    const handleDeleteDebt = async (debtId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta deuda?')) return;
        setOperationError(null);
        try {
            await apiClient.delete(`/debt/${debtId}`);
            await fetchData(false);
        } catch (err) {
            setOperationError(err.response?.data?.message || "No se pudo eliminar la deuda.");
        }
    };
    
    const handleMarkAsPaid = async (debtId) => {
        setOperationError(null);
        try {
            await apiClient.put(`/debt/pay/${debtId}`);
            await fetchData(false);
        } catch (err) {
            setOperationError(err.response?.data?.message || "No se pudo marcar la deuda como pagada.");
        }
    };

    const getStatusStyles = (status) => {
        if (status === 'pagado') {
            return { borderColor: 'border-green-500', textColor: 'text-green-700', bgColor: 'bg-green-100', lineThrough: 'line-through', opacity: 'opacity-75' };
        }
        return { borderColor: 'border-red-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-100', lineThrough: '', opacity: '' };
    };

    if (isLoading) return <div className="flex justify-center items-center flex-grow p-8">Cargando deudas...</div>;
    if (error) return <div className="flex flex-col justify-center items-center flex-grow p-8 text-red-500"><p>{error}</p><button onClick={() => fetchData(true)} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm">Reintentar</button></div>;

    return (
        <>
            <div className="container mx-auto p-4 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">Resumen de Deudas</h3>
                    <button onClick={() => openModal('add')} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-150 ease-in-out text-sm sm:text-base w-full sm:w-auto">
                        <AddDebtIcon />
                        Añadir Nueva Deuda
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Total Pendiente</h4>
                        <p className="text-3xl font-bold text-red-500">${summary.totalPending?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Total Pagado</h4>
                        <p className="text-3xl font-bold text-green-500">${summary.totalPaid?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-blue-500">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Balance Financiero</h4>
                        <p className={`text-3xl font-bold ${financialBalance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
                            ${financialBalance?.toFixed(2) || '0.00'}
                        </p>
                    </div>
                </div>
            
                {operationError && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center">{operationError}</div>}
                
                <div className="space-y-4">
                    {debts.length > 0 ? (
                        debts.map(debt => {
                            const styles = getStatusStyles(debt.status);
                            const creditorDisplay = debt.creditor?.name || 'Desconocido';
                            return (
                                <div key={debt._id} className={`bg-white shadow-lg rounded-xl p-5 border-l-4 ${styles.borderColor} ${styles.opacity}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className={`text-lg font-semibold ${styles.lineThrough} ${debt.status === 'pagado' ? 'text-gray-700' : 'text-gray-900'}`}>{debt.description || 'Deuda sin descripción'}</h3>
                                            <p className="text-xs text-gray-500">Acreedor: {creditorDisplay}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            {debt.status !== 'pagado' && <button onClick={() => openModal('edit', debt)} className="text-gray-400 hover:text-blue-600 p-1" title="Editar Deuda"><EditIconSmall /></button>}
                                            <button onClick={() => handleDeleteDebt(debt._id)} className="text-gray-400 hover:text-red-600 p-1" title="Eliminar Deuda"><DeleteIconSmall /></button>
                                        </div>
                                    </div>
                                    <p className={`text-2xl font-bold my-2 ${styles.lineThrough} ${debt.status === 'pagado' ? 'text-gray-500' : 'text-red-600'}`}>${debt.amount.toFixed(2)}</p>
                                    <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs items-center">
                                        <span className={`px-3 py-1 font-bold leading-tight rounded-full ${styles.textColor} ${styles.bgColor}`}>{debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}</span>
                                        <span className="text-gray-500">Registrada: {new Date(debt.createdAt).toLocaleDateString()}</span>
                                        {debt.status === 'pagado' && debt.paidAt && <span className="text-gray-500">Pagada el: {new Date(debt.paidAt).toLocaleDateString()}</span>}
                                    </div>
                                    {debt.status !== 'pagado' && (
                                        <div className="mt-4 pt-3 border-t border-gray-200">
                                            <button onClick={() => handleMarkAsPaid(debt._id)} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out">Marcar como Pagada</button>
                                        </div>
                                    )}
                                     {debt.status === 'pagado' && (
                                        <div className="mt-4 pt-3 border-t border-gray-200">
                                            <button disabled className="w-full bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-md text-sm cursor-not-allowed">Pagada</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                         <div className="text-center text-gray-500 py-10 bg-white shadow-lg rounded-xl">
                            <p>No tienes deudas registradas.</p>
                            {!isLoading && <p className="mt-2">¡Puedes añadir una nueva deuda usando el botón de arriba!</p>}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-40 flex justify-center items-center p-4">
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">{modalMode === 'add' ? 'Añadir Nueva Deuda' : 'Editar Deuda'}</h2>
                        {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Monto <span className="text-red-500">*</span></label>
                                <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="0.00" step="0.01" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="creditorName" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Acreedor <span className="text-red-500">*</span></label>
                                <input type="text" name="creditorName" id="creditorName" value={formData.creditorName} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ej: Juan Pérez, Tienda XYZ" required />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea name="description" id="description" value={formData.description} onChange={handleFormChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="(Opcional)"></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300">Cancelar</button>
                                <button type="submit" className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm ${modalMode === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {modalMode === 'add' ? 'Añadir Deuda' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default DebtsPage;