import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import type { Enrollment } from '../../features/enrollments/enrollmentsSlice';
import type { Course } from '../../features/courses/coursesSlice';
import { Button } from 'react-bootstrap';
import './CourseCard.css';
import { getAvatarUrl } from '../../utils/getAvatarUrl';

interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const instructorName = course.instructor?.email?.split('@')[0] || course.instructorId || 'Instructor';

    const { user } = useSelector((state: RootState) => state.auth);
    const { enrollments } = useSelector((state: RootState) => state.enrollments);

    const avatarUrl = getAvatarUrl(course.instructor?.avatar);
    const courseImage = `https://picsum.photos/seed/${course.id}/400/200`;
    const categoryName = course.category?.name || 'GENERAL';


    const progressPercent = course.progress || 0;
    const reviewsCount = course.reviewsCount || 0;

    const isEnrolled = (enrollments || []).some(
        (e: Enrollment) =>  (e.courseId === course.id && (user ? e.userId === user.id : true)) && e.isPaid
    );

    return (
        <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden', backgroundColor: '#ffffff' }}>
            <div className="position-relative" style={{ height: '180px', backgroundColor: '#e2e8f0' }}>
                <img
                    src={courseImage}
                    alt={course.title}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                />
                <span
                    className="position-absolute badge fs-xxs"
                    style={{
                        top: '1rem',
                        left: '1rem',
                        backgroundColor: categoryName === 'DESIGN' ? '#1d4ed8' : (categoryName === 'NEW' ? '#dc2626' : '#6b21a8'),
                        padding: '0.4rem 0.8rem',
                        letterSpacing: '0.05em',
                        borderRadius: '0.25rem',
                        textTransform: 'uppercase'
                    }}
                >
                    {categoryName}
                </span>

                {course.isPremium && (
                    <span
                        className="position-absolute badge fs-xxs"
                        style={{
                            top: '1rem',
                            right: '1rem',
                            backgroundColor: '#fbbf24',
                            color: '#000',
                            padding: '0.4rem 0.8rem',
                            letterSpacing: '0.05em',
                            borderRadius: '0.5rem',
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <i className="bi bi-star-fill me-1"></i> Premium
                    </span>
                )}
            </div>

            <div className="card-body d-flex flex-column p-4">
                <h5 className="card-title text-dark-primary fs-xl mb-3" style={{ fontWeight: 700, lineHeight: 1.4 }}>
                    {course.title}
                </h5>

                <div className="d-flex align-items-center mb-3">
                    <img src={avatarUrl} alt={instructorName} className="rounded-circle me-2" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                    <span className="text-dark-secondary fs-sm">
                        {instructorName.charAt(0).toUpperCase() + instructorName.slice(1).replace(/[0-9]/g, '')}
                    </span>
                </div>

                <div className="d-flex align-items-center mb-4 text-dark-secondary gap-2 fs-sm">
                    <span className="text-warning fw-bold fs-md">★ {course.averageRating || '4.5'}</span>
                    <span>({reviewsCount > 999 ? (reviewsCount / 1000).toFixed(1) + 'k' : reviewsCount} reviews)</span>
                </div>

                <div className="mt-auto pt-2">
                    {isEnrolled ? (
                        <>
                            <div className="text-brand fw-bold mb-2 pb-1 fs-xxs" style={{ letterSpacing: '0.05em' }}>
                                <i className="bi bi-check-circle-fill me-1"></i> YOU ARE ENTERED • {progressPercent}% COMPLETED
                            </div>
                            <div className="progress" style={{ height: '5px', backgroundColor: '#e0e7ff', borderRadius: '4px' }}>
                                <div className="progress-bar" role="progressbar" style={{ width: `${progressPercent}%`, backgroundColor: '#1d4ed8', borderRadius: '4px' }} aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}></div>
                            </div>
                        </>
                    ) : (
                        <div className="d-flex w-100">
                            <Button
                                as={Link as any}
                                to={`/courses/${course.id}`}
                                className="dash-btn-outline w-100 py-2 fs-sm fw-semibold"
                            >
                                Enroll Now
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
