import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';

interface InfoSlide {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const slides: InfoSlide[] = [
  {
    title: 'Grow Your Practice',
    description: 'Reach more patients who are looking for natural and integrative healing.',
    icon: <TrendingUp className="w-24 h-24 text-[#6CCF93]" />,
  },
  {
    title: 'Manage Your Time',
    description: 'Control your availability, accept bookings, and reduce no-shows.',
    icon: <Calendar className="w-24 h-24 text-[#6CCF93]" />,
  },
  {
    title: 'Connect & Earn',
    description: 'Offer consultations, share remedies, and track your earnings in one place.',
    icon: <DollarSign className="w-24 h-24 text-[#6CCF93]" />,
  },
];

interface InfographicsProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const Infographics: React.FC<InfographicsProps> = ({ onComplete, onSkip }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      onComplete();
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7F8EF] to-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          {slides[currentSlide].icon}
          <h2 className="text-3xl font-bold text-[#2E7D32] mt-8 mb-4">
            {slides[currentSlide].title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
            {slides[currentSlide].description}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-[#6CCF93]'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={onSkip}
            className="text-gray-600 hover:text-[#2E7D32] font-medium"
          >
            Skip
          </button>
          <Button onClick={handleNext} size="lg">
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};
