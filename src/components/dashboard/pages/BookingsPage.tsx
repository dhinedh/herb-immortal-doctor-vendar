import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Video, MessageSquare, Phone, User } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { BOOKING_STATUS, CONSULTATION_TYPES } from '../../../lib/constants';
import api from '../../../lib/api';
import { BookingDetailsPage } from './BookingDetailsPage';

type FilterTab = 'all' | 'upcoming' | 'past';

interface Booking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  consultation_type: string;
  status: keyof typeof BOOKING_STATUS;
  primary_concern?: string;
  amount: number;
  patients: {
    full_name: string;
    avatar_url?: string;
    date_of_birth?: string;
    gender?: string;
  };
}

export const BookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8">Loading bookings...</div>;
  }

  const filteredBookings = bookings.filter((booking) => {
    const today = new Date().toISOString().split('T')[0];
    const bookingDate = booking.date;

    if (activeTab === 'upcoming') {
      return bookingDate >= today && ['pending', 'confirmed'].includes(booking.status);
    } else if (activeTab === 'past') {
      return bookingDate < today || ['completed', 'cancelled', 'no_show'].includes(booking.status);
    }
    return true;
  });

  if (selectedBookingId) {
    return (
      <BookingDetailsPage
        bookingId={selectedBookingId}
        onBack={() => setSelectedBookingId(null)}
      />
    );
  }

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4" />;
      case 'audio':
        return <Phone className="w-4 h-4" />;
      case 'in_person':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (status: keyof typeof BOOKING_STATUS) => {
    switch (status) {
      case 'confirmed':
        return 'info';
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
      case 'no_show':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const handleJoinCall = (bookingId: string) => {
    alert('Video call feature will be implemented. Booking ID: ' + bookingId);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2E7D32] mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your consultation appointments</p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { key: 'all' as FilterTab, label: 'All Bookings' },
            { key: 'upcoming' as FilterTab, label: 'Upcoming' },
            { key: 'past' as FilterTab, label: 'Past' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 font-medium transition-colors relative ${activeTab === tab.key
                ? 'text-[#2E7D32]'
                : 'text-gray-600 hover:text-[#2E7D32]'
                }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6CCF93]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings found</h3>
          <p className="text-gray-500">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming appointments"
              : activeTab === 'past'
                ? "You don't have any past appointments"
                : "You don't have any bookings yet"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-[#6CCF93] flex items-center justify-center text-white font-semibold text-lg">
                    {booking.patients.full_name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#1F2933] text-lg">
                        {booking.patients.full_name}
                      </h3>
                      {booking.patients.gender && (
                        <span className="text-sm text-gray-500">
                          ({booking.patients.gender})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(booking.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.start_time} - {booking.end_time}
                      </span>
                      <span className="flex items-center gap-1">
                        {getConsultationIcon(booking.consultation_type)}
                        {CONSULTATION_TYPES.find(t => t.value === booking.consultation_type)?.label || booking.consultation_type}
                      </span>
                    </div>
                    {booking.primary_concern && (
                      <p className="text-sm text-gray-500 mt-1">
                        Concern: {booking.primary_concern}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={getStatusVariant(booking.status)}>
                    {BOOKING_STATUS[booking.status]?.label || booking.status}
                  </Badge>
                  {booking.status === 'confirmed' && booking.consultation_type === 'video' && (
                    <Button size="sm" onClick={() => handleJoinCall(booking.id)}>Join Call</Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setSelectedBookingId(booking.id)}>View Details</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
