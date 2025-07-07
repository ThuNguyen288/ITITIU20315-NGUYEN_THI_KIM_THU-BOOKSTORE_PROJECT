'use client';
import { useEffect, useState } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch('/api/admin/notification');
        const data = await response.json();
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error('Lỗi khi lấy thông báo:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();

    const handleMarkAllRead = () => {
    const url = '/api/admin/notification/mark-all-read';
    const blob = new Blob([JSON.stringify({})], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
  };

    window.addEventListener('beforeunload', handleMarkAllRead);

    return () => {
      handleMarkAllRead(); // Gọi luôn khi component unmount
      window.removeEventListener('beforeunload', handleMarkAllRead);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Notification</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-center">Nothing new.</p>
      ) : (
        <div>
          {notifications.map((notification) => (
            <div 
              key={notification.NotificationID} 
              className={`border-b border-gray-300 p-4 ${notification.Status === 'Read' ? 'opacity-50' : ''}`}
            >
              <h3 className="font-semibold text-lg flex items-center">
                {notification.Message}
                {notification.Status === 'Unread' && (
                  <span className="ml-2 inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </h3>
              <p className="text-sm text-gray-600">Date: {new Date(notification.CreatedAt).toLocaleString()}</p>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${notification.Status === 'Unread' ? 'text-red-600' : 'text-green-600'}`}>
                  {notification.Status === 'Unread' ? 'Unread' : 'Read'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
