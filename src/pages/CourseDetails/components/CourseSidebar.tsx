import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { PlayCircle, FileText, Clock, CheckCircle } from 'lucide-react';

interface CourseSidebarProps {
    course: any;
    isEnrolled: boolean;
    enrollmentLoading: boolean;
    onEnroll: () => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course, isEnrolled, enrollmentLoading, onEnroll }) => {
    return (
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
                            onClick={onEnroll}
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
    );
};

export default React.memo(CourseSidebar);
