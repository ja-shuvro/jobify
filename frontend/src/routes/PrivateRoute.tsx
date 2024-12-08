import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';

import {
    CategoriesPage,
    CompaniesPage,
    DashboardPage,
    ErrorPage,
    LoginPage,
    UsersPage,
    TypePage,
    JobsPage
} from '@/pages';

import AdminLayout from '@/layouts';


const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    // Check if a token exists in Redux state, meaning the user is authenticated
    const token = useSelector((state: RootState) => state.auth.token);

    return token ? children : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <LoginPage />
                    } />
                <Route
                    path="/"
                    element={
                        <AdminLayout>
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        </AdminLayout>
                    }
                />
                <Route
                    path="/categories"
                    element={
                        <AdminLayout>
                            <PrivateRoute>
                                <CategoriesPage />
                            </PrivateRoute>
                        </AdminLayout>
                    }
                />
                <Route
                    path="/companies"
                    element={
                        <AdminLayout>
                            <PrivateRoute>
                                <CompaniesPage />
                            </PrivateRoute>
                        </AdminLayout>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <AdminLayout>
                            <PrivateRoute>
                                <UsersPage />
                            </PrivateRoute>
                        </AdminLayout>
                    }
                />
                <Route
                    path="/type"
                    element={
                        <AdminLayout>
                            <PrivateRoute>
                                <TypePage />
                            </PrivateRoute>
                        </AdminLayout>
                    }
                />
                <Route
                    path="/jobs"
                    element={
                        <AdminLayout>
                            <PrivateRoute>
                                <JobsPage />
                            </PrivateRoute>
                        </AdminLayout>
                    }
                />
                <Route path="*"
                    element={
                        <ErrorPage statusCode={404} />
                    } />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
