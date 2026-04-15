import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

const ProtectedRoute: React.FC = () => {
    const { token, isInitialized } = useSelector((state: RootState) => state.auth);

    if (!isInitialized) {
        return null; // Or a smaller spinner if needed
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
