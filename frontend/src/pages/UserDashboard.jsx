import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import apiClient from '../axiosConfig';

const HomeIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const TasksIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
const FinancesIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const DebtsIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const ProfileIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
const LogoutIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;
const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>;
const NotificationIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;

const DashboardHomePage = () => {
    const { user } = useOutletContext();
    const userName = user?.username || 'Usuario';

    const [financialSummary, setFinancialSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [pendingTasks, setPendingTasks] = useState({ count: 0, highPriority: 0, nextDue: "N/A" });
    const [debtSummary, setDebtSummary] = useState({ totalPending: 0, totalPaid: 0 });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogoutFromHome = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }, [navigate]);

    const fetchHomeData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        const promises = [
            apiClient.get('/finance/balance-summary'),
            apiClient.get('/tasks'),
            apiClient.get('/debt/summary'),
            apiClient.get('/finance/all-transactions')
        ];

        const results = await Promise.allSettled(promises);
        let minorErrorMessages = [];
        
        
        if (results[0].status === 'fulfilled') {
            setFinancialSummary(results[0].value.data);
        } else {
            minorErrorMessages.push("resumen financiero");
        }

        
        if (results[1].status === 'fulfilled') {
            const allTasks = results[1].value.data.tasks || [];
            const pending = allTasks.filter(task => task.status !== 'completada');
            const highPriorityCount = pending.filter(task => task.priority === 'alta').length;
            let nextDueTask = "Ninguna próxima";
            if (pending.length > 0) {
                const sortedPendingTasks = pending.filter(task => task.dueDate).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                if (sortedPendingTasks.length > 0) nextDueTask = sortedPendingTasks[0].title;
            }
            setPendingTasks({ count: pending.length, highPriority: highPriorityCount, nextDue: nextDueTask });
        } else {
             minorErrorMessages.push("tareas");
        }

        
        if (results[2].status === 'fulfilled') {
            setDebtSummary(results[2].value.data);
        } else {
            const error = results[2].reason;
            if (error.response?.status === 404 && error.response?.data?.message === 'No tienes ninguna deuda registrada') {
                setDebtSummary({ totalPending: 0, totalPaid: 0 });
            } else {
                minorErrorMessages.push("resumen de deudas");
            }
        }
        
        
        if (results[3].status === 'fulfilled') {
            setRecentTransactions((results[3].value.data.transactions || []).slice(0, 3));
        } else {
            const error = results[3].reason;
            if (error.response?.status === 404 && error.response?.data?.message === 'No se encontro ninguna transaccion') {
                setRecentTransactions([]);
            } else {
                minorErrorMessages.push("transacciones recientes");
            }
        }
        
        if (minorErrorMessages.length > 0) {
             setError(`No se pudieron cargar: ${minorErrorMessages.join(', ')}.`);
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchHomeData();
    }, [fetchHomeData]);
    
    if (isLoading) return <div className="container mx-auto p-8 text-center">Cargando datos del dashboard...</div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center">
                    {error} 
                    <button onClick={() => fetchHomeData(false)} className="ml-4 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">Reintentar</button>
                </div>
            )}
            <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800">¡Bienvenido de nuevo, {userName}!</h3>
                <p className="text-gray-500">Aquí tienes un resumen de tu actividad en TaskCoin.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
                    <div className="flex-grow">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4"><FinancesIcon /></div>
                            <h4 className="text-lg font-semibold text-gray-700">Resumen Financiero</h4>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600"><span>Ingresos Totales:</span><span className="font-semibold text-green-500">${financialSummary.totalIncome?.toFixed(2) || '0.00'}</span></div>
                            <div className="flex justify-between text-gray-600"><span>Gastos Totales:</span><span className="font-semibold text-red-500">${financialSummary.totalExpense?.toFixed(2) || '0.00'}</span></div>
                            <hr className="my-2"/><div className="flex justify-between text-gray-800"><span className="font-bold">Balance Actual:</span><span className="font-bold text-xl">${financialSummary.balance?.toFixed(2) || '0.00'}</span></div>
                        </div>
                    </div>
                    <div className="mt-auto pt-4"><Link to="/dashboard/finances" className="block w-full text-center bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out">Ver Detalles Financieros</Link></div>
                </div>
                 <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
                    <div className="flex-grow">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4"><TasksIcon /></div>
                            <h4 className="text-lg font-semibold text-gray-700">Tareas Pendientes</h4>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mb-1">{pendingTasks.count} <span className="text-sm font-normal text-gray-500">tareas</span></p>
                        <p className="text-xs text-gray-500 mb-3">{pendingTasks.highPriority} de ellas son de alta prioridad.</p>
                        <div className="space-y-1 text-sm"><p className="text-gray-600">Próxima a vencer: <span className="font-semibold">"{pendingTasks.nextDue}"</span></p></div>
                    </div>
                    <div className="mt-auto pt-4"><Link to="/dashboard/tasks" className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out">Ir a Mis Tareas</Link></div>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
                    <div className="flex-grow">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-full bg-red-100 text-red-500 mr-4"><DebtsIcon /></div>
                            <h4 className="text-lg font-semibold text-gray-700">Resumen de Deudas</h4>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600"><span>Total Pendiente:</span><span className="font-semibold text-red-500">${debtSummary.totalPending?.toFixed(2) || '0.00'}</span></div>
                            <div className="flex justify-between text-gray-600"><span>Total Pagado:</span><span className="font-semibold text-green-500">${debtSummary.totalPaid?.toFixed(2) || '0.00'}</span></div>
                        </div>
                    </div>
                    <div className="mt-auto pt-4"><Link to="/dashboard/debts" className="block w-full text-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out">Gestionar Deudas</Link></div>
                </div>
                <div className="md:col-span-2 lg:col-span-3 bg-white shadow-lg rounded-xl p-6">
                     <h4 className="text-lg font-semibold text-gray-700 mb-4">Movimientos Financieros Recientes</h4>
                    {recentTransactions.length > 0 ? (
                        <ul className="space-y-3">
                            {recentTransactions.map((transaction) => (
                                <li key={transaction._id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{transaction.description || "Sin descripción"}</p>
                                        <p className="text-xs text-gray-500">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount?.toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No hay transacciones recientes.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const UserDashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user from localStorage in layout:", error);
            }
        }
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        navigate('/login');
    }, [navigate]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.endsWith('/tasks')) return 'Mis Tareas';
        if (path.endsWith('/finances')) return 'Mis Finanzas';
        if (path.endsWith('/debts')) return 'Mis Deudas';
        if (path.endsWith('/profile')) return 'Mi Perfil';
        return 'Dashboard';
    };

    return (
        <div className="relative min-h-screen md:flex">
            <aside 
                className={`bg-gray-800 text-gray-300 w-64 space-y-6 p-4 
                            fixed inset-y-0 left-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                            md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
            >
                <div className="flex justify-between items-center pt-4 pb-2">
                    <Link to="/dashboard" className="text-white text-2xl font-bold">TaskCoin</Link>
                    <button onClick={closeSidebar} className="md:hidden p-1 rounded-md hover:bg-gray-700" title="Cerrar menú">
                        <CloseIcon />
                    </button>
                </div>
                <nav className="flex-1">
                    <ul className="space-y-2">
                        <li><Link to="/dashboard" className={`flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-gray-700 transition duration-150 ease-in-out ${location.pathname === '/dashboard' ? 'bg-gray-600 text-white' : ''}`}><HomeIcon /><span>Dashboard</span></Link></li>
                        <li><Link to="/dashboard/tasks" className={`flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-gray-700 transition duration-150 ease-in-out ${location.pathname.startsWith('/dashboard/tasks') ? 'bg-gray-600 text-white' : ''}`}><TasksIcon /><span>Tareas</span></Link></li>
                        <li><Link to="/dashboard/finances" className={`flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-gray-700 transition duration-150 ease-in-out ${location.pathname.startsWith('/dashboard/finances') ? 'bg-gray-600 text-white' : ''}`}><FinancesIcon /><span>Finanzas</span></Link></li>
                        <li><Link to="/dashboard/debts" className={`flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-gray-700 transition duration-150 ease-in-out ${location.pathname.startsWith('/dashboard/debts') ? 'bg-gray-600 text-white' : ''}`}><DebtsIcon /><span>Deudas</span></Link></li>
                        <li><Link to="/dashboard/profile" className={`flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-gray-700 transition duration-150 ease-in-out ${location.pathname.startsWith('/dashboard/profile') ? 'bg-gray-600 text-white' : ''}`}><ProfileIcon /><span>Perfil</span></Link></li>
                    </ul>
                </nav>
                <div className="mt-auto">
                    <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-gray-700 transition duration-150 ease-in-out">
                        <LogoutIcon />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            <main className={`flex-1 transition-all duration-300 ease-in-out flex flex-col md:ml-0`}>
                 <div className={`flex-1 transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen && 'md:ml-64'}`}>
                    <header className="bg-white shadow-sm sticky top-0 z-20">
                        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                            <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800">
                                <MenuIcon />
                            </button>
                            <h2 className="text-2xl font-semibold text-gray-700 ml-2 md:ml-0">{getPageTitle()}</h2>
                            <div className="flex items-center space-x-3">
                              
                                <Link to="/dashboard/profile" className="p-1 rounded-full hover:bg-gray-200" title="Mi Perfil">
                                    <img 
                                        className="w-8 h-8 rounded-full object-cover" 
                                        src={currentUser ? `https://api.dicebear.com/8.x/adventurer/svg?seed=${currentUser.username}` : ''}
                                        alt="Avatar de Usuario" 
                                    />
                                </Link>
                            </div>
                        </div>
                    </header>
                    <Outlet context={{ user: currentUser }} /> 
                 </div>
            </main>
        </div>
    );
};

export { UserDashboardLayout, DashboardHomePage };