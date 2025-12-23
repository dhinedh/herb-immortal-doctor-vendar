export const samplePatients = [
  {
    id: 'patient-1',
    full_name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    date_of_birth: '1985-03-15',
    gender: 'Female',
    avatar_url: undefined,
  },
  {
    id: 'patient-2',
    full_name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    date_of_birth: '1990-07-22',
    gender: 'Male',
    avatar_url: undefined,
  },
  {
    id: 'patient-3',
    full_name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    date_of_birth: '1988-11-30',
    gender: 'Female',
    avatar_url: undefined,
  },
  {
    id: 'patient-4',
    full_name: 'David Thompson',
    email: 'david.thompson@email.com',
    phone: '+1 (555) 456-7890',
    date_of_birth: '1975-09-08',
    gender: 'Male',
    avatar_url: undefined,
  },
  {
    id: 'patient-5',
    full_name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    phone: '+1 (555) 567-8901',
    date_of_birth: '1992-05-17',
    gender: 'Female',
    avatar_url: undefined,
  },
];

export const sampleBookings = [
  {
    id: 'booking-1',
    patient_id: 'patient-1',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '11:00',
    duration_minutes: 60,
    consultation_type: 'video',
    status: 'confirmed' as const,
    primary_concern: 'Digestive health consultation',
    notes: '',
    amount: 75.00,
    patients: samplePatients[0],
  },
  {
    id: 'booking-2',
    patient_id: 'patient-2',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    start_time: '14:00',
    end_time: '14:30',
    duration_minutes: 30,
    consultation_type: 'chat',
    status: 'pending' as const,
    primary_concern: 'Follow-up on herbal treatment',
    notes: '',
    amount: 50.00,
    patients: samplePatients[1],
  },
  {
    id: 'booking-3',
    patient_id: 'patient-3',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:00',
    duration_minutes: 60,
    consultation_type: 'in_person',
    status: 'confirmed' as const,
    primary_concern: 'Stress management and anxiety',
    notes: '',
    amount: 100.00,
    patients: samplePatients[2],
  },
  {
    id: 'booking-4',
    patient_id: 'patient-4',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    start_time: '11:00',
    end_time: '12:00',
    duration_minutes: 60,
    consultation_type: 'video',
    status: 'completed' as const,
    primary_concern: 'Joint pain and inflammation',
    notes: 'Patient responded well to turmeric supplement recommendation',
    amount: 75.00,
    patients: samplePatients[3],
  },
  {
    id: 'booking-5',
    patient_id: 'patient-5',
    date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    start_time: '15:00',
    end_time: '16:00',
    duration_minutes: 60,
    consultation_type: 'audio',
    status: 'confirmed' as const,
    primary_concern: 'Sleep disorders and insomnia',
    notes: '',
    amount: 75.00,
    patients: samplePatients[4],
  },
];

export const sampleChats = [
  {
    id: 'chat-1',
    patient_id: 'patient-1',
    last_message: 'Thank you for the consultation, Healer!',
    last_message_at: new Date(Date.now() - 3600000).toISOString(),
    unread_count_healer: 1,
    patients: samplePatients[0],
  },
  {
    id: 'chat-2',
    patient_id: 'patient-2',
    last_message: 'Can I reschedule my appointment?',
    last_message_at: new Date(Date.now() - 7200000).toISOString(),
    unread_count_healer: 2,
    patients: samplePatients[1],
  },
  {
    id: 'chat-3',
    patient_id: 'patient-3',
    last_message: 'The herbal tea is working great!',
    last_message_at: new Date(Date.now() - 86400000).toISOString(),
    unread_count_healer: 0,
    patients: samplePatients[2],
  },
];

