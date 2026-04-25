import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyEnrollments } from '../../features/enrollments/enrollmentsSlice';
import type { AppDispatch, RootState } from '../../app/store';
import DashboardLayout from '../../layouts/Dashboard/DashboardLayout';
import { Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './MyCourses.css';

// Import Sub-components
import MyCoursesHeader from './components/MyCoursesHeader';
import CourseProgressCard from './components/CourseProgressCard';
import EmptyCoursesState from './components/EmptyCoursesState';
import { useDebounce } from '../../hooks/useDebounce';

const MyCourses: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { enrollments, loading, error } = useSelector((state: RootState) => state.enrollments);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Create a debounced version of the search term
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        dispatch(fetchMyEnrollments());
    }, [dispatch]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
    }, []);

    const handleViewModules = useCallback((courseId: string) => {
        navigate(`/courses/${courseId}/content`);
    }, [navigate]);

    const filteredEnrollments = useMemo(() => {
        return enrollments.filter(enrollment => 
            enrollment.course.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            (enrollment.course.description && enrollment.course.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
        );
    }, [enrollments, debouncedSearchTerm]);

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
                <MyCoursesHeader searchTerm={searchTerm} onSearchChange={handleSearchChange} />

                <Row className="g-4">
                    {filteredEnrollments.length > 0 ? (
                        filteredEnrollments.map((enrollment, index) => (
                            <CourseProgressCard 
                                key={enrollment.id}
                                enrollment={enrollment}
                                isFeatured={index === 0}
                                onViewModules={handleViewModules}
                            />
                        ))
                    ) : (
                        <EmptyCoursesState searchTerm={debouncedSearchTerm} onClearSearch={handleClearSearch} />
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
