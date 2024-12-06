import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/store';
import { setToken } from '@/store/slices/authSlice';
import api from '@/services/api';
import Cookies from 'js-cookie';

const { Title } = Typography;

const LoginPage: React.FC = () => {
    const [loading, setLoading] = React.useState(false);
    const dispatch = useAppDispatch();

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', values);
            const { token } = response.data;

            // Save token in Redux state
            dispatch(setToken(token));

            // Set the token in a secure cookie (1 day expiration)
            Cookies.set('authToken', token, { expires: 1, secure: true, sameSite: 'Strict' });

            message.success('Login successful!');

            // Redirect or navigate after successful login
            window.location.href = '/dashboard';
        } catch (error: any) {
            const errorMessage = `${error.response?.data?.error} : ${error.response?.data?.message || error.response?.data?.error === "Forbidden" ? "Sorry! This route are protected for Super Admin and Admin!" : 'Login failed. Please check your credentials and try again.'}`;
            message.error(errorMessage);
            console.log(error);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                minWidth: '100vw',
                backgroundColor: '#f5f5f5',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '20px',
                    background: '#fff',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                }}
            >
                <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
                    Login
                </Title>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