export const sampleMessages = {
  'chat-1': [
    {
      id: 'msg-1',
      chat_id: 'chat-1',
      sender_type: 'patient',
      sender_id: 'patient-1',
      content: 'Hello Healer, I wanted to ask about the herbal supplements you recommended.',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      is_read: true,
    },
    {
      id: 'msg-2',
      chat_id: 'chat-1',
      sender_type: 'healer',
      sender_id: 'healer-1',
      content: 'Hello Sarah! Of course, what would you like to know?',
      created_at: new Date(Date.now() - 7000000).toISOString(),
      is_read: true,
    },
    {
      id: 'msg-3',
      chat_id: 'chat-1',
      sender_type: 'patient',
      sender_id: 'patient-1',
      content: 'Should I take them before or after meals?',
      created_at: new Date(Date.now() - 6800000).toISOString(),
      is_read: true,
    },
    {
      id: 'msg-4',
      chat_id: 'chat-1',
      sender_type: 'healer',
      sender_id: 'healer-1',
      content: 'I recommend taking them after meals for better absorption. Make sure to take them with plenty of water.',
      created_at: new Date(Date.now() - 6600000).toISOString(),
      is_read: true,
    },
    {
      id: 'msg-5',
      chat_id: 'chat-1',
      sender_type: 'patient',
      sender_id: 'patient-1',
      content: 'Thank you for the consultation, Doctor!',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      is_read: false,
    },
  ],
  'chat-2': [
    {
      id: 'msg-6',
      chat_id: 'chat-2',
      sender_type: 'patient',
      sender_id: 'patient-2',
      content: 'Hi Doctor, I have a question about my appointment.',
      created_at: new Date(Date.now() - 7300000).toISOString(),
      is_read: true,
    },
    {
      id: 'msg-7',
      chat_id: 'chat-2',
      sender_type: 'patient',
      sender_id: 'patient-2',
      content: 'Can I reschedule my appointment?',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      is_read: false,
    },
  ],
  'chat-3': [
    {
      id: 'msg-8',
      chat_id: 'chat-3',
      sender_type: 'patient',
      sender_id: 'patient-3',
      content: 'The herbal tea is working great!',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      is_read: true,
    },
  ],
};

export const sampleDoctor = {
  id: 'doctor-123',
  full_name: 'Dr. John Doe',
  preferred_name: 'John',
  email: 'john.doe@example.com',
  phone: '+1 (555) 000-0000',
  specialization: 'Ayurveda',
  experience_years: 15,
  consultation_fee: 500,
  about: 'Experienced Ayurvedic practitioner with a focus on holistic healing and natural remedies.',
  avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
  status: 'approved',
  rating: 4.8,
  review_count: 124,
};

export const sampleWallet = {
  id: 'wallet-1',
  doctor_id: 'doctor-123',
  balance: 15450,
  total_earned: 45000,
  total_withdrawn: 29550,
  transactions: [
    { id: 'tx-1', type: 'credit', amount: 500, description: 'Consultation - Sarah Johnson', date: '2025-12-20' },
    { id: 'tx-2', type: 'debit', amount: 2000, description: 'Withdrawal to Bank', date: '2025-12-18' },
  ]
};

export const sampleBadges = ['top_healer', 'excellent_rating', 'on_time_star'];

export const sampleProducts = [
  {
    id: 'prod-1',
    name: 'Immunity Booster Tea',
    description: 'A blend of traditional herbs to strengthen your immune system.',
    price: 250,
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&h=400&fit=crop',
    category: 'Tea',
    status: 'active'
  },
  {
    id: 'prod-2',
    name: 'Joint Relief Oil',
    description: 'Herbal oil for relief from joint pain and inflammation.',
    price: 350,
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
    category: 'Oil',
    status: 'active'
  }
];

export const sampleOrders = [
  {
    id: 'ord-1',
    customer_name: 'Sarah Johnson',
    date: '2025-12-21',
    status: 'pending',
    total: 500,
    items: [
      { product_name: 'Immunity Booster Tea', quantity: 2, price: 250 }
    ]
  },
  {
    id: 'ord-2',
    customer_name: 'Michael Chen',
    date: '2025-12-20',
    status: 'delivered',
    total: 350,
    items: [
      { product_name: 'Joint Relief Oil', quantity: 1, price: 350 }
    ]
  }
];

export const sampleNotifications = [
  {
    id: 'notif-1',
    title: 'New Booking Request',
    message: 'Sarah Johnson has requested a video consultation.',
    type: 'booking',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'notif-2',
    title: 'Payment Received',
    message: 'You received ₹500 for consultation #1234.',
    type: 'payment',
    read: true,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];
