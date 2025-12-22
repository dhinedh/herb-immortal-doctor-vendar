import React, { useEffect, useState } from 'react';
import { Calendar, TrendingUp, DollarSign, Award } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { BADGE_TYPES, BOOKING_STATUS } from '../../lib/constants';
import { sampleBookings, sampleDoctor, sampleWallet, sampleBadges } from '../../lib/sampleData';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [doctorData, setDoctorData] = useState<{
    full_name: string;
    preferred_name: string;
  } | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    sessionsThisWeek: 0,
    newPatients: 0,
    averageRating: 0,
  });
  const [earnings, setEarnings] = useState({ balance: 0, trend: 0 });
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock Doctor Data
    setDoctorData({
      full_name: sampleDoctor.full_name,
      preferred_name: sampleDoctor.preferred_name,
    });

    // Mock Upcoming Bookings
    const today = new Date().toISOString().split('T')[0];
    const futureBookings = sampleBookings
      .filter(b => b.date >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);

    setUpcomingBookings(futureBookings);

    // Mock Stats
    setStats({
      sessionsThisWeek: 15,
      newPatients: 12,
      averageRating: 4.8,
    });

    // Mock Earnings
    setEarnings({
      balance: sampleWallet.balance,
      trend: 12, // Mock trend
    });

    // Mock Badges
    setBadges(sampleBadges);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = doctorData?.preferred_name || doctorData?.full_name || 'Doctor';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2E7D32] mb-2">
          {getGreeting()}, Healer {displayName}
        </h1>
        <p className="text-gray-600">Here's a quick overview of your day.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Upcoming Sessions</p>
              <p className="text-3xl font-bold text-[#2E7D32]">{upcomingBookings.length}</p>
            </div>
            <div className="bg-[#E7F8EF] p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-[#6CCF93]" />
            </div>
          </div>
          <p className="text-sm text-gray-600">Next 5 bookings</p>
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">This Week</p>
              <p className="text-3xl font-bold text-[#2E7D32]">{stats.sessionsThisWeek}</p>
            </div>
            <div className="bg-[#E7F8EF] p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-[#6CCF93]" />
            </div>
          </div>
          <p className="text-sm text-gray-600">{stats.newPatients} new patients</p>
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Earnings</p>
              <p className="text-3xl font-bold text-[#2E7D32]">₹{earnings.balance.toLocaleString()}</p>
            </div>
            <div className="bg-[#E7F8EF] p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-[#6CCF93]" />
            </div>
          </div>
          <p className="text-sm text-green-600">+{earnings.trend}% vs last month</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#2E7D32]">Upcoming Sessions</h2>
            <button className="text-sm text-[#6CCF93] hover:text-[#2E7D32] font-medium">
              View all
            </button>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No upcoming bookings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking: { id: string; date: string; start_time: string; duration_minutes: number; consultation_type: string; status: keyof typeof BOOKING_STATUS; patients: { full_name: string; avatar_url?: string } }) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#6CCF93] flex items-center justify-center text-white font-semibold">
                      {booking.patients.full_name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2933]">{booking.patients.full_name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.date).toLocaleDateString()} at {booking.start_time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={booking.status === 'confirmed' ? 'info' : 'warning'}>
                      {BOOKING_STATUS[booking.status]?.label || booking.status}
                    </Badge>
                    <button className="px-4 py-2 bg-[#6CCF93] text-white rounded-lg hover:bg-[#5ABE81] text-sm font-medium">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-[#6CCF93]" />
            <h2 className="text-xl font-semibold text-[#2E7D32]">My Badges</h2>
          </div>

          {badges.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No badges yet</p>
              <p className="text-sm text-gray-500 mt-1">Complete milestones to earn badges</p>
            </div>
          ) : (
            <div className="space-y-3">
              {badges.map((badgeType) => {
                const badge = BADGE_TYPES[badgeType as keyof typeof BADGE_TYPES];
                return (
                  <div
                    key={badgeType}
                    className={`p-3 rounded-lg ${badge.color} flex items-center gap-3`}
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="font-medium">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
