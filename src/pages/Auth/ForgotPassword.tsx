import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { forgotPassword } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import AuthLayout from '../../layouts/Auth/AuthLayout';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            const resultAction = await dispatch(forgotPassword(email));
            if (forgotPassword.fulfilled.match(resultAction)) {
                setSubmitted(true);
            }
        }
    };

    if (submitted) {
        return (
            <AuthLayout>
                <div className="text-center py-5">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                        <i className="bi bi-send-check-fill text-primary fs-4xl"></i>
                    </div>
                    <h2 className="fs-3xl fw-bold text-dark mb-3">Check your email</h2>
                    <p className="text-secondary mb-5">
                        We've sent a password reset link to <br />
                        <span className="fw-bold text-dark">{email}</span>
                    </p>
                    <div className="bg-light p-4 rounded-3 mb-5 text-start">
                        <p className="fs-xs text-muted mb-0 d-flex gap-2">
                            <i className="bi bi-info-circle"></i>
                            <span>Didn't receive the email? Check your spam folder or try again in a few minutes.</span>
                        </p>
                    </div>
                    <Link 
                        to="/login" 
                        className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-primary"
                        style={{ background: 'linear-gradient(45deg, #2563eb, #3b82f6)', border: 'none' }}
                    >
                        Back to Login
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="mb-5 text-center text-lg-start">
                <div className="d-flex align-items-center justify-content-center justify-content-lg-start mb-4">
                    <div className="bg-primary rounded d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-mortarboard-fill text-white fs-2xl"></i>
                    </div>
                    <span className="fs-xl fw-bold" style={{ color: '#2563eb' }}>Lumina Academy</span>
                </div>

                <h2 className="fs-4xl fw-bold text-dark mb-2">Forgot Password?</h2>
                <p className="text-secondary fs-sm">Don't worry, it happens. Enter your email and we'll send you a reset link.</p>
            </div>

            {error && <div className="alert alert-danger p-2 small rounded-3 mb-4">{error}</div>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-5" controlId="formBasicEmail">
                    <Form.Label className="fs-xxs fw-bold text-uppercase text-muted mb-2" style={{ letterSpacing: '0.05em' }}>Email Address</Form.Label>
                    <InputGroup>
                        <InputGroup.Text className="bg-light border-0 ps-3 text-secondary" style={{ borderRadius: '0.75rem 0 0 0.75rem' }}>
                            <i className="bi bi-envelope"></i>
                        </InputGroup.Text>
                        <Form.Control
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-light border-0 py-3 ps-2 fs-sm"
                            required
                            style={{ boxShadow: 'none', borderRadius: '0 0.75rem 0.75rem 0' }}
                        />
                    </InputGroup>
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-3 mb-4 fs-md fw-bold rounded-3 shadow-primary d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                    style={{ background: 'linear-gradient(45deg, #2563eb, #3b82f6)', border: 'none' }}
                >
                    {loading ? <span className="spinner-border spinner-border-sm" role="status"></span> : (
                        <>
                            Send Reset Link <i className="bi bi-arrow-right"></i>
                        </>
                    )}
                </Button>
            </Form>

            <div className="text-center mt-4">
                <Link to="/login" className="text-decoration-none fs-sm fw-bold text-primary d-flex align-items-center justify-content-center gap-2">
                    <i className="bi bi-arrow-left"></i> Back to Login
                </Link>
            </div>

            <style>{`
                .shadow-primary {
                    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
                }
            `}</style>
        </AuthLayout>
    );
};

export default ForgotPassword;
