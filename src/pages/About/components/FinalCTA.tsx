import React from 'react';
import { Link } from 'react-router-dom';

const FinalCTA: React.FC = () => {
    return (
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
    );
};

export default React.memo(FinalCTA);
