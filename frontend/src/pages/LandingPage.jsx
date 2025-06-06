
import React from 'react';
import { Link } from 'react-router-dom';


const TaskIcon = () => (
    <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
    </svg>
);
const FinanceIcon = () => (
    <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);
const DebtIcon = () => (
    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
    </svg>
);


const LandingPage = () => {
    return (
        <div className="bg-gray-50 text-gray-800">
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-gray-800">
                        TaskCoin
                    </div>
                    <div className="space-x-4">
                        <Link to="/login" className="text-gray-600 hover:text-blue-500 transition duration-150">
                            Iniciar Sesión
                        </Link>
                        <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150">
                            Regístrate Gratis
                        </Link>
                    </div>
                </nav>
            </header>

           
            <section className="bg-white">
                <div className="container mx-auto px-6 py-20 md:py-32 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                        Organiza tu Vida, Conquista tus Metas.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        TaskCoin es la herramienta todo-en-uno que necesitas para gestionar tus tareas, controlar tus finanzas y mantener tus deudas a raya. Simplifica tu día a día y toma el control.
                    </p>
                    <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-150 transform hover:scale-105">
                        Comienza Gratis Ahora
                    </Link>
                </div>
            </section>

           
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold">Todo lo que necesitas en un solo lugar</h2>
                        <p className="text-gray-600 mt-2">Desde tu lista de pendientes hasta tu balance mensual.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <TaskIcon />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Gestiona tus Tareas</h3>
                            <p className="text-gray-600">
                                Organiza tus quehaceres diarios, establece prioridades y nunca más olvides una fecha de entrega. Aumenta tu productividad de forma sencilla.
                            </p>
                        </div>
                        <div className="text-center">
                             <div className="flex justify-center mb-4">
                                <FinanceIcon />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Controla tus Finanzas</h3>
                            <p className="text-gray-600">
                                Registra tus ingresos y gastos al instante. Obtén resúmenes claros de tu balance y toma decisiones financieras más inteligentes.
                            </p>
                        </div>
                        <div className="text-center">
                             <div className="flex justify-center mb-4">
                                <DebtIcon />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Mantén tus Deudas a Raya</h3>
                            <p className="text-gray-600">
                                Lleva un control claro de tus deudas pendientes y pagadas. Visualiza a quién le debes y planifica tus pagos sin estrés.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

           
            <section className="bg-blue-500 text-white">
                 <div className="container mx-auto px-6 py-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para tomar el control?</h2>
                    <p className="text-lg md:text-xl mb-8">
                        Únete a miles de usuarios que ya están organizando su vida con TaskCoin.
                    </p>
                     <Link to="/register" className="bg-white hover:bg-gray-200 text-blue-500 font-bold py-3 px-8 rounded-full shadow-lg transition duration-150 transform hover:scale-105">
                        Crear Mi Cuenta
                    </Link>
                 </div>
            </section>

           
            <footer className="bg-gray-800 text-gray-400">
                 <div className="container mx-auto px-6 py-4 text-center">
                    <p>&copy; {new Date().getFullYear()} TaskCoin. Todos los derechos reservados.</p>
                    
                 </div>
            </footer>
        </div>
    );
};

export default LandingPage;