import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyEnrollments } from '../../../features/enrollments/enrollmentsSlice';
import type { AppDispatch, RootState } from '../../../app/store';
import DashboardLayout from '../../../layouts/Dashboard/DashboardLayout';
import { Button, Card, Row, Col, Badge, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './MyCourses.css';

const MyCourses: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { enrollments, loading, error } = useSelector((state: RootState) => state.enrollments);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchMyEnrollments());
    }, [dispatch]);

    const filteredEnrollments = enrollments.filter(enrollment => 
        enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (enrollment.course.description && enrollment.course.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    if (error) {
        return (
            <DashboardLayout>
                <div className="alert alert-danger m-4">
                    Error loading enrollments: {error}
                </div>
            </DashboardLayout>
        );
    }

    if (loading && enrollments.length === 0) {
        return (
            <DashboardLayout>
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="spinner-border text-brand" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="my-courses-content container-fluid px-4 pb-5">
                {/* Search and Title Row */}
                <div className="d-flex justify-content-between align-items-end mb-5 mt-2">
                    <div>
                        <h2 className="fw-bold text-dark-primary mb-1">My Courses</h2>
                        <p className="text-secondary small mb-0">Continue your learning journey</p>
                    </div>
                    <div className="search-wrapper">
                        <InputGroup className="shadow-sm rounded-pill overflow-hidden bg-white" style={{ width: '350px' }}>
                            <InputGroup.Text className="bg-white border-0 ps-3">
                                <i className="bi bi-search text-muted"></i>
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Search your courses..."
                                className="border-0 py-2 shadow-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </div>
                </div>



                <Row className="g-4">
                    {filteredEnrollments.length > 0 ? (
                        filteredEnrollments.map((enrollment, index) => {
                            const { course } = enrollment;
                            const isFeatured = index === 0;

                            return (
                                <Col lg={isFeatured ? 8 : 4} key={enrollment.id} className="d-flex">
                                    <Card className={`course-card-premium w-100 border-0 shadow-sm ${isFeatured ? 'featured' : ''}`}>
                                        <Row className="g-0 h-100">
                                            <Col md={isFeatured ? 6 : 12} className="position-relative">
                                                <div className="card-img-wrapper h-100">
                                                    <Card.Img
                                                        src={course.thumbnail || `https://source.unsplash.com/featured/?education,learning&${course.id}`}
                                                        className="h-100 w-100 object-fit-cover"
                                                        onError={(e: any) => { e.target.src = `https://picsum.photos/seed/${course.id}/800/600` }}
                                                    />
                                                    {isFeatured && <Badge className="featured-tag">FEATURED</Badge>}
                                                </div>
                                            </Col>
                                            <Col md={isFeatured ? 6 : 12} className="d-flex flex-column">
                                                <Card.Body className="d-flex flex-column flex-grow-1 p-4">
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <span className="text-brand text-uppercase fw-bold small ls-1">{course.category?.name || 'PHILOSOPHY'}</span>
                                                        <span className="text-dark-primary fw-bold small"><i className="bi bi-star-fill text-warning me-1"></i> {course.averageRating || '4.9'}</span>
                                                    </div>

                                                    <Card.Title className="fw-bold mb-2 h3 text-dark-primary">{course.title}</Card.Title>
                                                    <p className="text-brand fw-bold mb-3 small">{course.title} (Arabic Title)</p>

                                                    {isFeatured ? (
                                                        <>
                                                            <Card.Text className="text-dark-secondary mb-4 small line-clamp-3">
                                                                {course.description || "Explore the intersection of 20th-century thought with the complexities of our digital.."}
                                                            </Card.Text>
                                                            <div className="mt-auto">
                                                                <div className="d-flex align-items-center justify-content-between mb-4">
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <div className="instructor-avatar-xs">
                                                                            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Instructor" />
                                                                        </div>
                                                                        <span className="text-dark-primary small fw-medium">Dr. Elena Thorne</span>
                                                                    </div>
                                                                    <span className="h4 fw-bold mb-0">${course.price}</span>
                                                                </div>
                                                                <Button
                                                                    className="btn-brand w-100 py-2 fw-bold"
                                                                    onClick={() => navigate(`/courses/${course.id}/content`)}
                                                                >
                                                                    View Modules
                                                                </Button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="mt-auto">
                                                            <div className="d-flex align-items-center gap-2 mb-4">
                                                                <i className="bi bi-person text-dark"></i>
                                                                <span className="text-dark-secondary small">Julian Velez</span>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                                                                <span className="h5 fw-bold mb-0">${course.price}</span>
                                                                <div className="button-group">
                                                                    <Button
                                                                        variant="outline-primary"
                                                                        className="btn-brand-outline px-4 py-1 small fw-bold"
                                                                        onClick={() => navigate(`/courses/${course.id}/content`)}
                                                                    >
                                                                        View Modules
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Card.Body>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            );
                        })
                    ) : (
                        <div className="text-center py-5 w-100">
                            <div className="mb-4">
                                <i className="bi bi-search text-muted display-1"></i>
                            </div>
                            <h3 className="fw-bold text-dark-primary">No results found</h3>
                            <p className="text-secondary">We couldn't find any courses matching your search "{searchTerm}".</p>
                            <Button 
                                variant="outline-primary" 
                                className="btn-brand-outline mt-3"
                                onClick={() => setSearchTerm('')}
                            >
                                Clear Search
                            </Button>
                        </div>
                    )}

                </Row>

                <div className="d-flex justify-content-center mt-5">
                    <nav>
                        <ul className="pagination gap-2">
                             <li className="page-item"><a className="page-link rounded bg-light text-dark border-0" href="#"><i className="bi bi-chevron-left"></i></a></li>
                             <li className="page-item active"><a className="page-link rounded bg-brand text-white border-0" href="#">1</a></li>
                             <li className="page-item"><a className="page-link rounded bg-light text-dark border-0" href="#">2</a></li>
                             <li className="page-item"><a className="page-link rounded bg-light text-dark border-0" href="#">3</a></li>
                             <li className="page-item"><a className="page-link rounded bg-light text-dark border-0" href="#"><i className="bi bi-chevron-right"></i></a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MyCourses;
