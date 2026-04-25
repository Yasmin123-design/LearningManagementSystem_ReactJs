import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../features/courses/coursesSlice';
import { fetchMyEnrollments } from '../../features/enrollments/enrollmentsSlice';
import type { AppDispatch, RootState } from '../../app/store';
import CourseCard from '../../components/CourseCard/CourseCard';
import DashboardLayout from '../../layouts/Dashboard/DashboardLayout';
import { useDebounce } from '../../hooks/useDebounce';
import './Courses.css';

const Courses: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { courses, loading: coursesLoading, error: coursesError } = useSelector((state: RootState) => state.courses);
    const { enrollments } = useSelector((state: RootState) => state.enrollments);
    const { user, token } = useSelector((state: RootState) => state.auth);
    
    const [searchTerm, setSearchTerm] = React.useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        dispatch(fetchCourses());
        if (token) {
            dispatch(fetchMyEnrollments());
        }
    }, [dispatch, token]);

    const coursesWithProgress = useMemo(() => {
        return courses.map(course => {
            const enrollment = (enrollments || []).find(e => e.courseId === course.id);
            return {
                ...course,
                progress: enrollment ? enrollment.progress : undefined
            };
        });
    }, [courses, enrollments]);

    const filteredCourses = useMemo(() => {
        if (!debouncedSearchTerm) return coursesWithProgress;
        return coursesWithProgress.filter(course => 
            course.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            course.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            course.category?.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [coursesWithProgress, debouncedSearchTerm]);

    const displayCourses = useMemo(() => {
        if (filteredCourses.length > 0) return filteredCourses;
        if (!coursesLoading && courses.length > 0 && filteredCourses.length === 0) return [];

        return [
            { id: '1', title: 'Mastering UI/UX Design: From Vision to Prototype', description: 'Learn the fundamentals of UI design patterns.', instructorId: 'ins1', price: 49, isPremium: false, averageRating: '4.9', instructorEmail: 'Marcus Thorne', category: { name: 'DESIGN' } },
            { id: '2', title: 'Advanced Full-stack Web Development with Next.js', description: 'Master state management using modern tools.', instructorId: 'ins2', price: 79, isPremium: true, averageRating: '4.8', instructorEmail: 'Alex Rivera', category: { name: 'NEW' } },
            { id: '3', title: 'The Art of Visual Identity & Brand Storytelling', description: 'Build a complete brand identity.', instructorId: 'ins3', price: 99, isPremium: true, averageRating: '5.0', instructorEmail: 'Elena Sofia', category: { name: 'BRANDING' } },
            { id: '4', title: 'Data Visualization Mastery: Complex Info Simply', description: 'Learn how to present data beautifully.', instructorId: 'ins4', price: 59, isPremium: false, averageRating: '4.7', instructorEmail: 'David Chen', category: { name: 'DATA' } },
        ];
    }, [filteredCourses, coursesLoading, courses.length]);

    const firstName = user?.name ? user.name.split(' ')[0] : 'Sarah';

    return (
        <DashboardLayout>
            <div className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4">
                <div>
                    <h1 className="fw-bold text-dark-primary fs-5xl mb-1">
                        Welcome back, {firstName}.
                    </h1>
                    <p className="text-dark-secondary mb-0 fs-xl">
                        Your creative journey continues.
                    </p>
                </div>
                
                <div className="search-container shadow-sm rounded-4 bg-white p-1 border d-flex align-items-center" style={{ width: '100%', maxWidth: '400px' }}>
                    <i className="bi bi-search ms-3 text-muted"></i>
                    <input 
                        type="text" 
                        className="form-control border-0 shadow-none py-2 ms-2" 
                        placeholder="Search for courses, skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
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
                    <strong>Error:</strong> {coursesError}. Showing dummy data for demonstration.
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
