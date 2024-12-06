import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC<{ statusCode?: number }> = ({ statusCode = 404 }) => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 text-center">
            <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">
                    {statusCode === 404 ? '404' : 'Oops!'}
                </h1>
                <h2 className="text-2xl text-gray-600 mb-6">
                    {statusCode === 404
                        ? 'Page Not Found'
                        : 'Something went wrong, but we are working on it!'}
                </h2>
                <p className="text-lg text-gray-500 mb-8">
                    {statusCode === 404
                        ? 'The page you are looking for might have been moved or deleted.'
                        : 'Please try again later or contact support if the issue persists.'}
                </p>
                <Button
                    type="primary"
                    onClick={goHome}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-3"
                >
                    Go to Home
                </Button>
            </div>
        </div>
    );
};

export default ErrorPage;
