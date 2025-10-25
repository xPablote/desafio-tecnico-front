import { useContext } from 'react';
import { NotificationContext, NotificationContextType } from './NotificationContext';

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification debe usarse dentro de NotificationProvider');
    }
    return context;
};