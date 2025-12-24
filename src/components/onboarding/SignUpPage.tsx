import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

interface SignUpPageProps {
  onLoginClick: () => void;
  onSuccess: () => void;
  onShowTerms: () => void;
  onShowPrivacy: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onLoginClick,
  onSuccess,
  onShowTerms,
  onShowPrivacy,
}) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      setError('Please agree to Terms & Conditions and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.fullName, formData.phone);
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7F8EF] to-white flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#6CCF93] items-center justify-center p-12">
        <div className="text-center">
          <img src={logo} alt="Myherbalshop" className="w-32 h-32 mx-auto mb-6 object-contain" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-white/90">
            Start your online healing practice today
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 lg:hidden">
              <img src={logo} alt="Myherbalshop" className="w-16 h-16 object-contain" />
              <span className="text-xl font-bold text-[#2E7D32]">
                Myherbalshop
              </span>
            </div>
            <h1 className="text-3xl font-bold text-[#2E7D32] mb-2">
              Create your Healer account
            </h1>
            <p className="text-gray-600 mb-8">
              Join Myherbalshop and start your online practice.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <div className="space-y-2">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 accent-[#6CCF93]"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={onShowTerms}
                    className="text-[#6CCF93] hover:text-[#2E7D32] font-medium"
                  >
                    Terms & Conditions
                  </button>
                </span>
              </label>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-1 accent-[#6CCF93]"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={onShowPrivacy}
                    className="text-[#6CCF93] hover:text-[#2E7D32] font-medium"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onLoginClick}
                className="text-[#6CCF93] hover:text-[#2E7D32] font-semibold"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
