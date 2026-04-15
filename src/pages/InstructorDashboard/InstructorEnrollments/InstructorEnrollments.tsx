import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructorEnrollments } from '../../../features/enrollments/enrollmentsSlice';
import type { AppDispatch, RootState } from '../../../app/store';
import DashboardLayout from '../../../layouts/Dashboard/DashboardLayout';
import { getAvatarUrl } from '../../../utils/getAvatarUrl';
import './InstructorEnrollments.css';

const InstructorEnrollments: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { instructorEnrollments, loading } = useSelector((state: RootState) => state.enrollments);

    useEffect(() => {
        dispatch(fetchInstructorEnrollments());
    }, [dispatch]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <DashboardLayout>
            <div className="instructor-enrollments container-fluid px-0">
                <header className="enrollments-header mb-5">
                    <div className="badge-curator mb-2">CURATOR DASHBOARD</div>
                    <h1 className="fw-bold mb-2 display-5">Student Enrollments</h1>
                    <p className="text-secondary lead mb-0">
                        Comprehensive overview of current course subscriptions and pedagogical engagement metrics.
                    </p>
                </header>

                <div className="active-records-bar d-flex justify-content-between align-items-center mb-4 p-3 rounded-3">
                    <div className="d-flex align-items-center gap-2">
                        <div className="vertical-line"></div>
                        <span className="fw-bold text-uppercase fs-sm ls-1">Active Records</span>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-filter px-4 py-2 fw-bold">Filter</button>
                        <button className="btn btn-export px-4 py-2 fw-bold d-flex align-items-center gap-2">
                            Export PDF
                        </button>
                    </div>
                </div>

                <div className="enrollments-list">
                    {loading && instructorEnrollments.length === 0 ? (
                        <div className="d-flex justify-content-center p-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : instructorEnrollments.length === 0 ? (
                        <div className="text-center p-5 bg-light rounded-4">
                            <i className="bi bi-people fs-1 text-secondary mb-3 d-block"></i>
                            <h4 className="text-secondary">No enrollments found</h4>
                            <p className="mb-0">When students enroll in your courses, they will appear here.</p>
                        </div>
                    ) : (
                        instructorEnrollments.map((enrollment) => (
                            <div key={enrollment.id} className="enrollment-card bg-white p-4 mb-4 rounded-4 shadow-sm">
                                <div className="row align-items-center g-4">
                                    <div className="col-lg-4 d-flex align-items-center gap-3">
                                        <div className="student-avatar-wrapper position-relative">
                                            <img
                                                src={getAvatarUrl(enrollment.student?.avatar)}
                                                alt={enrollment.student?.name}
                                                className="student-avatar-img"
                                            />
                                            <div className="status-indicator"></div>
                                        </div>
                                        <div className="student-info">
                                            <h5 className="fw-bold mb-0">{enrollment.student?.name}</h5>
                                            <p className="text-secondary small mb-0">{enrollment.student?.email}</p>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 course-focus-column">
                                        <div className="course-focus-label small text-uppercase fw-bold text-orange mb-1">Course Focus</div>
                                        <h5 className="fw-bold mb-1">{enrollment.course.title}</h5>
                                        <p className="text-secondary small mb-0 text-truncate-2">
                                            {enrollment.course.description || "Learning the fundamentals and advanced techniques of the curriculum."}
                                        </p>
                                    </div>

                                    <div className="col-lg-2 text-end">
                                        <h4 className="fw-bold mb-2">
                                            {enrollment.course.isPremium ? `$${enrollment.course.price}` : <span className="text-success">FREE</span>}
                                        </h4>
                                        {enrollment.isPaid ? (
                                            <div className="badge-paid d-inline-flex align-items-center gap-2">
                                                <i className="bi bi-check-circle-fill"></i>
                                                PAID
                                            </div>
                                        ) : (
                                            <div className="badge-unpaid">UNPAID</div>
                                        )}
                                    </div>

                                    {/* Date */}
                                    <div className="col-lg-2 text-end">
                                        <div className="date-label small text-uppercase fw-bold text-secondary mb-1">Enrolled On</div>
                                        <div className="fw-bold">{formatDate(enrollment.enrolledAt)}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-5 p-3 bg-light rounded-3">
                    <div className="text-secondary small">
                        Showing {instructorEnrollments.length} of {instructorEnrollments.length} total enrollments
                    </div>
                    <div className="d-flex gap-4">
                        <button className="btn p-0 text-dark fw-bold text-decoration-none">Previous</button>
                        <button className="btn p-0 text-dark fw-bold text-decoration-none">Next</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InstructorEnrollments;
