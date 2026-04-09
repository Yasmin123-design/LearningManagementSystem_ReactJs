import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import type { RootState } from '../../app/store';
import { getAvatarUrl } from '../../utils/getAvatarUrl';
import './DashboardLayout.css';

interface DashboardLayoutProps {
    children: React.ReactNode;
    customHeader?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, customHeader }) => {
    const location = useLocation();
    const { user } = useSelector((state: RootState) => state.auth);

    const profile = {
        name: user?.name || "Guest",
        role: user?.role || "Learner",
        avatar: getAvatarUrl(user?.avatar),
    };

    return (
        <div className="d-flex min-vh-100 bg-light">
            <aside className="d-flex flex-column bg-white border-end" style={{ width: '280px', position: 'sticky', top: 0, height: '100vh', zIndex: 20 }}>
                <div className="p-4 mb-3">
                    <h5 className="fw-bold fs-xl text-dark-primary mb-0">Academic Atelier</h5>
                </div>

                <div className="px-4 mb-4 d-flex align-items-center gap-3">
                    <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="rounded-circle"
                        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                    />
                    <div>
                        <div className="fw-bold text-dark-primary fs-md">{profile.name}</div>
                        <div className="text-dark-secondary fs-sm">{profile.role}</div>
                    </div>
                </div>

                <nav className="d-flex flex-column px-3 gap-1 flex-grow-1">
                    {user?.role === 'student' && (
                        <Link
                            to="/courses"
                            className={`d-flex align-items-center gap-3 px-3 py-3 rounded text-decoration-none fw-medium fs-md ${location.pathname === '/courses' ? 'sidebar-active' : 'text-dark-secondary hover-bg'}`}
                        >
                            <i className={`bi bi-book${location.pathname === '/courses' ? '-fill' : ''} fs-5`}></i>
                            All Courses
                        </Link>
                    )}

                    {user?.role === 'instructor' && (
                        <Link
                            to="/instructorcourses"
                            className={`d-flex align-items-center gap-3 px-3 py-3 rounded text-decoration-none fw-medium fs-md ${location.pathname === '/instructorcourses' ? 'sidebar-active' : 'text-dark-secondary hover-bg'}`}
                        >
                            <i className={`bi bi-book${location.pathname === '/instructorcourses' ? '-fill' : ''} fs-5`}></i>
                            My Courses
                        </Link>
                    )}

                {user?.role === 'student' && (
                    <Link
                        to="/my-courses"
                        className={`d-flex align-items-center gap-3 px-3 py-3 rounded text-decoration-none fw-medium fs-md ${location.pathname === '/my-courses' ? 'sidebar-active' : 'text-dark-secondary hover-bg'}`}
                    >
                        <i className={`bi bi-mortarboard${location.pathname === '/my-courses' ? '-fill' : ''} fs-5`}></i>
                        My Courses
                    </Link>
                )}

                    <Link
                        to="/settings"
                        className={`d-flex align-items-center gap-3 px-3 py-3 rounded text-decoration-none fw-medium fs-md ${location.pathname.includes('/settings') ? 'sidebar-active' : 'text-dark-secondary hover-bg'}`}
                    >
                        <i className={`bi bi-gear${location.pathname.includes('/settings') ? '-fill' : ''} fs-5`}></i>
                        Settings
                    </Link>
                </nav>

                <div className="p-4 mt-auto">
                    <button className="btn w-100 fw-medium d-flex align-items-center justify-content-center dash-btn-primary fs-md">
                        Upgrade Plan
                    </button>
                    <Link to="/help" className="d-flex align-items-center gap-2 mt-4 text-decoration-none text-dark-secondary fs-sm">
                        <i className="bi bi-question-circle-fill fs-5" style={{ color: '#9ca3af' }}></i>
                        Help Center
                    </Link>
                </div>
            </aside>

            <main className="d-flex flex-column flex-grow-1 position-relative bg-white" style={{ width: 'calc(100% - 280px)' }}>
                {customHeader}
                <div className="flex-grow-1 overflow-auto bg-dashboard-content">
                    <div className="p-4 p-lg-5 w-100">
                        {children}
                    </div>
                </div>
            </main>

        </div>
    );
};

export default DashboardLayout;
