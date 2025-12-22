import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SplashScreen } from './components/onboarding/SplashScreen';
import { Infographics } from './components/onboarding/Infographics';
import { LoginPage } from './components/onboarding/LoginPage';
import { SignUpPage } from './components/onboarding/SignUpPage';
import { TermsAndConditions } from './components/onboarding/TermsAndConditions';
import { PrivacyPolicy } from './components/onboarding/PrivacyPolicy';
import { ProfileSetup } from './components/onboarding/ProfileSetup';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { HomePage } from './components/dashboard/HomePage';
import { BookingsPage } from './components/dashboard/pages/BookingsPage';
import { ChatsPage } from './components/dashboard/pages/ChatsPage';
import { CalendarPage } from './components/dashboard/pages/CalendarPage';
import { ProfilePage } from './components/dashboard/pages/ProfilePage';
import { SettingsPage } from './components/dashboard/pages/SettingsPage';
import { NotificationsPage } from './components/dashboard/pages/NotificationsPage';

type OnboardingStep =
  | 'splash'
  | 'infographics'
  | 'auth'
  | 'profile-setup'
  | 'dashboard';

type AuthView = 'login' | 'signup';

function AppContent() {
  const { user, loading } = useAuth();
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('splash');
  const [authView, setAuthView] = useState<AuthView>('login');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        // Simulate API check
        await new Promise(resolve => setTimeout(resolve, 500));

        // For mock purposes, assume if we have a user they are onboarded unless explicitly set otherwise
        // In a real mock scenario we might check localStorage, but for now let's assume success
        // to get to the dashboard.
        setOnboardingCompleted(true);
        setOnboardingStep('dashboard');
      }
    };

    if (!loading && user) {
      checkOnboardingStatus();
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E7F8EF] to-white flex items-center justify-center">
        <div className="animate-pulse text-[#6CCF93] text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    if (onboardingStep === 'splash') {
      return (
        <SplashScreen onComplete={() => setOnboardingStep('infographics')} />
      );
    }

    if (onboardingStep === 'infographics') {
      return (
        <Infographics
          onComplete={() => setOnboardingStep('auth')}
          onSkip={() => setOnboardingStep('auth')}
        />
      );
    }

    if (onboardingStep === 'auth') {
      return (
        <>
          {authView === 'login' ? (
            <LoginPage
              onSignUpClick={() => setAuthView('signup')}
              onSuccess={() => setOnboardingStep('profile-setup')}
            />
          ) : (
            <SignUpPage
              onLoginClick={() => setAuthView('login')}
              onSuccess={() => setOnboardingStep('profile-setup')}
              onShowTerms={() => setShowTerms(true)}
              onShowPrivacy={() => setShowPrivacy(true)}
            />
          )}
          <TermsAndConditions
            isOpen={showTerms}
            onClose={() => setShowTerms(false)}
          />
          <PrivacyPolicy
            isOpen={showPrivacy}
            onClose={() => setShowPrivacy(false)}
          />
        </>
      );
    }
  }

  if (user && !onboardingCompleted && onboardingStep !== 'dashboard') {
    return (
      <ProfileSetup
        onComplete={() => {
          setOnboardingCompleted(true);
          setOnboardingStep('dashboard');
        }}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'bookings':
        return <BookingsPage />;
      case 'chats':
        return <ChatsPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'notifications':
        return <NotificationsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </DashboardLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
