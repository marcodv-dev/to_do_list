
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../Contexts/UserContext';

const ProtectedRoute = ({ children }) => {
    const { email, loading } = useContext(UserContext);

    if(loading){
        return <div>Caricamento...</div>;
    }
    const isLogged = email || localStorage.getItem('user');

    return isLogged ? children : <Navigate to="/" />;
};

export default ProtectedRoute;