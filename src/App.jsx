import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UpgradeModal from './components/UpgradeModal';
import AdminRoute from './components/admin/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { consumeUpgradePrompt, getUpgradePrompt, isPremiumUser } from './utils/premium';

const HomePage = lazy(() => import('./pages/HomePage'));
const VoiceLearningHome = lazy(() => import('./pages/VoiceLearningHome'));
const VoiceLearningChapter = lazy(() => import('./pages/VoiceLearningChapter'));
const CoursesPage = lazy(() => import('./pages/Courses'));
const TestSeries = lazy(() => import('./pages/TestSeries'));
const TestPage = lazy(() => import('./pages/TestPage'));
const TestResult = lazy(() => import('./pages/TestResult'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LearningHomePage = lazy(() => import('./pages/LearningHomePage'));
const LearningSubjectPage = lazy(() => import('./pages/LearningSubjectPage'));
const LearningChapterPage = lazy(() => import('./pages/LearningChapterPage'));
const LearningTestPage = lazy(() => import('./pages/LearningTestPage'));
const LearningDashboardPage = lazy(() => import('./pages/LearningDashboardPage'));
const BusinessMarketLearningPage = lazy(() => import('./pages/BusinessMarketLearningPage'));
const DailyTradingSeriesPage = lazy(() => import('./pages/DailyTradingSeriesPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminSubjectsPage = lazy(() => import('./pages/admin/AdminSubjectsPage'));
const AdminAddSubjectPage = lazy(() => import('./pages/admin/AdminAddSubjectPage'));
const AdminChaptersPage = lazy(() => import('./pages/admin/AdminChaptersPage'));
const AdminAddChapterPage = lazy(() => import('./pages/admin/AdminAddChapterPage'));
const AdminDailySeriesPage = lazy(() => import('./pages/admin/AdminDailySeriesPage'));
const AdminNotesPage = lazy(() => import('./pages/admin/AdminNotesPage'));
const AdminQuestionsPage = lazy(() => import('./pages/admin/AdminQuestionsPage'));
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
              <Route path="/voice-learning" element={<VoiceLearningHome />} />
              <Route path="/voice-learning/:chapterId" element={<VoiceLearningChapter />} />
              <Route path="/learning" element={<LearningHomePage />} />
              <Route path="/learning/subjects/:subjectSlug" element={<LearningSubjectPage />} />
              <Route path="/learning/chapters/:chapterSlug" element={<LearningChapterPage />} />
              <Route path="/learning/chapters/:chapterSlug/test" element={<LearningTestPage />} />
              <Route path="/learning/dashboard" element={<LearningDashboardPage />} />
              <Route path="/business-market-learning" element={<BusinessMarketLearningPage />} />
              <Route path="/business-market-learning/trading-from-zero-to-pro" element={<DailyTradingSeriesPage />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/subjects"
                element={
                  <AdminRoute>
                    <AdminSubjectsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/subjects/new"
                element={
                  <AdminRoute>
                    <AdminAddSubjectPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/chapters"
                element={
                  <AdminRoute>
                    <AdminChaptersPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/chapters/new"
                element={
                  <AdminRoute>
                    <AdminAddChapterPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/daily-series"
                element={
                  <AdminRoute>
                    <AdminDailySeriesPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/notes"
                element={
                  <AdminRoute>
                    <AdminNotesPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/questions"
                element={
                  <AdminRoute>
                    <AdminQuestionsPage />
                  </AdminRoute>
                }
              />
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
