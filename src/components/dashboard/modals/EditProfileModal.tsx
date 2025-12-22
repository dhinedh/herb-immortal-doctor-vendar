import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useAuth } from '../../../contexts/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: {
    full_name: string;
    preferred_name?: string;
    phone?: string;
    about?: string;
    work_best_with?: string;
  };
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(initialData.full_name);
  const [preferredName, setPreferredName] = useState(initialData.preferred_name || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [about, setAbout] = useState(initialData.about || '');
  const [workBestWith, setWorkBestWith] = useState(initialData.work_best_with || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFullName(initialData.full_name);
    setPreferredName(initialData.preferred_name || '');
    setPhone(initialData.phone || '');
    setAbout(initialData.about || '');
    setWorkBestWith(initialData.work_best_with || '');
    setError(null);
  }, [isOpen, initialData]);

  const handleSave = async () => {
    if (!user || !fullName.trim()) {
      setError('Full name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // In a real app we'd update Supabase here.
      // For mock, we just assume success.

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Name
          </label>
          <Input
            type="text"
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
            placeholder="How you prefer to be called"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About
          </label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell patients about yourself and your practice"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            I work best with
          </label>
          <textarea
            value={workBestWith}
            onChange={(e) => setWorkBestWith(e.target.value)}
            placeholder="Describe your ideal patients or practice preferences"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
