import React, { useState, useEffect } from 'react';
import apiClient from '../axiosConfig'; 
import { useNavigate } from 'react-router-dom'; 

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    const navigate = useNavigate(); 

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const payload = {
                username: username,
                email: email,
                password: password,
            };

            const response = await apiClient.post('/auth/register', payload);
            
            console.log('Registro Exitoso:', response.data);
            
            setSuccessMessage(`¡Registro exitoso para ${response.data.user.username}! Redirigiendo al login...`);
            setUsername('');
            setEmail('');
            setPassword('');
            setIsLoading(false);

           
            setTimeout(() => {
                navigate('/login');
            }, 4000);

        } catch (err) {
            setIsLoading(false);
            console.error('Error en el registro:', err.response ? err.response.data : err.message);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.response && err.response.data && err.response.data.errors) {
                const combinedMessages = err.response.data.errors.map(e => e.msg).join('. ');
                setError(combinedMessages);
            }
            else {
                setError('Error de conexión o el servidor no respondió. Inténtalo de nuevo.');
            }
        }
    };

 
    useEffect(() => {
        let timer;
        if (successMessage.includes('Redirigiendo')) { 
            timer = setTimeout(() => {
          
            }, 4000);
        }
        return () => clearTimeout(timer); 
    }, [successMessage, navigate]);


    return (
        <div>
            <div className="font-medium">
                <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-100 ">
                    <div className="relative sm:max-w-sm w-full">
                        <div className="card bg-gradient-to-b from-yellow-400 to-blue-500 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>
                        <div className="relative size rounded-3xl px-6 py-4 bg-gray-100 shadow-md border-4 border-gradient-to-tb">
                            <label className="block mt-3 text-sm text-gray-700 text-center font-extrabold">
                                Registro de Usuario
                            </label>
                            <form onSubmit={handleRegisterSubmit} className="mt-10">
                                {error && (
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
                                        type="text" 
                                        placeholder="Nombre de usuario" 
                                        className="mt-1 block w-full border bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={isLoading}
                                        required 
                                    />
                                </div>
                                <div className="mt-7">
                                    <input 
                                        type="email" 
                                        placeholder="Correo electrónico" 
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
                                     <p className="text-xs text-gray-500 mt-1 ml-1">La contraseña debe tener al menos 6 caracteres.</p>
                                </div>
                                <div className="mt-7">
                                    <button 
                                        type="submit" 
                                        className={`bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                                        disabled={isLoading || successMessage.includes('Redirigiendo')}
                                    >
                                        {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                                    </button>
                                </div>
                                <div className="mt-7">
                                    <div className="flex justify-center items-center">
                                        <label className="mr-2" >¿Ya tienes una cuenta?</label>
                                        <a href="/login" className=" text-blue-500 transition duration-500 ease-in-out transform hover:scale-105">
                                            Iniciar Sesión
                                        </a>
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

export default Register;