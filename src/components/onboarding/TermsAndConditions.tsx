import React from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface TermsAndConditionsProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree?: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  isOpen,
  onClose,
  onAgree,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms & Conditions" size="lg">
      <div className="prose prose-sm max-w-none">
        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">Introduction</h3>
        <p className="text-gray-700 mb-4">
          Welcome to Myherbalshop. These terms and conditions outline the rules and regulations
          for the use of Myherbalshop's platform.
        </p>

        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">Eligibility and Registration</h3>
        <p className="text-gray-700 mb-4">
          You must be a licensed healthcare practitioner to register as a healer on our platform.
          You agree to provide accurate and complete information during registration.
        </p>

        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">Use of Platform</h3>
        <p className="text-gray-700 mb-4">
          The platform is provided for connecting healers with patients seeking holistic care.
          You agree to use the platform only for lawful purposes and in accordance with these terms.
        </p>

        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">Payment and Fees</h3>
        <p className="text-gray-700 mb-4">
          Myherbalshop charges a service fee for facilitating connections and transactions.
          All fees will be clearly communicated before you accept bookings.
        </p>

        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">Cancellations and Refunds</h3>
        <p className="text-gray-700 mb-4">
          Cancellation policies apply to all bookings. Refunds are processed according to
          the platform's refund policy.
        </p>

        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">Confidentiality & Data Protection</h3>
        <p className="text-gray-700 mb-4">
          You agree to maintain patient confidentiality and comply with all applicable
          data protection laws.
        </p>

        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">Limitation of Liability</h3>
        <p className="text-gray-700 mb-4">
          Myherbalshop is not liable for any damages arising from your use of the platform
          or interactions with patients.
        </p>

        <h3 className="text-lg font-semibold text-[#2E7D32] mb-3">Contact</h3>
        <p className="text-gray-700">
          For questions about these terms, please contact support@myherbalshop.com
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        {onAgree && (
          <Button onClick={onAgree} className="flex-1">
            I Agree
          </Button>
        )}
        <Button onClick={onClose} variant="outline" className="flex-1">
          {onAgree ? 'Cancel' : 'Close'}
        </Button>
      </div>
    </Modal>
  );
};
