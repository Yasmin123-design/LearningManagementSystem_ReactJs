import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructorCourses, publishCourse } from '../../../features/courses/coursesSlice';
import type { AppDispatch, RootState } from '../../../app/store';
import DashboardLayout from '../../../layouts/Dashboard/DashboardLayout';
import { Button, Row, Col, ProgressBar} from 'react-bootstrap';
import './InstructorCourses.css';
import EditCourseModal from '../EditCourseModal';
import DeleteConfirmModal from '../DeleteConfirmModal';
import type { Course } from '../../../features/courses/coursesSlice';
import CreateCourseModal from '../CreateCourseModal';

const InstructorCourses: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { courses, loading } = useSelector((state: RootState) => state.courses);

    const [showEditModal, setShowEditModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [showCreateModal, setShowCreateModal] = React.useState(false);
    const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);

    useEffect(() => {
        dispatch(fetchInstructorCourses());
    }, [dispatch]);

    const handleEditClick = (course: Course) => {
        setSelectedCourse(course);
        setShowEditModal(true);
    };

    const handleDeleteClick = (course: Course) => {
        setSelectedCourse(course);
        setShowDeleteModal(true);
    };

    const handlePublishClick = (course: Course) => {
        dispatch(publishCourse(course.id));
    };

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

    return (
        <DashboardLayout>
            <div className="instructor-dashboard container-fluid px-0">
                <header className="instructor-header d-flex justify-content-between align-items-start mb-5">
                    <div>
                        <div className="text-primary fw-bold small text-uppercase mb-1 ls-1" style={{ fontSize: '0.7rem' }}>Instructor Dashboard</div>
                        <h1 className="fw-bold mb-2">My Courses</h1>
                        <p className="mb-0">Curate your curriculum and manage your student's learning journey with precision and clarity.</p>
                    </div>
                     <Button 
                        className="btn-create-course d-flex align-items-center gap-2 w-auto"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <i className="bi bi-plus-lg"></i>
                        Create New Course
                    </Button>
                </header>

                <Row className="g-4 mb-5">
                    <Col lg={8}>
                        {courses.map((course) => (
                            <div key={course.id} className="course-card-main p-4 mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                    
                                    <div className="course-actions-toolbar d-flex gap-2 align-items-center">
                                        {!course.isPublished && (
                                            <Button 
                                                variant="success" 
                                                size="sm" 
                                                className="fw-bold me-2 px-3 rounded-pill" 
                                                onClick={() => handlePublishClick(course)}
                                            >
                                                Publish
                                            </Button>
                                        )}
                                        <button className="btn-icon" onClick={() => handleEditClick(course)}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn-icon btn-delete" onClick={() => handleDeleteClick(course)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
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
                                    <Link to={`/instructorcourses/${course.id}/manage`} className="link-manage-structure text-decoration-none">
                                        Manage Structure <i className="bi bi-arrow-right"></i>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </Col>

                </Row>

                

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

            <EditCourseModal 
                show={showEditModal} 
                onHide={() => setShowEditModal(false)} 
                course={selectedCourse} 
            />
            
            <DeleteConfirmModal 
                show={showDeleteModal} 
                onHide={() => setShowDeleteModal(false)} 
                courseId={selectedCourse?.id || null} 
                courseTitle={selectedCourse?.title || null} 
            />

            <CreateCourseModal 
                show={showCreateModal} 
                onHide={() => setShowCreateModal(false)} 
            />
        </DashboardLayout>
    );
};

export default InstructorCourses;
