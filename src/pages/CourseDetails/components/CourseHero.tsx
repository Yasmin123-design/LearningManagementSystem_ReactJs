import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';

interface CourseHeroProps {
    course: any;
    avatarUrl: string;
}

const CourseHero: React.FC<CourseHeroProps> = ({ course, avatarUrl }) => {
    return (
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
                </div>
            </div>
        </div>
    );
};

export default React.memo(CourseHero);
