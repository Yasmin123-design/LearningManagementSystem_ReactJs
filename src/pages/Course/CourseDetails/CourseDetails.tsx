import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseDetails } from '../../../features/courses/coursesSlice';
import { fetchMyEnrollments, enrollInCourse, getPaymentUrl } from '../../../features/enrollments/enrollmentsSlice';
import type { AppDispatch, RootState } from '../../../app/store';
import { Accordion, Button, Badge, Modal } from 'react-bootstrap';
import { Clock, PlayCircle, FileText, Lock, CheckCircle, Check } from 'lucide-react';
import './CourseDetails.css';
import { getAvatarUrl } from '../../../utils/getAvatarUrl';

const CourseDetails: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const dispatch = useDispatch<AppDispatch>();

    const { currentCourse, courseContent, loading } = useSelector((state: RootState) => state.courses);
    const { enrollments, loading: enrollmentLoading } = useSelector((state: RootState) => state.enrollments);
    const { token, user } = useSelector((state: RootState) => state.auth);
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [showPaymentSuccessModal, setShowPaymentSuccessModal] = React.useState(false);

    const avatarUrl = getAvatarUrl(currentCourse?.instructor?.avatar);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseDetails(courseId));
            if (token) {
                dispatch(fetchMyEnrollments());
            }

            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('success') === 'true') {
                setShowPaymentSuccessModal(true);
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
            }
        }
    }, [dispatch, courseId, token]);

    const isEnrolled = enrollments.some(
        e => (e.courseId === courseId && (user ? e.userId === user.id : true)) && e.isPaid
    );


