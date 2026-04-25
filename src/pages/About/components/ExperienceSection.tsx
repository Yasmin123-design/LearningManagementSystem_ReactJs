import React from 'react';

const ExperienceSection: React.FC = () => {
    return (
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
    );
};

export default React.memo(ExperienceSection);
