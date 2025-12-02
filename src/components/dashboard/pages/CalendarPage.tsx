import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { BOOKING_STATUS } from '../../../lib/constants';
import { sampleBookings } from '../../../lib/sampleData';

type ViewMode = 'day' | 'week' | 'month';

interface Booking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  consultation_type: string;
  status: keyof typeof BOOKING_STATUS;
  patients: {
    full_name: string;
  };
}

export const CalendarPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings] = useState<Booking[]>(sampleBookings);

  const getStartDate = () => {
    const date = new Date(currentDate);
    if (viewMode === 'week') {
      date.setDate(date.getDate() - date.getDay());
    } else if (viewMode === 'month') {
      date.setDate(1);
    }
    return date;
  };

  const getEndDate = () => {
    const date = new Date(currentDate);
    if (viewMode === 'day') {
      return date;
    } else if (viewMode === 'week') {
      date.setDate(date.getDate() - date.getDay() + 6);
    } else if (viewMode === 'month') {
      date.setMonth(date.getMonth() + 1, 0);
    }
    return date;
  };

  const navigate = (direction: 'prev' | 'next') => {
    const date = new Date(currentDate);
    if (viewMode === 'day') {
      date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      date.setDate(date.getDate() + (direction === 'next' ? 7 : -7));
    } else if (viewMode === 'month') {
      date.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(date);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDisplayText = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else if (viewMode === 'week') {
      const start = getStartDate();
      const end = getEndDate();
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  const getBookingsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return bookings.filter(b => b.date === dateString);
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const renderDayView = () => {
    const dayBookings = getBookingsForDate(currentDate);

    return (
      <Card className="overflow-auto">
        <div className="min-w-full">
          {timeSlots.map((time) => {
            const hour = parseInt(time.split(':')[0]);
            const slotBookings = dayBookings.filter(b => {
              const bookingHour = parseInt(b.start_time.split(':')[0]);
              return bookingHour === hour;
            });

            return (
              <div key={time} className="flex border-b border-gray-100 min-h-[60px]">
                <div className="w-20 p-2 text-sm text-gray-600 border-r border-gray-100">
                  {time}
                </div>
                <div className="flex-1 p-2">
                  {slotBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-[#E7F8EF] border-l-4 border-[#6CCF93] p-2 rounded mb-1 hover:shadow-sm cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-[#1F2933]">
                            {booking.patients.full_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {booking.start_time} - {booking.end_time}
                          </p>
                        </div>
                        <Badge variant={booking.status === 'confirmed' ? 'info' : 'warning'} className="text-xs">
                          {BOOKING_STATUS[booking.status]?.label}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  const renderWeekView = () => {
    const startDate = getStartDate();
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });

    return (
      <Card className="overflow-auto">
        <div className="min-w-full">
          <div className="flex border-b border-gray-200 sticky top-0 bg-white">
            <div className="w-20" />
            {days.map((day) => (
              <div key={day.toISOString()} className="flex-1 p-2 text-center border-l border-gray-100">
                <p className="text-xs text-gray-600">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className={`text-sm font-semibold ${
                  day.toDateString() === new Date().toDateString()
                    ? 'text-[#6CCF93]'
                    : 'text-[#1F2933]'
                }`}>
                  {day.getDate()}
                </p>
              </div>
            ))}
          </div>
          {timeSlots.map((time) => (
            <div key={time} className="flex border-b border-gray-100 min-h-[50px]">
              <div className="w-20 p-2 text-xs text-gray-600 border-r border-gray-100">
                {time}
              </div>
              {days.map((day) => {
                const dayBookings = getBookingsForDate(day);
                const hour = parseInt(time.split(':')[0]);
                const slotBookings = dayBookings.filter(b => {
                  const bookingHour = parseInt(b.start_time.split(':')[0]);
                  return bookingHour === hour;
                });

                return (
                  <div key={day.toISOString()} className="flex-1 p-1 border-l border-gray-100">
                    {slotBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-[#E7F8EF] border-l-2 border-[#6CCF93] p-1 rounded text-xs hover:shadow-sm cursor-pointer mb-1"
                      >
                        <p className="font-medium truncate">{booking.patients.full_name}</p>
                        <p className="text-[10px] text-gray-600">{booking.start_time}</p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderMonthView = () => {
    const start = getStartDate();
    const end = getEndDate();
    const days = [];
    const firstDay = start.getDay();

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    return (
      <Card>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-white p-2 text-center text-sm font-semibold text-gray-700">
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="bg-white p-2 min-h-[100px]" />;
            }

            const dayBookings = getBookingsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div key={day.toISOString()} className="bg-white p-2 min-h-[100px]">
                <p className={`text-sm font-semibold mb-1 ${
                  isToday ? 'text-[#6CCF93]' : 'text-gray-700'
                }`}>
                  {day.getDate()}
                </p>
                <div className="space-y-1">
                  {dayBookings.slice(0, 2).map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-[#E7F8EF] p-1 rounded text-xs cursor-pointer hover:shadow-sm"
                    >
                      <p className="truncate font-medium">{booking.start_time}</p>
                      <p className="truncate text-[10px]">{booking.patients.full_name}</p>
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <p className="text-xs text-gray-500">+{dayBookings.length - 2} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2E7D32] mb-2">Calendar</h1>
        <p className="text-gray-600">View and manage your appointment schedule</p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('prev')} size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={goToToday} size="sm">
            Today
          </Button>
          <Button variant="outline" onClick={() => navigate('next')} size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold text-[#2E7D32] ml-4">{getDisplayText()}</h2>
        </div>

        <div className="flex gap-2">
          {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <>
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
      </>
    </div>
  );
};
