import React from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree?: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  isOpen,
  onClose,
  onAgree,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy" size="lg">
      <div className="prose prose-sm max-w-none">
        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">What Data We Collect</h3>
        <p className="text-gray-700 mb-4">
          We collect personal information including your name, email, phone number, professional
          credentials, and banking information for payment processing.
        </p>

        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">How We Use Your Data</h3>
        <p className="text-gray-700 mb-4">
          Your data is used to provide platform services, facilitate bookings, process payments,
          and improve our services. We do not sell your personal information to third parties.
        </p>

        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">Sharing of Data</h3>
        <p className="text-gray-700 mb-4">
          We share your professional information with patients who book consultations with you.
          We also share necessary information with payment processors and service providers.
        </p>

        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">Data Retention</h3>
        <p className="text-gray-700 mb-4">
          We retain your data for as long as your account is active or as needed to provide services.
          You may request deletion of your data at any time.
        </p>

        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">Security Measures</h3>
        <p className="text-gray-700 mb-4">
          We implement industry-standard security measures to protect your data, including encryption,
          secure storage, and regular security audits.
        </p>

        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">Your Rights</h3>
        <p className="text-gray-700 mb-4">
          You have the right to access, correct, or delete your personal information. You may also
          object to processing of your data or request data portability.
        </p>

        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">Contact for Privacy Queries</h3>
        <p className="text-gray-700">
          For privacy concerns, contact privacy@herbimmortal.com
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        {onAgree && (
          <Button onClick={onAgree} className="flex-1">
            I Understand
          </Button>
        )}
        <Button onClick={onClose} variant="outline" className="flex-1">
          {onAgree ? 'Cancel' : 'Close'}
        </Button>
      </div>
    </Modal>
  );
};
