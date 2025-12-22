import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useAuth } from '../../../contexts/AuthContext';

interface CertificateData {
  id?: string;
  title: string;
  issued_by: string;
  year: number;
}

interface EditCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingData?: CertificateData;
}

export const EditCertificateModal: React.FC<EditCertificateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingData,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [issuedBy, setIssuedBy] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingData) {
        setTitle(editingData.title);
        setIssuedBy(editingData.issued_by);
        setYear(editingData.year);
      } else {
        setTitle('');
        setIssuedBy('');
        setYear(new Date().getFullYear());
      }
      setError(null);
    }
  }, [isOpen, editingData]);

  const handleSave = async () => {
    if (!user || !title.trim() || !issuedBy.trim()) {
      setError('Certificate title and issuing organization are required');
      return;
    }

    if (year < 1900 || year > new Date().getFullYear() + 1) {
      setError('Please enter a valid year');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingData ? 'Edit Certificate' : 'Add Certificate'}
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificate Title
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Advanced Certification in Herbal Medicine"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issued By
          </label>
          <Input
            type="text"
            value={issuedBy}
            onChange={(e) => setIssuedBy(e.target.value)}
            placeholder="Organization or institution"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            min="1900"
            max={new Date().getFullYear() + 1}
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
