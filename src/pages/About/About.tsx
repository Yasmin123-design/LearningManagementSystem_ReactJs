import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../features/courses/coursesSlice';
import { fetchMyEnrollments } from '../../features/enrollments/enrollmentsSlice';
import type { AppDispatch, RootState } from '../../app/store';
import './About.css';
import aboutHero from '../../assets/about_hero.png';

const About: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { courses } = useSelector((state: RootState) => state.courses);
    const { enrollments } = useSelector((state: RootState) => state.enrollments);

    useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchMyEnrollments());
    }, [dispatch]);

    const featuredCourses = courses.slice(0, 3).map(course => {
        const enrollment = (enrollments || []).find(e => e.courseId === course.id);
        return {
            ...course,
            progress: enrollment ? enrollment.progress : 0
        };
    });

    // Fallback if no courses are available in DB yet
    const displayCourses = featuredCourses.length > 0 ? featuredCourses : [
        { id: '1', title: 'Advanced UI/UX Engineering', category: { name: 'DEVELOPMENT' }, progress: 85, thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', description: 'Master the art of creating pixel-perfect interfaces...' },
        { id: '2', title: 'Python for Strategic Analysis', category: { name: 'DATA SCIENCE' }, progress: 52, thumbnail: 'https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&w=800&q=80', description: 'Learn to leverage massive datasets to predict market trends...' },
        { id: '3', title: 'Digital Leadership Mastery', category: { name: 'BUSINESS' }, progress: 91, thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', description: 'Lead distributed teams effectively and navigate the complex landscape...' }
    ];
    return (
        <div className="about-page">
            <section className="about-section about-hero">
                <div className="container-custom">
                    <div className="about-hero">
                        <div className="hero-content">
                            <div className="hero-tag">
                                <span className="dot"></span>
                                New Semester is Live
                            </div>
                            <h1 className="hero-title">
                                Empower Your <br />
                                <span className="highlight">Learning</span> Journey
                            </h1>
                            <p className="hero-subtitle">
                                Access premium education from anywhere. Master new skills with our personalized learning paths and expert-led interactive modules.
                            </p>
                            <div className="hero-btns">
                                <Link to="/register" className="btn-primary-p">Get Started</Link>
                                <a href="#preview" className="btn-secondary-p">
                                    <i className="bi bi-play-circle-fill fs-xl text-primary"></i>
                                    Watch Preview
                                </a>
                            </div>
                            <div className="student-proof">
                                <div className="avatar-stack">
                                    <img src="https://i.pravatar.cc/150?u=1" alt="Student" />
                                    <img src="https://i.pravatar.cc/150?u=2" alt="Student" />
                                    <img src="https://i.pravatar.cc/150?u=3" alt="Student" />
                                </div>
                                <span className="fs-xs text-muted fw-bold">10k+ students joined this week</span>
                            </div>
                        </div>
                        <div className="hero-visual">
                            <div className="illustration-card">
                                <img src={aboutHero} alt="Learning Illustration" />
                            </div>
                            <div className="floating-stats">
                                <div className="stats-icon text-primary">
                                    <i className="bi bi-star-fill"></i>
                                </div>
                                <div>
                                    <div className="fw-bold fs-xs">Top Rating</div>
                                    <div className="text-muted fs-xxs">4.8/5 from our global student network</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
                        {displayCourses.map((course, i) => (
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

            <section className="about-section">
                <div className="container-custom">
                    <div className="experience-intro">
                        <h2 className="text-dark">Interactive Learning Experience</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>We don't just teach, we engage. Experience learning that stays with you through multiple sensory touchpoints.</p>
                    </div>

                    <div className="experience-grid">
                        <div className="movie-card">
                            <div className="play-circle-btn">
                                <i className="bi bi-play-fill"></i>
                            </div>
                            <div className="exp-content text-dark">
                                <h3 className="fw-bold fs-2xl mb-2">Cinema-Quality Video Lessons</h3>
                                <p className="text-muted">High-definition content delivered by world-class educators, including live sessions and recorded deep dives.</p>
                            </div>
                        </div>
                        <div className="feature-cards-stack">
                            <div className="f-mini-card pink">
                                <i className="bi bi-question-square-fill fs-2xl"></i>
                                <h3>Smart Quizzes</h3>
                                <p className="small opacity-75">AI-driven adaptive testing that adjusts to your pace.</p>
                            </div>
                            <div className="f-mini-card blue">
                                <i className="bi bi-chat-left-text-fill fs-2xl"></i>
                                <h3>Peer Collaboration</h3>
                                <p className="small opacity-75">Connect with over 100k students in active discussion hubs.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-section bg-soft">
                <div className="container-custom">
                    <div className="roadmap-wrap">
                        <div className="roadmap-left">
                            <h2 className="fs-3xl fw-bold mb-4">Your Roadmap to Mastery</h2>
                            <p className="text-muted mb-5">We've structured our curriculum to ensure no student is left behind, moving from fundamental theory to practical application.</p>
                            
                            <div className="roadmap-steps">
                                {[
                                    { n: '01', t: 'Foundations & Core Theory', desc: 'The fundamental concepts that build the bedrock of your expertise.' },
                                    { n: '02', t: 'Practical Implementation', desc: 'Real-world labs where you apply knowledge to simulated industry scenarios.' },
                                    { n: '03', t: 'Certification & Final Project', desc: 'Showcase your skills with a capstone project and earn your verified credentials.' }
                                ].map((step, i) => (
                                    <div key={i} className="step-item">
                                        <div className="step-num">{step.n}</div>
                                        <div>
                                            <h4 className="text-dark">{step.t}</h4>
                                            <p className="text-muted small mb-0">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="roadmap-right">
                            <div className="roadmap-card">
                                <div className="preview-header">
                                    <h5 className="fw-bold m-0">Module Progress</h5>
                                    <span className="step-indicator">Step 2 of 4</span>
                                </div>
                                <div className="module-list-p">
                                    <div className="module-list-item">
                                        <i className="bi bi-check-circle-fill text-success fs-xl me-2"></i>
                                        Intro to Neural Networks
                                    </div>
                                    <div className="module-list-item active">
                                        <i className="bi bi-cpu-fill fs-xl me-2"></i>
                                        Advanced Backpropagation
                                    </div>
                                    <div className="module-list-item locked">
                                        <i className="bi bi-lock-fill fs-xl me-2"></i>
                                        Recursive Learning Models
                                    </div>
                                </div>
                                <button className="btn-continue">Continue Session</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container-custom">
                <section className="final-cta">
                    <h2 className="cta-title">Ready to illuminate your <br /> future?</h2>
                    <p className="cta-desc">Join 2.5 million students worldwide and start your educational transformation today. No credit card required to start your first module.</p>
                    <div className="cta-btns">
                        <Link to="/register" className="btn-white-p">Join the Community</Link>
                        <Link to="/courses" className="btn-outline-white-p">View Pricing Plans</Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
