import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

interface LoginPageProps {
  onSignUpClick: () => void;
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSignUpClick, onSuccess }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      onSuccess();
    } catch (err) {
      setError('Invalid email or password. Please try again.');
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
            Welcome Back
          </h2>
          <p className="text-xl text-white/90">
            Continue your healing journey
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
            <p className="text-gray-600 mb-8">
              Log in to continue with Myherbalshop.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email or Phone"
              type="email"
              placeholder="Enter your registered email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="If you haven't registered, please sign up first."
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-[#6CCF93] hover:text-[#2E7D32] font-medium"
              >
                Forgot password?
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSignUpClick}
                className="text-[#6CCF93] hover:text-[#2E7D32] font-semibold"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
