import * as React from 'react';

export interface Notification {
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
}

export interface NotificationContextType {
    showNotification: (message: string, severity: Notification['severity']) => void;
}

export const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);