const handleEnroll = async () => {
    if (!token) {
        window.location.href = "/login";
        return;
    }

    if (!courseId || !currentCourse) return;

    if (currentCourse.isPremium) {
        try {
            await dispatch(enrollInCourse(courseId));
            console.log()
            const successUrl = `${window.location.origin}/courses/${courseId}?success=true`;
            
            const paymentAction = await dispatch(getPaymentUrl({ courseId, successUrl }));

            if (getPaymentUrl.fulfilled.match(paymentAction)) {
                const url = paymentAction.payload;
                window.location.href = url;
            } else {
                alert(paymentAction.payload || "Failed to initiate payment");
            }
        } catch (err) {
            console.error("Payment error:", err);
        }
    } else {
        try {
            const enrollAction = await dispatch(enrollInCourse(courseId));
            if (enrollInCourse.fulfilled.match(enrollAction)) {
                setShowSuccessModal(true);
            } else {
                alert(enrollAction.payload || "Enrollment failed");
            }
        } catch (err) {
            console.error("Enrollment error:", err);
        }
    }
};



    const course = currentCourse || {
        title: 'Loading Course...',
        description: 'Please wait while we fetch the course details.',
        price: '...',
        averageRating: '0.0',
        category: { name: 'TOPIC' },
        instructor: { email: '', name: 'Instructor' },
        isPremium: false
    };

    if (loading && !currentCourse) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="course-details-page">
            <div className="course-hero bg-white border-bottom pb-5">
                <div className="container pt-4">
                    <nav aria-label="breadcrumb" className="mb-4">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/courses">Courses</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{course.category?.name}</li>
                        </ol>
                    </nav>

                    <div className="row">
                        <div className="col-lg-8">
                            <Badge bg="primary" className="mb-3 px-3 py-2 text-uppercase letter-spacing-1">
                                {course.category?.name || 'ADVANCED LEVEL'}
                            </Badge>
                            <h1 className="display-4 fw-bold text-dark mb-4">
                                {course.title}
                            </h1>
                            <p className="lead text-secondary mb-5" style={{ lineHeight: 1.6 }}>
                                {course.description}
                            </p>

                            <div className="instructor-card-premium d-flex align-items-center p-4 rounded-4 bg-light border">
                                <img
                                    src={avatarUrl}
                                    alt="Instructor"
                                    className="rounded-circle me-4"
                                    style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                                />
                                <div>
                                    <span className="text-uppercase fs-xxs fw-bold text-muted mb-1 d-block letter-spacing-1">Lead Instructor</span>
                                    <h5 className="mb-1 fw-bold">{course.instructor?.email?.split('@')[0] || 'Dr. Julian Sterling'}</h5>
                                    <span className="text-secondary fs-sm">Expert in {course.category?.name || 'Software Engineering'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 mt-5 mt-lg-0">
                            <div className="course-sidebar sticky-top shadow-lg p-4 rounded-4 bg-white border" style={{ top: '2rem' }}>
                                <div className="d-flex align-items-center mb-3">
                                    <Badge bg="danger" className="me-2"><PlayCircle size={12} className="me-1" /> Bestseller</Badge>
                                </div>
                                <div className="price-display d-flex align-items-end mb-4">
                                    <h2 className="display-5 fw-bold mb-0">${course.price}</h2>
                                    <span className="text-muted text-decoration-line-through ms-2 fs-4" style={{ opacity: 0.6 }}>$399.00</span>
                                </div>

                                <div className="d-grid gap-3">
                                    {isEnrolled ? (
                                        <Button variant="success" className="py-3 fw-bold rounded-3 shadow-sm">
                                            <CheckCircle className="me-2" /> You are Entered
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            className="py-3 fw-bold rounded-3 shadow-sm btn-premium"
                                            onClick={handleEnroll}
                                            disabled={enrollmentLoading}
                                        >
                                            {enrollmentLoading ? (
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            ) : null}
                                            Enroll Now
                                        </Button>
                                    )}
                                    <Button variant="outline-dark" className="py-3 fw-semibold rounded-3">
                                        Add to Wishlist
                                    </Button>
                                </div>

                                <div className="sidebar-features mt-5">
                                    <h6 className="fw-bold mb-4">WHAT'S INCLUDED</h6>
                                    <ul className="list-unstyled d-flex flex-column gap-3">
                                        <li className="d-flex align-items-center gap-3 fs-sm text-secondary">
                                            <PlayCircle size={18} className="text-primary" />
                                            <span>45 hours on-demand video</span>
                                        </li>
                                        <li className="d-flex align-items-center gap-3 fs-sm text-secondary">
                                            <FileText size={18} className="text-primary" />
                                            <span>Professional Certificate</span>
                                        </li>
                                        <li className="d-flex align-items-center gap-3 fs-sm text-secondary">
                                            <Clock size={18} className="text-primary" />
                                            <span>Lifetime access</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h2 className="fw-bold mb-0">Curriculum</h2>
                            <span className="text-muted fs-sm fw-medium">
                                {courseContent.length} Modules • {courseContent.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0)} Lessons
                            </span>
                        </div>

                        <Accordion defaultActiveKey="0" className="curriculum-accordion custom-accordion">
                            {courseContent.map((module: any, index: number) => (
                                <Accordion.Item eventKey={index.toString()} key={module.id} className="mb-3 border rounded-3 overflow-hidden shadow-sm">
                                    <Accordion.Header>
                                        <div className="w-100 pe-3">
                                            <span className="text-primary fs-xxs fw-bold text-uppercase mb-1 d-block letter-spacing-1">Module {module.order}</span>
                                            <h5 className="mb-1 fw-bold text-dark">{module.title}</h5>
                                            <p className="mb-0 text-secondary fs-sm fw-normal">{module.description}</p>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body className="p-0">
                                        <div className="lesson-list">
                                            {module.lessons?.map((lesson: any) => (
                                                <div key={lesson.id} className="lesson-item d-flex align-items-center justify-content-between p-4 border-bottom hover-bg-light transition-all">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="lesson-icon bg-light rounded-circle p-2 d-flex align-items-center justify-content-center text-primary">
                                                            <PlayCircle size={20} />
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-1 fw-semibold text-dark">Lesson {module.order}.{lesson.order}: {lesson.title}</h6>
                                                            <span className="text-muted fs-xs">Video content • {lesson.duration || '15:00'}</span>
                                                        </div>
                                                    </div>
                                                    {!isEnrolled && index > 0 ? <Lock size={16} className="text-muted" /> : <PlayCircle size={16} className="text-primary" />}
                                                </div>
                                            ))}
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <Modal
                show={showSuccessModal}
                onHide={() => setShowSuccessModal(false)}
                centered
                contentClassName="border-0 rounded-4 shadow-lg overflow-hidden"
            >
                <div className="text-center p-5">
                    <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex p-4 mb-4" style={{ width: '80px', height: '80px', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={40} className="fw-bold" />
                    </div>
                    <h2 className="fw-bold text-dark mb-3">Congratulations!</h2>
                    <p className="text-secondary mb-4 fs-lg">
                        You have successfully enrolled in <br />
                        <span className="text-dark fw-bold">"{course.title}"</span>
                    </p>
                    <div className="d-grid gap-3">
                        <Button
                            variant="primary"
                            className="py-3 fw-bold rounded-3 btn-premium"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            Start Learning Now
                        </Button>
                        <Button
                            variant="light"
                            className="py-3 fw-semibold text-secondary rounded-3 border-0"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            Maybe Later
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Payment Success Modal */}
            <Modal
                show={showPaymentSuccessModal}
                onHide={() => setShowPaymentSuccessModal(false)}
                centered
                contentClassName="border-0 rounded-4 shadow-lg overflow-hidden"
            >
                <div className="text-center p-5">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-4 mb-4" style={{ width: '80px', height: '80px', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={40} className="fw-bold" />
                    </div>
                    <h2 className="fw-bold text-dark mb-3">Payment Done Successfully!</h2>
                    <p className="text-secondary mb-4 fs-lg">
                        Your transaction was processed securely. <br />
                        Welcome to <span className="text-dark fw-bold">"{course.title}"</span>
                    </p>
                    <div className="d-grid gap-3">
                        <Button
                            variant="primary"
                            className="py-3 fw-bold rounded-3 btn-premium"
                            onClick={() => setShowPaymentSuccessModal(false)}
                        >
                            Start Learning Now
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CourseDetails;
