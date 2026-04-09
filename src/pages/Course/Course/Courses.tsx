import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../../features/courses/coursesSlice';
import { fetchMyEnrollments } from '../../../features/enrollments/enrollmentsSlice';
import { fetchProfile } from '../../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../../app/store';
import CourseCard from '../../../components/CourseCard/CourseCard';
import DashboardLayout from '../../../layouts/Dashboard/DashboardLayout';
import './Courses.css';


const Courses: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { courses, loading: coursesLoading, error: coursesError } = useSelector((state: RootState) => state.courses);
    console.log(courses);
    const { enrollments } = useSelector((state: RootState) => state.enrollments);
    const { user, token } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(fetchCourses());
        if (token) {
            dispatch(fetchMyEnrollments());
            if (!user) {
                dispatch(fetchProfile());
            }
        }
    }, [dispatch, token, user]);

    const coursesWithProgress = courses.map(course => {
        const enrollment = (enrollments || []).find(e => e.courseId === course.id);
        return {
            ...course,
            progress: enrollment ? enrollment.progress : undefined
        };
    });

    const displayCourses = coursesWithProgress.length > 0 ? coursesWithProgress : [
        { id: '1', title: 'Mastering UI/UX Design: From Vision to Prototype', description: 'Learn the fundamentals of UI design patterns.', instructorId: 'ins1', price: 49, isPremium: false, averageRating: '4.9', instructorEmail: 'Marcus Thorne', category: { name: 'DESIGN' } },
        { id: '2', title: 'Advanced Full-stack Web Development with Next.js', description: 'Master state management using modern tools.', instructorId: 'ins2', price: 79, isPremium: true, averageRating: '4.8', instructorEmail: 'Alex Rivera', category: { name: 'NEW' } },
        { id: '3', title: 'The Art of Visual Identity & Brand Storytelling', description: 'Build a complete brand identity.', instructorId: 'ins3', price: 99, isPremium: true, averageRating: '5.0', instructorEmail: 'Elena Sofia', category: { name: 'BRANDING' } },
        { id: '4', title: 'Data Visualization Mastery: Complex Info Simply', description: 'Learn how to present data beautifully.', instructorId: 'ins4', price: 59, isPremium: false, averageRating: '4.7', instructorEmail: 'David Chen', category: { name: 'DATA' } },
    ];

    const firstName = user?.name ? user.name.split(' ')[0] : 'Sarah';

    return (
        <DashboardLayout>
            <div className="mb-5">
                <h1 className="fw-bold text-dark-primary fs-5xl">
                    Welcome back, {firstName}.
                </h1>
                <p className="text-dark-secondary mt-2 fs-xl" style={{ maxWidth: '800px' }}>
                    Your creative journey continues. You have 3 courses in progress and 2 new
                    recommendations based on your UI/UX path.
                </p>
            </div>

            <div className="d-flex align-items-center mb-4 gap-3 overflow-auto pb-2" style={{ whiteSpace: 'nowrap' }}>
                <span className="text-dark-secondary fw-semibold text-uppercase me-2 fs-sm" style={{ letterSpacing: '0.05em' }}>Filters:</span>
                <button className="dash-filter-pill dash-filter-active">All Courses</button>
                <button className="dash-filter-pill">Category</button>
                <button className="dash-filter-pill">Difficulty</button>
                <button className="dash-filter-pill">Duration</button>
            </div>

            {coursesError && (
                <div className="alert alert-danger" style={{ marginBottom: '2rem', borderRadius: '0.75rem' }}>
                    <strong>API Error:</strong> {coursesError}. Showing dummy data for demonstration.
                </div>
            )}

            {coursesLoading && courses.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                    {displayCourses.map((course) => (
                        <div className="col" key={course.id}>
                            <CourseCard course={course as any} />
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default Courses;
