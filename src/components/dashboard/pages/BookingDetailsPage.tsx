import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Video, MessageSquare, Phone, FileText, Paperclip, ArrowLeft, User } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { BOOKING_STATUS, CONSULTATION_TYPES } from '../../../lib/constants';
import api from '../../../lib/api';

interface BookingDetailsPageProps {
  bookingId: string;
  onBack: () => void;
}

interface BookingDetails {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  consultation_type: string;
  status: keyof typeof BOOKING_STATUS;
  primary_concern?: string;
  notes?: string;
  amount: number;
  patients: {
    full_name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    avatar_url?: string;
  };
}

interface Attachment {
  id: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  uploaded_by: string;
  uploaded_at: string;
}

export const BookingDetailsPage: React.FC<BookingDetailsPageProps> = ({ bookingId, onBack }) => {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // In a real app, we would have a specific endpoint for details or reusing the list
        // For now, let's assume we can fetch by ID from the bookings list endpoint or a specific one
        // Since we don't have a specific GET /bookings/:id in our routes yet (we only did GET /), 
        // we might need to update backend or just filter client side if we fetch all.
        // BUT, ideally we should add GET /bookings/:id to backend. 
        // Let's add it to backend quickly or just filter from all bookings if list is small.
        // Given existing backend code: router.get('/', ...) returns all.
        // Let's implement client-side filter from GET /bookings to matching ID for now to be safe without changing backend again immediately, 
        // or better, I should allow the backend to serve it.
        // Actually I can just fetch all and find it, similar to how sampleData worked, but async.

        const response = await api.get('/bookings');
        const foundBooking = response.data.find((b: any) => b.id === bookingId);

        if (foundBooking) {
          setBooking({
            ...foundBooking,
            // Ensure patients object has expected fields if missing from aggregation
            patients: {
              ...foundBooking.patients,
              email: foundBooking.patients?.email || 'N/A', // fallback
              phone: foundBooking.patients?.phone || 'N/A'
            }
          });
          setNotes(foundBooking.notes || '');
        }
      } catch (error) {
        console.error("Failed to fetch booking details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
    setAttachments([]);
  }, [bookingId]);

  const handleSaveNotes = () => {
    if (!booking) return;
    alert('Notes saved successfully!');
  };

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'chat':
        return <MessageSquare className="w-5 h-5" />;
      case 'audio':
        return <Phone className="w-5 h-5" />;
      case 'in_person':
        return <MapPin className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-[#6CCF93] text-lg">Loading booking details...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <Card className="text-center py-12">
        <p className="text-gray-600">Booking not found</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </Card>
    );
  }

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-[#2E7D32] mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Bookings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#2E7D32] mb-2">Booking Details</h1>
                <p className="text-gray-600">ID: {booking.id.slice(0, 8)}</p>
              </div>
              <Badge variant={getStatusVariant(booking.status)}>
                {BOOKING_STATUS[booking.status]?.label || booking.status}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getConsultationIcon(booking.consultation_type)}
                <div>
                  <p className="text-sm text-gray-600">Consultation Type</p>
                  <p className="font-medium text-[#1F2933]">
                    {CONSULTATION_TYPES.find(t => t.value === booking.consultation_type)?.label || booking.consultation_type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium text-[#1F2933]">
                    {new Date(booking.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.start_time} - {booking.end_time} ({booking.duration_minutes} mins)
                  </p>
                </div>
              </div>

              {booking.primary_concern && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Primary Concern</p>
                  <p className="font-medium text-[#1F2933]">{booking.primary_concern}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600 mb-1">Amount</p>
                <p className="font-medium text-[#1F2933]">₹{booking.amount.toFixed(2)}</p>
              </div>
            </div>

            {booking.status === 'confirmed' && (
              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                {booking.consultation_type === 'video' && (
                  <Button className="flex-1">
                    <Video className="w-4 h-4 mr-2" />
                    Join Video Call
                  </Button>
                )}
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Open Chat
                </Button>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-[#2E7D32] mb-4">Healer's Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CCF93]"
              placeholder="Add your consultation notes here..."
            />
            <div className="mt-4">
              <Button onClick={handleSaveNotes}>
                <FileText className="w-4 h-4 mr-2" />
                Save Notes
              </Button>
            </div>
          </Card>

          {attachments.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold text-[#2E7D32] mb-4">Attachments</h2>
              <div className="space-y-3">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-[#1F2933]">{attachment.file_name}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded by {attachment.uploaded_by} on{' '}
                          {new Date(attachment.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-[#2E7D32] mb-4">Patient Information</h2>
            <div className="text-center mb-4">
              <div className="w-20 h-20 rounded-full bg-[#6CCF93] flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-3">
                {booking.patients.full_name[0]}
              </div>
              <h3 className="font-semibold text-lg text-[#1F2933]">{booking.patients.full_name}</h3>
            </div>

            <div className="space-y-3">
              {booking.patients.date_of_birth && (
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-medium text-[#1F2933]">
                    {calculateAge(booking.patients.date_of_birth)} years
                  </p>
                </div>
              )}

              {booking.patients.gender && (
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-medium text-[#1F2933]">{booking.patients.gender}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-[#1F2933]">{booking.patients.email}</p>
              </div>

              {booking.patients.phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-[#1F2933]">{booking.patients.phone}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button variant="outline" className="w-full">
                <User className="w-4 h-4 mr-2" />
                View Full Profile
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-[#2E7D32] mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Add Follow-up Booking
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Generate Prescription
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
