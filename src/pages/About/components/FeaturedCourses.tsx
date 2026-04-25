import React from 'react';
import { Link } from 'react-router-dom';

interface FeaturedCoursesProps {
    courses: any[];
}

const FeaturedCourses: React.FC<FeaturedCoursesProps> = ({ courses }) => {
    return (
        <section className="about-section bg-soft">
            <div className="container-custom">
                <div className="featured-header">
                    <div>
                        <h2 className="text-dark">Featured Courses</h2>
                        <p className="text-muted">Curated modules designed by industry professionals.</p>
                    </div>
                    <Link to="/courses" className="text-primary fw-bold text-decoration-none d-flex align-items-center gap-2">
                        Explore All <i className="bi bi-arrow-right"></i>
                    </Link>
                </div>

                <div className="courses-row">
                    {courses.map((course, i) => (
                        <div key={course.id || i} className="course-p-card">
                            <div className="card-img-wrapper">
                                <img src={course.thumbnail || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'} alt={course.title} />
                                <span className="card-p-tag">{course.category?.name || 'COURSE'}</span>
                            </div>
                            <div className="card-p-body">
                                <h3 className="card-p-title">{course.title}</h3>
                                <p className="card-p-text">{course.description ? course.description.substring(0, 100) + '...' : 'Dive deep into the curriculum with our expert-led modules...'}</p>
                                <div className="progress-p-box">
                                    <div className="progress-p-label">
                                        <span>Progress</span>
                                        <span>{course.progress || 0}%</span>
                                    </div>
                                    <div className="progress-p-bar">
                                        <div className="progress-p-fill" style={{ width: `${course.progress || 0}%` }}></div>
                                    </div>
                                </div>
                                <Link to={`/courses/${course.id}`} className="btn-enroll-p text-center text-decoration-none d-block">View Details</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default React.memo(FeaturedCourses);
