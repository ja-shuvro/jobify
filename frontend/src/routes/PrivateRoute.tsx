import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';

import LoginPage from '../pages/login';
import DashboardPage from '../pages/dashboard';
import ErrorPage from '../pages/error';

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    // Check if a token exists in Redux state, meaning the user is authenticated
    const token = useSelector((state: RootState) => state.auth.token);
    return token ? children : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardPage />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<ErrorPage statusCode={404} />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
