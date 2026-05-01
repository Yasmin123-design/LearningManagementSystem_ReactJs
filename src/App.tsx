import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from './routes/ProtectedRoute';

const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Courses = lazy(() => import('./pages/CourseCatalog/Courses'));
const CourseDetails = lazy(() => import('./pages/CourseDetails/CourseDetails'));
const MyCourses = lazy(() => import('./pages/MyCourses/MyCourses'));
const InstructorCourses = lazy(() => import('./pages/InstructorDashboard/InstructorCourses/InstructorCourses'));
const InstructorEnrollments = lazy(() => import('./pages/InstructorDashboard/InstructorEnrollments/InstructorEnrollments'));
const CourseStructureManager = lazy(() => import('./pages/CurriculumManager/CourseStructureManager'));
const QuizManagementPage = lazy(() => import('./pages/QuizManager/QuizManagementPage'));
const CourseContent = lazy(() => import('./pages/CoursePlayer/CourseContent'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const AuthSuccess = lazy(() => import('./pages/Auth/AuthSuccess'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const About = lazy(() => import('./pages/About/About'));

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { initializeAuth } from './features/auth/authSlice';
import type { AppDispatch, RootState } from './app/store';
import { Toaster } from 'react-hot-toast';
import { useSocketNotifications } from './hooks/useSocketNotifications';

const PageLoader = () => (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
        <div className="d-flex flex-column align-items-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-secondary fw-semibold">Loading content...</p>
        </div>
    </div>
);

const RoleBasedRedirect: React.FC = () => {
  const { user, isInitialized, loading } = useSelector((state: RootState) => state.auth);

  if (!isInitialized || loading) {
    return <PageLoader />;
  }

  if (user?.role === 'instructor') {
    return <Navigate to="/instructorcourses" replace />;
  }

  return <Navigate to="/courses" replace />;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isInitialized } = useSelector((state: RootState) => state.auth);

  useSocketNotifications();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (!isInitialized) {
    return <PageLoader />;
  }

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <main className="main-content flex-grow-1" style={{ width: '100%', padding: 0 }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<RoleBasedRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth-success" element={<AuthSuccess />} />
            <Route path="/about" element={<About />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/courses" element={<Courses />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/instructorcourses" element={<InstructorCourses />} />
              <Route path="/instructor/enrollments" element={<InstructorEnrollments />} />
              <Route path="/instructorcourses/:courseId/manage" element={<CourseStructureManager />} />
              <Route path="/instructor/courses/:courseId/lessons/:lessonId/quiz" element={<QuizManagementPage />} />
              <Route path="/courses/:courseId/content" element={<CourseContent />} />
              <Route path="/courses/:courseId" element={<CourseDetails />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<RoleBasedRedirect />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;
