import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="py-4 px-4 border-top mt-auto" style={{ backgroundColor: '#ffffff', zIndex: 10 }}>
            <div className="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary fs-md">
                <div className="mb-2 mb-md-0 text-uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>
                    © 2024 MIDNIGHT LUMINARY. CURATED EXCELLENCE.
                </div>
                <div className="d-flex gap-4 text-uppercase fw-medium" style={{ letterSpacing: '0.05em' }}>
                    <a href="#privacy" className="text-secondary text-decoration-none hover-primary">PRIVACY</a>
                    <a href="#terms" className="text-secondary text-decoration-none hover-primary">TERMS</a>
                    <a href="#policy" className="text-secondary text-decoration-none hover-primary">EDITORIAL POLICY</a>
                    <a href="#contact" className="text-secondary text-decoration-none hover-primary">CONTACT</a>
                </div>
            </div>
            <style>{`
                .hover-primary:hover {
                    color: #4f46e5 !important;
                    transition: color 0.2s ease-in-out;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
