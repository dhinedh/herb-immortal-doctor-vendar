import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';

interface EducationData {
  id?: string;
  degree: string;
  specialization?: string;
  institution: string;
  country: string;
  start_year: number;
  end_year?: number;
}

interface EditEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingData?: EducationData;
  currentData?: EducationData[];
}

export const EditEducationModal: React.FC<EditEducationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingData,
  currentData,
}) => {
  const { user } = useAuth();
  const [degree, setDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [institution, setInstitution] = useState('');
  const [country, setCountry] = useState('');
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [endYear, setEndYear] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingData) {
        setDegree(editingData.degree);
        setSpecialization(editingData.specialization || '');
        setInstitution(editingData.institution);
        setCountry(editingData.country);
        setStartYear(editingData.start_year);
        setEndYear(editingData.end_year || '');
      } else {
        setDegree('');
        setSpecialization('');
        setInstitution('');
        setCountry('');
        setStartYear(new Date().getFullYear());
        setEndYear('');
      }
      setError(null);
    }
  }, [isOpen, editingData]);

  const handleSave = async () => {
    if (!user || !degree.trim() || !institution.trim() || !country.trim()) {
      setError('Degree, institution, and country are required');
      return;
    }

    if (endYear && endYear < startYear) {
      setError('End year cannot be before start year');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newEducation = {
        id: editingData?.id || Date.now().toString(),
        degree,
        specialization,
        institution,
        country,
        start_year: startYear,
        end_year: endYear || undefined
      };

      let updatedList = [...(currentData || [])];

      if (editingData) {
        updatedList = updatedList.map(item => item.id === editingData.id ? newEducation : item);
      } else {
        updatedList.push(newEducation);
      }

      await api.put('/doctors/profile', { education: updatedList });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Save education error:', err);
      setError(err.response?.data?.message || 'Failed to save education');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingData ? 'Edit Education' : 'Add Education'}
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Degree
          </label>
          <Input
            type="text"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            placeholder="e.g., Bachelor of Medicine"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialization
          </label>
          <Input
            type="text"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder="e.g., Cardiology (optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institution
          </label>
          <Input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="University or college name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <Input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country of institution"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Year
            </label>
            <Input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(parseInt(e.target.value))}
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Year (optional)
            </label>
            <Input
              type="number"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value ? parseInt(e.target.value) : '')}
              placeholder="Still studying?"
              min="1900"
              max={new Date().getFullYear() + 10}
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
