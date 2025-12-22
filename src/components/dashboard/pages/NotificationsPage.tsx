import React, { useEffect, useState } from 'react';
import { Bell, Calendar, DollarSign, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { sampleNotifications } from '../../../lib/sampleData';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'system' | 'chat';
  title: string;
  description?: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  // Local state to simulate updates
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initialize local notifications from sample data
    setLocalNotifications(sampleNotifications as unknown as Notification[]);
  }, []);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user, filter, localNotifications]);

  const loadNotifications = async () => {
    if (!user) return;

    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filtered = [...localNotifications];
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.is_read);
    }

    // Sort by date desc
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setNotifications(filtered);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    const updated = localNotifications.map(n =>
      n.id === id ? { ...n, is_read: true } : n
    );
    setLocalNotifications(updated);
  };

  const markAllAsRead = async () => {
    if (!user) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const updated = localNotifications.map(n => ({ ...n, is_read: true }));
    setLocalNotifications(updated);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'chat':
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) {
      return 'Just now';
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2E7D32] mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your latest activities</p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread
          </Button>
        </div>

        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark all as read
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-[#6CCF93] text-lg">Loading notifications...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.is_read ? 'bg-[#E7F8EF]/30' : ''
                  }`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`font-semibold text-[#1F2933] ${!notification.is_read ? 'text-[#2E7D32]' : ''}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatTime(notification.created_at)}
                      </span>
                    </div>
                    {notification.description && (
                      <p className="text-sm text-gray-600">{notification.description}</p>
                    )}
                    {!notification.is_read && (
                      <div className="mt-2">
                        <span className="inline-block w-2 h-2 bg-[#6CCF93] rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
