import React, { useState } from 'react';
import { Bell, ArrowLeft, Check, CheckCheck } from 'lucide-react';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([
    {
      notification_id: 1,
      type: 'SUBMITTED',
      message: 'John Doe has applied for Software Engineer position',
      created_at: '2024-02-08T10:30:00',
      is_read: false,
      sender: {
        name: 'John Doe',
        image: null
      },
      company: {
        name: 'DBS Bank',
        image: null
      }
    },
    {
      notification_id: 2,
      type: 'INTERVIEW',
      message: 'Interview scheduled with Sarah Chen for Product Manager role',
      created_at: '2024-02-08T09:15:00',
      is_read: false,
      sender: {
        name: 'Sarah Chen',
        image: null
      },
      company: {
        name: 'Tech Corp',
        image: null
      }
    },
    {
      notification_id: 3,
      type: 'ACCEPTED',
      message: 'Your application for Data Analyst has been accepted',
      created_at: '2024-02-07T16:45:00',
      is_read: true,
      sender: {
        name: 'HR Team',
        image: null
      },
      company: {
        name: 'Finance Co',
        image: null
      }
    },
    {
      notification_id: 4,
      type: 'REJECTED',
      message: 'Unfortunately, your application was not successful',
      created_at: '2024-02-07T14:20:00',
      is_read: true,
      sender: {
        name: 'Recruitment',
        image: null
      },
      company: {
        name: 'Startup Inc',
        image: null
      }
    }
  ]);

  const getNotificationColor = (type) => {
    const colors = {
      SUBMITTED: 'bg-blue-500/20 text-blue-400',
      INTERVIEW: 'bg-purple-500/20 text-purple-400',
      ACCEPTED: 'bg-green-500/20 text-green-400',
      REJECTED: 'bg-red-500/20 text-red-400',
      WITHDRAWN: 'bg-gray-500/20 text-gray-400'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.notification_id === notificationId
          ? { ...notif, is_read: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, is_read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1b33] to-[#0a1628]">
      {/* Header */}
      <div className="bg-[#0d1f3d]/50 backdrop-blur-sm border-b border-blue-900/30 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-blue-900/20 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-blue-300" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Bell className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Notifications</h1>
                  <p className="text-sm text-gray-400">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                  </p>
                </div>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.notification_id}
              className={`relative bg-[#162947]/40 backdrop-blur-sm border rounded-xl p-4 transition-all hover:border-blue-600/50 ${
                notification.is_read
                  ? 'border-blue-900/30 opacity-70'
                  : 'border-blue-700/50 shadow-lg shadow-blue-900/20'
              }`}
            >
              {/* Unread indicator */}
              {!notification.is_read && (
                <div className="absolute top-4 right-4">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}

              <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(notification.sender?.name || notification.company?.name)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white">
                        {notification.sender?.name || notification.company?.name}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                        {notification.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-3">
                    {notification.message}
                  </p>

                  {notification.company?.name && notification.sender?.name && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="px-2 py-1 bg-blue-900/30 rounded">
                        {notification.company.name}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  {!notification.is_read && (
                    <div className="mt-3 pt-3 border-t border-blue-900/30">
                      <button
                        onClick={() => markAsRead(notification.notification_id)}
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Mark as read
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block p-4 bg-blue-900/20 rounded-full mb-4">
              <Bell className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-400 mb-2">No notifications</h3>
            <p className="text-gray-500 text-sm">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;