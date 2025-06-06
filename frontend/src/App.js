
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import { UserDashboardLayout, DashboardHomePage } from './pages/UserDashboard'; 
import TasksPage from './pages/TasksPage';
import FinancesPage from './pages/Finances'; 
import DebtsPage from './pages/DebtsPage';      
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

function App() {
  return (
    <Router> 
      <div>
        <Routes> 
          
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
         
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHomePage />} /> 
            <Route path="tasks" element={<TasksPage />} />
            <Route path="finances" element={<FinancesPage />} />
            <Route path="debts" element={<DebtsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<div className="flex flex-col items-center justify-center min-h-screen"><h2>404 - Página No Encontrada</h2><Link to="/" className="text-blue-500 hover:underline mt-4">Ir a la página de inicio</Link></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;