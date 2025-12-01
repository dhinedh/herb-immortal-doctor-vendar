import React, { useEffect } from 'react';
import { Leaf } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7F8EF] to-white flex flex-col items-center justify-center p-8">
      <div className="animate-fade-in">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-[#6CCF93] p-6 rounded-3xl shadow-lg animate-pulse">
            <Leaf className="w-16 h-16 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-[#2E7D32] text-center mb-3">
          Herb Immortal
        </h1>
        <p className="text-lg text-gray-600 text-center">
          Holistic care. Modern convenience.
        </p>
      </div>
      <p className="absolute bottom-8 text-sm text-gray-500">
        Powered by Herb Immortal
      </p>
    </div>
  );
};
