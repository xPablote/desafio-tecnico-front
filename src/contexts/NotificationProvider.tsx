import { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { NotificationContext, Notification } from './NotificationContext';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<Notification | null>(null);

    const showNotification = (message: string, severity: Notification['severity']) => {
        setNotification({ message, severity });
    };

    const handleClose = () => {
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <Snackbar
                    open={!!notification}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
                        {notification.message}
                    </Alert>
                </Snackbar>
            )}
        </NotificationContext.Provider>
    );
};