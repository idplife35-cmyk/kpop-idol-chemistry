/**
 * Notification Component
 * Shows animated notifications for badges, level ups, etc.
 */
import { useState, useEffect, useCallback } from 'react';
import styles from './Notification.module.css';

export interface NotificationData {
  id: string;
  type: 'success' | 'badge' | 'levelup' | 'info';
  message: string;
  icon?: string;
  duration?: number;
}

interface NotificationItemProps {
  notification: NotificationData;
  onRemove: (id: string) => void;
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = notification.duration || 3000;
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(notification.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [notification, onRemove]);

  const iconMap = {
    success: '✅',
    badge: '🏆',
    levelup: '🎉',
    info: 'ℹ️'
  };

  return (
    <div 
      className={`${styles.notification} ${styles[notification.type]} ${isExiting ? styles.exit : ''}`}
    >
      <span className={styles.icon}>
        {notification.icon || iconMap[notification.type]}
      </span>
      <span className={styles.message}>{notification.message}</span>
    </div>
  );
}

// Global notification state management
let addNotificationCallback: ((data: Omit<NotificationData, 'id'>) => void) | null = null;

export function showNotification(
  message: string, 
  type: NotificationData['type'] = 'info',
  icon?: string,
  duration?: number
) {
  if (addNotificationCallback) {
    addNotificationCallback({ message, type, icon, duration });
  }
}

// Expose to window for legacy support
if (typeof window !== 'undefined') {
  (window as any).showNotification = showNotification;
}

export default function NotificationContainer() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = useCallback((data: Omit<NotificationData, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setNotifications(prev => [...prev, { ...data, id }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    addNotificationCallback = addNotification;
    return () => {
      addNotificationCallback = null;
    };
  }, [addNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className={styles.container}>
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
}


