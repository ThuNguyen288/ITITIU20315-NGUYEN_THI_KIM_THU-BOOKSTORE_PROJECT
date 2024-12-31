'use client'
import { useEffect, useState } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy thông báo từ API
    async function fetchNotifications() {
      try {
        const response = await fetch('/api/admin/notification'); // Ensure this matches the correct API route
        const data = await response.json();
        
        // Update notifications state, assuming the API returns { notifications: [...] }
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error('Lỗi khi lấy thông báo:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  // Xử lý khi admin đánh dấu thông báo là đã đọc
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/admin/notification?notificationId=${notificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        setNotifications(notifications.map(notification =>
          notification.NotificationID === notificationId
            ? { ...notification, Status: 'Read' }
            : notification
        ));
      } else {
        throw new Error('Error marking notification as read');
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Thông Báo</h1>
      {loading ? (
        <p className="text-center">Đang tải thông báo...</p>
      ) : notifications.length === 0 ? (
        <p className="text-center">Không có thông báo mới.</p>
      ) : (
        <div>
          {notifications.map((notification) => (
            <div 
              key={notification.NotificationID} 
              className={`border-b border-gray-300 p-4 ${notification.Status === 'Read' ? 'opacity-50' : ''}`}
            >
              <h3 className="font-semibold text-lg">{notification.Message}</h3>
              <p className="text-sm text-gray-600">Ngày tạo: {new Date(notification.CreatedAt).toLocaleString()}</p>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${notification.Status === 'Unread' ? 'text-red-600' : 'text-green-600'}`}>
                  {notification.Status === 'Unread' ? 'Chưa đọc' : 'Đã đọc'}
                </span>
                {notification.Status === 'Unread' && (
                  <button
                    onClick={() => markAsRead(notification.NotificationID)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Đánh dấu là đã đọc
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
