import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Courses from './pages/CourseCatalog/Courses';
import CourseDetails from './pages/CourseDetails/CourseDetails';
import MyCourses from './pages/MyCourses/MyCourses';
import InstructorCourses from './pages/InstructorDashboard/InstructorCourses';
import CourseStructureManager from './pages/CurriculumManager/CourseStructureManager';
import CourseContent from './pages/CoursePlayer/CourseContent';
import Settings from './pages/Settings/Settings';
import AuthSuccess from './pages/Auth/AuthSuccess';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import About from './pages/About/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { fetchProfile } from './features/auth/authSlice';
import type { AppDispatch, RootState } from './app/store';

const RoleBasedRedirect: React.FC = () => {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (user?.role === 'instructor') {
    return <Navigate to="/instructorcourses" replace />;
  }

  return <Navigate to="/courses" replace />;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);


  return (
    <div className="app-container d-flex flex-column min-vh-100">
      { <Navbar />}
      <main className="main-content flex-grow-1" style={{ width: '100%', padding: 0 }}>
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
            <Route path="/instructorcourses/:courseId/manage" element={<CourseStructureManager />} />
            <Route path="/courses/:courseId/content" element={<CourseContent />} />
            <Route path="/courses/:courseId" element={<CourseDetails />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<RoleBasedRedirect />} />
        </Routes>
      </main>
      { <Footer />}
    </div>
  );
};

export default App;
