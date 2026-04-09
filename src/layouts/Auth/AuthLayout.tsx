import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import authBg from '../../assets/auth_hero_bg.png';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="auth-page-wrapper d-flex flex-column flex-grow-1">

            <Container fluid className="flex-grow-1 d-flex align-items-center p-0 overflow-hidden">
                <Row className="w-100 mx-0 g-0 flex-grow-1" style={{ minHeight: 'calc(100vh - 72px)' }}>
                    {/* Left Hero Section */}
                    <Col lg={7} className="d-none d-lg-flex flex-column justify-content-between p-5 position-relative text-white hero-column"
                        style={{
                            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.6)), url(${authBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}>

                        <div className="mt-5">
                            <div className="d-inline-flex align-items-center px-3 py-2 rounded-pill mb-4"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(4px)' }}>
                                <i className="bi bi-stars me-2 fs-sm"></i>
                                <span className="fs-xxs fw-bold text-uppercase tracking-wider" style={{ letterSpacing: '0.05em' }}>Global Learning Network</span>
                            </div>

                            <h1 className="fs-7xl fw-bold mb-4" style={{ lineHeight: 1.1, maxWidth: '600px' }}>
                                Knowledge is the bridge to your future.
                            </h1>

                            <p className="fs-xl text-white-50 mt-4" style={{ maxWidth: '500px', lineHeight: 1.7 }}>
                                Join over 50,000 students worldwide mastering the skills of tomorrow through Lumina Academy's curated academic curriculum.
                            </p>
                        </div>

                        <div className="d-flex gap-5 mb-4">
                            <div>
                                <div className="fs-3xl fw-bold">98%</div>
                                <div className="fs-xxs text-uppercase text-white-50 fw-bold" style={{ letterSpacing: '0.1em' }}>Success Rate</div>
                            </div>
                            <div className="ps-4 border-start border-white-50">
                                <div className="fs-3xl fw-bold">120+</div>
                                <div className="fs-xxs text-uppercase text-white-50 fw-bold" style={{ letterSpacing: '0.1em' }}>Expert Mentors</div>
                            </div>
                        </div>
                    </Col>

                    {/* Right Form Section */}
                    <Col lg={5} className="d-flex flex-column align-items-center justify-content-center px-4 py-5 bg-white">
                        <div className="w-100" style={{ maxWidth: '440px' }}>
                            {children}
                        </div>

                        <div className="mt-auto pt-5 text-center d-flex gap-4 fs-xxs fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.05em' }}>
                            <a href="#" className="text-decoration-none text-muted hover-primary">Privacy Policy</a>
                            <a href="#" className="text-decoration-none text-muted hover-primary">Terms of Service</a>
                            <a href="#" className="text-decoration-none text-muted hover-primary">Help Center</a>
                        </div>
                    </Col>
                </Row>
            </Container>

            <style>{`
                .hero-column::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 200px;
                    background: linear-gradient(to top, rgba(15, 23, 42, 0.8), transparent);
                    pointer-events: none;
                }
                .hover-primary:hover {
                    color: #4f46e5 !important;
                    transition: color 0.2s ease;
                }
            `}</style>
        </div>
    );
};

export default AuthLayout;
