
import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../axiosConfig';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [infoData, setInfoData] = useState({ username: '', email: '' });
    const [infoMessage, setInfoMessage] = useState({ type: '', text: '' });

   
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/users/me');
            if (response.data && response.data.user) {
                setUser(response.data.user);
                setInfoData({
                    username: response.data.user.username,
                    email: response.data.user.email
                });
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("No se pudo cargar la información del perfil.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setInfoData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateInfoSubmit = async (e) => {
        e.preventDefault();
        setInfoMessage({ type: '', text: '' });

        
        const payload = {};
        if (infoData.username !== user.username) {
            payload.username = infoData.username;
        }
        if (infoData.email !== user.email) {
            payload.email = infoData.email;
        }

        if (Object.keys(payload).length === 0) {
            setInfoMessage({ type: 'success', text: 'No hay cambios para guardar.' });
            return;
        }

        try {
            const response = await apiClient.put('/auth/update-profile', payload);
            setInfoMessage({ type: 'success', text: response.data.message || 'Información actualizada con éxito.' });
            

            fetchUserData(); 
        } catch (err) {
            console.error("Error updating profile info:", err.response?.data || err);
            const errorMsg = err.response?.data?.errors ? err.response.data.errors.map(e => e.msg).join(', ') : (err.response?.data?.message || 'Error al actualizar la información.');
            setInfoMessage({ type: 'error', text: errorMsg });
        }
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });
        
        if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
            return;
        }
        
        const payload = { password: passwordData.newPassword };

        try {
            const response = await apiClient.put('/auth/update-profile', payload);
            setPasswordMessage({ type: 'success', text: response.data.message || 'Contraseña actualizada con éxito.' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
             console.error("Error changing password:", err.response?.data || err);
            const errorMsg = err.response?.data?.errors ? err.response.data.errors.map(e => e.msg).join(', ') : (err.response?.data?.message || 'Error al cambiar la contraseña.');
            setPasswordMessage({ type: 'error', text: errorMsg });
        }
    };


    if (isLoading) {
        return <div className="p-8 text-center">Cargando perfil...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8 flex flex-col flex-grow min-h-0">
            
            <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 mb-8">
                <div className="flex flex-col sm:flex-row items-center">
                    <img className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-4 sm:mb-0 sm:mr-6 border-4 border-gray-200" src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${user?.username}`} alt="Foto de Perfil" />
                    <div className="text-center sm:text-left">
                        <h3 className="text-2xl font-bold text-gray-800">{user?.username}</h3>
                        <p className="text-md text-gray-600">{user?.email}</p>
                        <p className="text-sm text-gray-500 mt-1">Miembro desde: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
                <div className="bg-white shadow-lg rounded-xl p-6 md:p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">Editar Información de Cuenta</h3>
                    <form className="space-y-6" onSubmit={handleUpdateInfoSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                            <input type="text" name="username" id="username" value={infoData.username} onChange={handleInfoChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <input type="email" name="email" id="email" value={infoData.email} onChange={handleInfoChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        {infoMessage.text && (
                            <div className={`p-3 rounded-md text-sm ${infoMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {infoMessage.text}
                            </div>
                        )}
                        <div>
                            <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Actualizar Información
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white shadow-lg rounded-xl p-6 md:p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">Seguridad y Contraseña</h3>
                    <form className="space-y-6" onSubmit={handleChangePasswordSubmit}>
                        <div>
                            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">Contraseña Actual</label>
                            <input type="password" name="currentPassword" id="current_password" value={passwordData.currentPassword} onChange={handlePasswordChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" />
                        </div>
                        <div>
                            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                            <input type="password" name="newPassword" id="new_password" value={passwordData.newPassword} onChange={handlePasswordChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" />
                            <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres.</p>
                        </div>
                         <div>
                            <label htmlFor="confirm_new_password" className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                            <input type="password" name="confirmPassword" id="confirm_new_password" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" />
                        </div>
                        {passwordMessage.text && (
                            <div className={`p-3 rounded-md text-sm ${passwordMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {passwordMessage.text}
                            </div>
                        )}
                        <div>
                            <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                Cambiar Contraseña
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;