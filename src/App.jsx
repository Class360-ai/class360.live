import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UpgradeModal from './components/UpgradeModal';
import ProtectedRoute from './components/ProtectedRoute';
import { consumeUpgradePrompt, getUpgradePrompt, isPremiumUser } from './utils/premium';

const HomePage = lazy(() => import('./pages/HomePage'));
const CoursesPage = lazy(() => import('./pages/Courses'));
const TestSeries = lazy(() => import('./pages/TestSeries'));
const TestPage = lazy(() => import('./pages/TestPage'));
const TestResult = lazy(() => import('./pages/TestResult'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const EducatorsPage = lazy(() => import('./pages/EducatorsPage'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const AppPreviewPage = lazy(() => import('./pages/AppPreviewPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('Unlock advanced learning features');

  useEffect(() => {
    const openUpgrade = () => {
      const prompt = getUpgradePrompt();
      setUpgradeReason(prompt?.reason || 'Unlock advanced learning features');
      setUpgradeOpen(true);
    };

    const syncPremium = () => {
      if (isPremiumUser()) {
        setUpgradeOpen(false);
      }
    };

    window.addEventListener('class360-open-upgrade-modal', openUpgrade);
    window.addEventListener('class360-premium-changed', syncPremium);
    return () => {
      window.removeEventListener('class360-open-upgrade-modal', openUpgrade);
      window.removeEventListener('class360-premium-changed', syncPremium);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
              <div className="rounded-[2rem] bg-white px-6 py-5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                Loading Class360 experience...
              </div>
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route
                path="/test-series"
                element={
                  <ProtectedRoute>
                    <TestSeries />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test"
                element={
                  <ProtectedRoute>
                    <TestPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test-result"
                element={
                  <ProtectedRoute>
                    <TestResult />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/educators" element={<EducatorsPage />} />
              <Route path="/app-preview" element={<AppPreviewPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <UpgradeModal
        open={upgradeOpen}
        reason={upgradeReason}
        onClose={(didUpgrade) => {
          consumeUpgradePrompt();
          setUpgradeOpen(false);
        }}
      />
    </div>
  );
}
