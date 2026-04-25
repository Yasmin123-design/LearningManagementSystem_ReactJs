import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';

interface CourseProgressCardProps {
    enrollment: any;
    isFeatured: boolean;
    onViewModules: (id: string) => void;
}

const CourseProgressCard: React.FC<CourseProgressCardProps> = ({ enrollment, isFeatured, onViewModules }) => {
    const { course } = enrollment;

    return (
        <Col lg={isFeatured ? 8 : 4} className="d-flex mb-4">
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
                                            onClick={() => onViewModules(course.id)}
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
                                                onClick={() => onViewModules(course.id)}
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
};

export default React.memo(CourseProgressCard);
