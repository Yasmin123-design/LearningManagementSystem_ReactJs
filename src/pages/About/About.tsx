import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../features/courses/coursesSlice';
import { fetchMyEnrollments } from '../../features/enrollments/enrollmentsSlice';
import type { AppDispatch, RootState } from '../../app/store';
import './About.css';
import aboutHero from '../../assets/about_hero.png';

// Import Sub-components
import AboutHero from './components/AboutHero';
import FeaturedCourses from './components/FeaturedCourses';
import ExperienceSection from './components/ExperienceSection';
import RoadmapSection from './components/RoadmapSection';
import FinalCTA from './components/FinalCTA';

const About: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { courses } = useSelector((state: RootState) => state.courses);
    const { enrollments } = useSelector((state: RootState) => state.enrollments);

    useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchMyEnrollments());
    }, [dispatch]);

    const displayCourses = useMemo(() => {
        const featured = courses.slice(0, 3).map(course => {
            const enrollment = (enrollments || []).find(e => e.courseId === course.id);
            return {
                ...course,
                progress: enrollment ? enrollment.progress : 0
            };
        });

        return featured.length > 0 ? featured : [
            { id: '1', title: 'Advanced UI/UX Engineering', category: { name: 'DEVELOPMENT' }, progress: 85, thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', description: 'Master the art of creating pixel-perfect interfaces...' },
            { id: '2', title: 'Python for Strategic Analysis', category: { name: 'DATA SCIENCE' }, progress: 52, thumbnail: 'https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&w=800&q=80', description: 'Learn to leverage massive datasets to predict market trends...' },
            { id: '3', title: 'Digital Leadership Mastery', category: { name: 'BUSINESS' }, progress: 91, thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', description: 'Lead distributed teams effectively and navigate the complex landscape...' }
        ];
    }, [courses, enrollments]);

    return (
        <div className="about-page">
            <AboutHero aboutHeroImg={aboutHero} />
            <FeaturedCourses courses={displayCourses} />
            <ExperienceSection />
            <RoadmapSection />
            <FinalCTA />
        </div>
    );
};

export default About;
