export const BRAND_COLORS = {
  primary: '#6CCF93',
  primaryDark: '#2E7D32',
  accent: '#E7F8EF',
  error: '#E53935',
  textPrimary: '#1F2933',
  background: '#FFFFFF',
  border: '#E5E7EB',
};

export const CONSULTATION_TYPES = [
  { value: 'video', label: 'Video Call' },
  { value: 'chat', label: 'Chat' },
  { value: 'in_person', label: 'In-Person' },
  { value: 'audio', label: 'Audio Call' },
];

export const BOOKING_STATUS = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  no_show: { label: 'No Show', color: 'bg-gray-100 text-gray-800' },
};

export const ORDER_STATUS = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const PRONOUNS_OPTIONS = [
  'He/Him',
  'She/Her',
  'They/Them',
  'Custom',
];

export const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say',
  'Other',
];

export const SERVICE_LOCATIONS = [
  'Online only',
  'Clinic',
  'Home visits',
  'Hospital',
];

export const SERVICES_PROVIDED_TO = [
  'Adults',
  'Children',
  'Seniors',
  'Couples',
  'Families',
  'Groups',
];

export const TREATMENT_PLATFORMS = [
  'Online Video',
  'Chat',
  'In-person',
  'Audio call',
  'Home visit',
];

export const BADGE_TYPES = {
  top_healer: { label: 'Top Healer', icon: '⭐', color: 'bg-yellow-100 text-yellow-800' },
  '100_patients': { label: '100+ Happy Patients', icon: '🎉', color: 'bg-blue-100 text-blue-800' },
  on_time_star: { label: 'On-time Star', icon: '⏰', color: 'bg-green-100 text-green-800' },
  '500_patients': { label: '500+ Patients', icon: '🏆', color: 'bg-purple-100 text-purple-800' },
  excellent_rating: { label: 'Excellent Rating', icon: '💎', color: 'bg-pink-100 text-pink-800' },
};
