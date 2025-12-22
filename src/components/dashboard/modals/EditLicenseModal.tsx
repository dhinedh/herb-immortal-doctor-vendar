import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useAuth } from '../../../contexts/AuthContext';

interface LicenseData {
  id?: string;
  license_type: string;
  issuing_authority: string;
  license_number: string;
  issue_date: string;
  expiry_date?: string;
}

interface EditLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingData?: LicenseData;
}

export const EditLicenseModal: React.FC<EditLicenseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingData,
}) => {
  const { user } = useAuth();
  const [licenseType, setLicenseType] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingData) {
        setLicenseType(editingData.license_type);
        setIssuingAuthority(editingData.issuing_authority);
        setLicenseNumber(editingData.license_number);
        setIssueDate(editingData.issue_date);
        setExpiryDate(editingData.expiry_date || '');
      } else {
        setLicenseType('');
        setIssuingAuthority('');
        setLicenseNumber('');
        setIssueDate('');
        setExpiryDate('');
      }
      setError(null);
    }
  }, [isOpen, editingData]);

  const handleSave = async () => {
    if (!user || !licenseType.trim() || !issuingAuthority.trim() || !licenseNumber.trim() || !issueDate) {
      setError('License type, issuing authority, license number, and issue date are required');
      return;
    }

    if (expiryDate && new Date(expiryDate) < new Date(issueDate)) {
      setError('Expiry date cannot be before issue date');
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
      setError(err instanceof Error ? err.message : 'Failed to save license');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingData ? 'Edit License' : 'Add License'}
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Type
          </label>
          <Input
            type="text"
            value={licenseType}
            onChange={(e) => setLicenseType(e.target.value)}
            placeholder="e.g., Medical License, Ayurvedic Practitioner"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issuing Authority
          </label>
          <Input
            type="text"
            value={issuingAuthority}
            onChange={(e) => setIssuingAuthority(e.target.value)}
            placeholder="Government body or organization"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Number
          </label>
          <Input
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="License or registration number"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issue Date
            </label>
            <Input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date (optional)
            </label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
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
