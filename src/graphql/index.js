import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import client from './apollo/client';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <BrowserRouter>
                <AuthProvider>
                    <NotificationProvider>
                        <App />
                    </NotificationProvider>
                </AuthProvider>
            </BrowserRouter>
        </ApolloProvider>
    </React.StrictMode>
);