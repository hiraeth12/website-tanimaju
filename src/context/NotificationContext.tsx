import React, { createContext, useContext } from 'react';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { Notifications } from '@/components/Notifications';

interface NotificationContextType {
  addNotification: (notification: Omit<Notification, 'id'> & { id?: string | number }) => string | number;
  removeNotification: (id: string | number) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { notifications, addNotification, removeNotification, clearAllNotifications } = useNotifications();

  const value: NotificationContextType = {
    addNotification,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Notifications notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};
