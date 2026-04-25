import React from 'react';

const RoadmapSection: React.FC = () => {
    return (
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
    );
};

export default React.memo(RoadmapSection);
