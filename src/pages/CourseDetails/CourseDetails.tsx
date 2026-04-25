import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseDetails, fetchFullCourseContent } from '../../features/courses/coursesSlice';
import { fetchMyEnrollments, enrollInCourse, getPaymentUrl } from '../../features/enrollments/enrollmentsSlice';
import type { AppDispatch, RootState } from '../../app/store';
import './CourseDetails.css';
import { getAvatarUrl } from '../../utils/getAvatarUrl';

// Import Sub-components
import CourseHero from './components/CourseHero';
import CourseSidebar from './components/CourseSidebar';
import CourseCurriculum from './components/CourseCurriculum';
import CourseSuccessModals from './components/CourseSuccessModals';

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
            dispatch(fetchFullCourseContent(courseId));
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

    const handleEnroll = useCallback(async () => {
        if (!token) {
            window.location.href = "/login";
            return;
        }

        if (!courseId || !currentCourse) return;

        if (currentCourse.isPremium) {
            try {
                await dispatch(enrollInCourse(courseId));
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
    }, [dispatch, courseId, currentCourse, token]);

    const handleHideSuccess = useCallback(() => setShowSuccessModal(false), []);
    const handleHidePayment = useCallback(() => setShowPaymentSuccessModal(false), []);

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
            <div className="bg-white border-bottom pb-5">
                <div className="container pt-4">
                    <div className="row">
                        <CourseHero course={course} avatarUrl={avatarUrl} />
                        <CourseSidebar 
                            course={course} 
                            isEnrolled={isEnrolled} 
                            enrollmentLoading={enrollmentLoading} 
                            onEnroll={handleEnroll} 
                        />
                    </div>
                </div>
            </div>

            <CourseCurriculum courseContent={courseContent} isEnrolled={isEnrolled} />

            <CourseSuccessModals 
                showSuccessModal={showSuccessModal}
                showPaymentSuccessModal={showPaymentSuccessModal}
                onHideSuccess={handleHideSuccess}
                onHidePayment={handleHidePayment}
                courseTitle={course.title}
            />
        </div>
    );
};

export default CourseDetails;
