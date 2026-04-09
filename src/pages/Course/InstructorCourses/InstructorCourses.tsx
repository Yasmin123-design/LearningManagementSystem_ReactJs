import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../features/courses/coursesSlice';
import type { AppDispatch, RootState } from '../../../app/store';
import DashboardLayout from '../../../layouts/Dashboard/DashboardLayout';
import { Button, Row, Col, ProgressBar, Badge } from 'react-bootstrap';
import './InstructorCourses.css';

const InstructorCourses: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { courses, loading } = useSelector((state: RootState) => state.courses);

    useEffect(() => {
        dispatch(fetchInstructorCourses());
    }, [dispatch]);

    const stats = [
        { label: 'Live Students', value: '2,840', growth: '+12%', type: 'primary' },
        { label: 'Avg Rating', value: '4.9', sub: '★', type: 'secondary' },
        { label: 'Active Modules', value: '32', type: 'info' },
        { label: 'Storage Used', value: '84%', type: 'warning' }
    ];

    if (loading && courses.length === 0) {
        return (
            <DashboardLayout>
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const mainCourse = courses[0];

    return (
        <DashboardLayout>
            <div className="instructor-dashboard container-fluid px-0">
                {/* Header Section */}
                <header className="instructor-header d-flex justify-content-between align-items-start mb-5">
                    <div>
                        <div className="text-primary fw-bold small text-uppercase mb-1 ls-1" style={{ fontSize: '0.7rem' }}>Instructor Dashboard</div>
                        <h1 className="fw-bold mb-2">My Courses</h1>
                        <p className="mb-0">Curate your curriculum and manage your student's learning journey with precision and clarity.</p>
                    </div>
                    <Button className="btn-create-course d-flex align-items-center gap-2 w-auto">
                        <i className="bi bi-plus-lg"></i>
                        Create New Course
                    </Button>
                </header>

                <Row className="g-4 mb-5">
                    {/* Course Management Cards */}
                    <Col lg={8}>
                        {courses.map((course) => (
                            <div key={course.id} className="course-card-main p-4 mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="course-icon-box">
                                        <i className="bi bi-brush"></i>
                                    </div>
                                    <div className="course-actions-toolbar d-flex gap-2">
                                        <button className="btn-icon"><i className="bi bi-pencil"></i></button>
                                        <button className="btn-icon"><i className="bi bi-bar-chart"></i></button>
                                        <button className="btn-icon btn-delete"><i className="bi bi-trash"></i></button>
                                    </div>
                                </div>

                                <h3 className="fw-bold mb-3">{course.title}</h3>
                                <div className="text-secondary small d-flex gap-3 mb-4">
                                    <span>{course.description || "No description available"}</span>
                                </div>
                                <div className="text-secondary small d-flex gap-3 mb-4">
                                    <span>8 Modules</span>
                                    <span>•</span>
                                    <span>24 Lessons</span>
                                    <span>•</span>
                                    <span>{course.reviewsCount || 0} Students</span>
                                    <span>•</span>
                                    <span className="text-primary fw-bold">${course.price}</span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center pt-4 border-top">
                                    <div className="instructor-avatars">
                                        <div className="avatar-stack">
                                            <img src="https://i.pravatar.cc/150?u=1" alt="Student" />
                                            <img src="https://i.pravatar.cc/150?u=2" alt="Student" />
                                        </div>
                                    </div>
                                    <a href="#" className="link-manage-structure">
                                        Manage Structure <i className="bi bi-arrow-right"></i>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </Col>

                    {/* Small Status Card / Draft Section */}
                    <Col lg={4}>
                        <div className="draft-card p-4 h-100">
                            <Badge className="badge-draft mb-3">Draft</Badge>
                            <h5 className="fw-bold mb-2">Mastering Motion Principles in Figma</h5>
                            <div className="text-secondary small mb-4">3 Modules • 12 Lessons</div>
                            
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="small text-secondary">Course completion status: 40%</span>
                                </div>
                                <ProgressBar now={40} className="progress-custom" />
                            </div>

                            <div className="d-flex gap-2">
                                <Button className="btn-resume flex-grow-1">Resume</Button>
                                <Button className="btn-delete-small"><i className="bi bi-trash"></i></Button>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Course Architecture Section (Mocked for now) */}
                <section className="architecture-section mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary text-white rounded p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <i className="bi bi-layers"></i>
                            </div>
                            <div>
                                <h2 className="h4 fw-bold mb-0">Course Architecture</h2>
                                <div className="text-secondary small">{mainCourse?.title}</div>
                            </div>
                        </div>
                        <Button variant="link" className="text-primary text-decoration-none fw-bold p-0">
                            <i className="bi bi-plus-circle me-2"></i> Add Module
                        </Button>
                    </div>

                    <div className="module-card">
                        <div className="module-header d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-4">
                                <span className="module-number">01</span>
                                <div>
                                    <h4 className="fw-bold mb-1">Introduction to User Psychology</h4>
                                    <div className="text-secondary small">Duration: 45m • 3 Lessons</div>
                                </div>
                            </div>
                            <div className="d-flex gap-3 text-secondary">
                                <i className="bi bi-list"></i>
                                <i className="bi bi-trash"></i>
                                <i className="bi bi-grip-vertical"></i>
                            </div>
                        </div>
                        <div className="px-4 pb-4">
                            <div className="lesson-item">
                                <i className="bi bi-play-circle-fill text-primary"></i>
                                <div className="flex-grow-1 fw-medium">1.1 What is Cognitive Load?</div>
                            </div>
                            <div className="lesson-item">
                                <i className="bi bi-file-earmark-text-fill text-primary"></i>
                                <div className="flex-grow-1 fw-medium">1.2 Case Study: Mental Models</div>
                            </div>
                            <button className="add-btn-dashed">
                                <i className="bi bi-plus-lg me-2"></i> Add Lesson
                            </button>
                        </div>
                    </div>

                    <div className="module-card">
                         <div className="module-header d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-4">
                                <span className="module-number">02</span>
                                <div>
                                    <h4 className="fw-bold mb-1">Heuristic Evaluation Framework</h4>
                                    <div className="text-secondary small">Duration: 1h 20m • 5 Lessons</div>
                                </div>
                            </div>
                            <div className="d-flex gap-3 text-secondary">
                                <i className="bi bi-list"></i>
                                <i className="bi bi-trash"></i>
                                <i className="bi bi-grip-vertical"></i>
                            </div>
                        </div>
                        <div className="px-4 pb-4 text-center">
                            <button className="add-btn-dashed">
                                <i className="bi bi-plus-lg me-2"></i> Add First Lesson
                            </button>
                        </div>
                    </div>
                </section>

                {/* Bottom Stats Grid */}
                <Row className="g-4">
                    {stats.map((stat, idx) => (
                        <Col key={idx} md={idx === 0 ? 3 : 2} lg={idx === 0 ? 3 : idx === 3 ? 4 : 2} className={idx === 1 ? 'ms-auto' : ''}>
                            <div className="stat-card">
                                <div className="stat-label mb-2">{stat.label}</div>
                                <div className="d-flex align-items-baseline gap-2">
                                    <div className="stat-value">{stat.value}</div>
                                    {stat.growth && <span className="stat-growth">{stat.growth}</span>}
                                    {stat.sub && <span className="text-warning fs-4">{stat.sub}</span>}
                                </div>
                                {idx === 0 && <ProgressBar now={60} className="mt-3" style={{ height: '4px', opacity: 0.3 }} />}
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
        </DashboardLayout>
    );
};

export default InstructorCourses;
