import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SplashScreen } from './components/onboarding/SplashScreen';
import { Infographics } from './components/onboarding/Infographics';
import { LoginPage } from './components/onboarding/LoginPage';
import { SignUpPage } from './components/onboarding/SignUpPage';
import { TermsAndConditions } from './components/onboarding/TermsAndConditions';
import { PrivacyPolicy } from './components/onboarding/PrivacyPolicy';
import { OnboardingPage } from './components/onboarding/OnboardingPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { HomePage } from './components/dashboard/HomePage';
import { BookingsPage } from './components/dashboard/pages/BookingsPage';
import { ChatsPage } from './components/dashboard/pages/ChatsPage';
import { CalendarPage } from './components/dashboard/pages/CalendarPage';
import { ProfilePage } from './components/dashboard/pages/ProfilePage';
import { SettingsPage } from './components/dashboard/pages/SettingsPage';
import { NotificationsPage } from './components/dashboard/pages/NotificationsPage';
import api from './lib/api';

// ... (imports remain)
// Ensure ProfileSetup is removed from imports if no longer needed

// ...

type OnboardingStep =
  | 'splash'
  | 'infographics'
  | 'login'
  | 'signup'
  | 'terms'
  | 'privacy'
  | 'profile-setup'
  | 'dashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('splash');
  const [currentPage, setCurrentPage] = useState('home'); // For DashboardLayout navigation

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        try {
          // Check from backend if doctor has completed onboarding
          const response = await api.get('/doctors/profile');
          if (response.data && response.data.onboarding_completed) {
            setOnboardingCompleted(true);
            setOnboardingStep('dashboard');
          } else {
            setOnboardingCompleted(false);
            // If we are logged in but not onboarded, go to profile setup (which is now OnboardingPage)
            if (onboardingStep !== 'profile-setup' && onboardingStep !== 'dashboard') {
              setOnboardingStep('profile-setup');
            }
          }
        } catch (err) {
          // If profile fetch fails (maybe 404 if new user?), assume not onboarded
          console.error('Failed to check onboarding status', err);
          setOnboardingCompleted(false);
          setOnboardingStep('profile-setup');
        }
      }
    };

    if (!loading && user) {
      checkOnboardingStatus();
    }
  }, [user, loading]);

  // Initial loading state or if user is not authenticated
  if (loading) {
    return <SplashScreen onComplete={() => { }} />;
  }

  if (!user) {
    switch (onboardingStep) {
      case 'splash':
        return <SplashScreen onComplete={() => setOnboardingStep('infographics')} />;
      case 'infographics':
        return (
          <Infographics
            onComplete={() => setOnboardingStep('login')}
            onSkip={() => setOnboardingStep('login')}
          />
        );
      case 'login':
        return (
          <LoginPage
            onSignUpClick={() => setOnboardingStep('signup')}
            onSuccess={() => { }} // useEffect will handle redirect
          />
        );
      case 'signup':
        return (
          <SignUpPage
            onLoginClick={() => setOnboardingStep('login')}
            onSuccess={() => { }} // useEffect will handle redirect
            onShowTerms={() => setOnboardingStep('terms')}
            onShowPrivacy={() => setOnboardingStep('privacy')}
          />
        );
      case 'terms':
        return <TermsAndConditions isOpen={true} onClose={() => setOnboardingStep('signup')} />;
      case 'privacy':
        return <PrivacyPolicy isOpen={true} onClose={() => setOnboardingStep('signup')} />;
      default:
        return (
          <LoginPage
            onSignUpClick={() => setOnboardingStep('signup')}
            onSuccess={() => { }}
          />
        );
    }
  }

  // If authenticated but not onboarded, show OnboardingPage
  // We treat 'profile-setup' references as logic for 'OnboardingPage'
  if (user && !onboardingCompleted) {
    return (
      <OnboardingPage
        onComplete={async () => {
          setOnboardingCompleted(true);
          setOnboardingStep('dashboard');
          // Optionally refresh user context if needed, though OnboardingPage updates backend
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
