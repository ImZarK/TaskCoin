import React, { useState } from 'react';
import apiClient from '../axiosConfig';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const payload = {
                email: email, 
                password: password,
            };

            const response = await apiClient.post('/auth/login', payload);
            
            const { token, user } = response.data;

            localStorage.setItem('token', token); 
            localStorage.setItem('user', JSON.stringify(user)); 
            
           
            setSuccessMessage('¡Login exitoso! Redirigiendo a tu dashboard...');

           
            setTimeout(() => {
                navigate('/dashboard'); 
            }, 2000);

        } catch (err) {
           
            setIsLoading(false);
            console.error('Error en el login:', err.response ? err.response.data : err.message);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Error de conexión o el servidor no respondió. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div>
            <div className="font-medium">
                <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-100 ">
                    <div className="relative sm:max-w-sm w-full">
                        <div className="card bg-gradient-to-b from-yellow-400 to-blue-500 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>
                        <div className="relative size rounded-3xl px-6 py-4 bg-gray-100 shadow-md border-4 border-gradient-to-tb">
                            <label className="block mt-3 text-sm text-gray-700 text-center font-extrabold">
                                Login
                            </label>
                            <form onSubmit={handleLoginSubmit} className="mt-10">
                               
                                {error && !successMessage && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center">
                                        {error}
                                    </div>
                                )}
                                {successMessage && (
                                     <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm text-center">
                                        {successMessage}
                                    </div>
                                )}
                                
                                <div>
                                    <input 
                                        type="email" 
                                        placeholder="Correo electronico" 
                                        className="mt-1 block w-full border bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        required 
                                    />
                                </div>
                                <div className="mt-7">
                                    <input 
                                        type="password" 
                                        placeholder="Contraseña" 
                                        className="mt-1 block w-full border bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="mt-7 flex">
                                    <label htmlFor="remember_me" className="inline-flex items-center w-full cursor-pointer">
                                        <input 
                                            id="remember_me" 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                                            name="remember"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            disabled={isLoading}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Recuerdame
                                        </span>
                                    </label>
                                </div>
                                <div className="mt-7">
                                    <button 
                                        type="submit" 
                                        className={`bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (successMessage ? 'Redirigiendo...' : 'Iniciando...') : 'Login'}
                                    </button>
                                </div>
                                <div className="mt-7">
                                    <div className="flex justify-center items-center">
                                        <label className="mr-2" >¿Eres nuevo?</label>
                                        <Link to="/register" className=" text-blue-500 transition duration-500 ease-in-out transform hover:scale-105">
                                            Crea una cuenta
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;