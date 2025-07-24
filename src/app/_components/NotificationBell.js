import React, { useState, useEffect } from 'react';
import { Bell, Clock, Car, LogOut } from 'lucide-react';
import { API_CONFIG } from '../lib/config/apiConfig.js';

const NotificationBell = () => {
  const [activities, setActivities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadTime, setLastReadTime] = useState(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notificationLastReadTime');
      return saved ? new Date(saved) : null;
    }
    return null;
  });

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/public/parking-status`);
      const data = await response.json();
      
      if (data.success) {
        const newActivities = data.data || [];
        setActivities(newActivities);
        
        // Calculate unread count based on lastReadTime
        const currentLastReadTime = localStorage.getItem('notificationLastReadTime');
        if (currentLastReadTime) {
          const lastRead = new Date(currentLastReadTime);
          const unreadActivities = newActivities.filter(activity => {
            const activityTime = new Date(activity.time);
            return activityTime > lastRead;
          });
          setUnreadCount(unreadActivities.length);
        } else {
          // If no lastReadTime, show all as unread but limit to reasonable number
          const unreadCount = Math.min(newActivities.length, 10);
          setUnreadCount(unreadCount);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = () => {
    const now = new Date();
    setLastReadTime(now);
    setUnreadCount(0);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('notificationLastReadTime', now.toISOString());
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Refresh every 10 seconds for better responsiveness
    return () => clearInterval(interval);
  }, []); // Remove lastReadTime dependency to avoid circular updates
  
  // Separate effect to recalculate unread count when lastReadTime changes
  useEffect(() => {
    if (activities.length > 0) {
      const currentLastReadTime = localStorage.getItem('notificationLastReadTime');
      if (currentLastReadTime) {
        const lastRead = new Date(currentLastReadTime);
        const unreadActivities = activities.filter(activity => {
          const activityTime = new Date(activity.time);
          return activityTime > lastRead;
        });
        setUnreadCount(unreadActivities.length);
      } else {
        // If no lastReadTime exists, show all activities as unread (first time user)
        const unreadCount = Math.min(activities.length, 10);
        setUnreadCount(unreadCount);
      }
    } else {
      // No activities, set unread count to 0
      setUnreadCount(0);
    }
  }, [lastReadTime, activities]); // Recalculate when lastReadTime or activities change

  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'entry': return <Car className="w-4 h-4 text-green-500" />;
      case 'exit': return <LogOut className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'booking': return 'border-l-blue-500 bg-blue-50 text-blue-800';
      case 'entry': return 'border-l-green-500 bg-green-50 text-green-800';
      case 'exit': return 'border-l-red-500 bg-red-50 text-red-800';
      default: return 'border-l-gray-500 bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            markAsRead();
          }
        }}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-200"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center animate-pulse font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Aktivitas Terbaru
            </h3>
          </div>
          
          {/* Recent Activities */}
          <div className="max-h-64 overflow-y-auto">
            <div className="p-4">
              {activities?.length > 0 ? (
                <div className="space-y-2">
                  {activities.map((activity, index) => (
                     <div
                       key={index}
                       className={`p-3 rounded-lg border-l-4 ${getActivityColor(activity.type)}`}
                     >
                       <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                           {getActivityIcon(activity.type)}
                           <span className="text-sm font-medium">
                             {activity.license_plate}
                           </span>
                         </div>
                         <span className="text-xs text-gray-500">
                           {activity.time}
                         </span>
                       </div>
                       <div className="text-xs mt-1 opacity-80">
                         {activity.type === 'booking' ? 'Slot dibooking' : 
                          activity.type === 'entry' ? 'Kendaraan masuk' : 
                          activity.type === 'exit' ? 'Kendaraan keluar' : 'Aktivitas'} - {activity.slot} ({activity.block})
                       </div>
                     </div>
                   ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Tidak ada aktivitas terbaru
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;