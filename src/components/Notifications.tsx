import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Notification } from '@/hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string | number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300); // Match animation duration
  };

  const getVariantStyles = () => {
    if (notification.variant === 'success') {
      return {
        containerClass: 'from-emerald-500 to-cyan-600',
        iconClass: 'text-white',
        Icon: CheckCircle,
      };
    } else {
      return {
        containerClass: 'from-red-500 to-rose-600',
        iconClass: 'text-white',
        Icon: AlertTriangle,
      };
    }
  };

  const { containerClass, iconClass, Icon } = getVariantStyles();

  return (
    <div
      className={`
        relative bg-gradient-to-r ${containerClass} text-white p-4 rounded-lg shadow-lg mb-3 
        transition-all duration-300 ease-in-out transform
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isLeaving ? 'translate-x-full opacity-0' : ''}
        min-w-[320px] max-w-[400px]
      `}
    >
      <div className="flex items-start gap-3">
        <Icon className={`${iconClass} h-5 w-5 mt-0.5 flex-shrink-0`} />
        
        <div className="flex-1 min-w-0">
          {notification.title && (
            <h4 className="font-semibold text-sm mb-1 text-white">
              {notification.title}
            </h4>
          )}
          <p className="text-sm text-white/90 leading-relaxed">
            {notification.message}
          </p>
        </div>

        <button
          onClick={handleRemove}
          className="text-white/80 hover:text-white transition-colors p-1 rounded flex-shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

interface NotificationsProps {
  notifications: Notification[];
  onRemove: (id: string | number) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};
