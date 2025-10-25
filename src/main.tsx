import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { PersonProvider } from './contexts/PersonProvider';
import { NotificationProvider } from './contexts/NotificationProvider';
import { theme } from './theme';
import App from './App';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <NotificationProvider>
                <PersonProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </PersonProvider>
            </NotificationProvider>
        </ThemeProvider>
    </React.StrictMode>
);