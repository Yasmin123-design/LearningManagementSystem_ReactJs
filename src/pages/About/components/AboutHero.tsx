import React from 'react';
import { Link } from 'react-router-dom';

interface AboutHeroProps {
    aboutHeroImg: string;
}

const AboutHero: React.FC<AboutHeroProps> = ({ aboutHeroImg }) => {
    return (
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
                            <img src={aboutHeroImg} alt="Learning Illustration" />
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
    );
};

export default React.memo(AboutHero);
