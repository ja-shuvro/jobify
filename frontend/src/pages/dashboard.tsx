import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Typography } from 'antd';
import { clearToken } from '../store/slices/authSlice';

const DashboardPage: React.FC = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearToken());
        localStorage.removeItem('authToken');
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography.Title level={3}>Dashboard</Typography.Title>
            <Button type="primary" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
};

export default DashboardPage;
