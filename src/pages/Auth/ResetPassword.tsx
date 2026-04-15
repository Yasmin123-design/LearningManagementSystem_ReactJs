import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { resetPassword } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import AuthLayout from '../../layouts/Auth/AuthLayout';

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!token) {
            setLocalError('Invalid or missing reset token. Please request a new link.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (newPassword !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setLocalError('Password must be at least 8 characters long');
            return;
        }

        if (token && newPassword) {
            const resultAction = await dispatch(resetPassword({ token, newPassword }));
            if (resetPassword.fulfilled.match(resultAction)) {
                setSuccess(true);
            }
        }
    };

    if (success) {
        return (
            <AuthLayout>
                <div className="text-center py-5">
                    <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                        <i className="bi bi-shield-check text-success fs-4xl"></i>
                    </div>
                    <h2 className="fs-3xl fw-bold text-dark mb-3">Password updated!</h2>
                    <p className="text-secondary mb-5">
                        Your password has been changed successfully. <br />
                        You can now sign in with your new password.
                    </p>
                    <Link 
                        to="/login" 
                        className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-primary"
                        style={{ background: 'linear-gradient(45deg, #2563eb, #3b82f6)', border: 'none' }}
                    >
                        Sign In Now
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

                <h2 className="fs-4xl fw-bold text-dark mb-2">Set New Password</h2>
                <p className="text-secondary fs-sm">Create a strong password to secure your account.</p>
            </div>

            {(error || localError) && <div className="alert alert-danger p-2 small rounded-3 mb-4">{error || localError}</div>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="formNewPassword">
                    <Form.Label className="fs-xxs fw-bold text-uppercase text-muted mb-2" style={{ letterSpacing: '0.05em' }}>New Password</Form.Label>
                    <InputGroup>
                        <InputGroup.Text className="bg-light border-0 ps-3 text-secondary" style={{ borderRadius: '0.75rem 0 0 0.75rem' }}>
                            <i className="bi bi-lock"></i>
                        </InputGroup.Text>
                        <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-light border-0 py-3 ps-2 fs-sm"
                            required
                            disabled={!token}
                            style={{ boxShadow: 'none' }}
                        />
                        <InputGroup.Text
                            className="bg-light border-0 pe-3 text-secondary cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: 'pointer', borderRadius: '0 0.75rem 0.75rem 0' }}
                        >
                            <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-5" controlId="formConfirmPassword">
                    <Form.Label className="fs-xxs fw-bold text-uppercase text-muted mb-2" style={{ letterSpacing: '0.05em' }}>Confirm Password</Form.Label>
                    <InputGroup>
                        <InputGroup.Text className="bg-light border-0 ps-3 text-secondary" style={{ borderRadius: '0.75rem 0 0 0.75rem' }}>
                            <i className="bi bi-shield-lock"></i>
                        </InputGroup.Text>
                        <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-light border-0 py-3 ps-2 fs-sm"
                            required
                            disabled={!token}
                            style={{ boxShadow: 'none', borderRadius: '0 0.75rem 0.75rem 0' }}
                        />
                    </InputGroup>
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-3 mb-4 fs-md fw-bold rounded-3 shadow-primary d-flex align-items-center justify-content-center gap-2"
                    disabled={loading || !token}
                    style={{ background: 'linear-gradient(45deg, #2563eb, #3b82f6)', border: 'none' }}
                >
                    {loading ? <span className="spinner-border spinner-border-sm" role="status"></span> : (
                        <>
                            Reset Password <i className="bi bi-check2-circle"></i>
                        </>
                    )}
                </Button>
            </Form>

            <div className="text-center mt-4">
                <Link to="/login" className="text-decoration-none fs-sm fw-bold text-primary">
                     Return to Login
                </Link>
            </div>

            <style>{`
                .shadow-primary {
                    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
                }
                .cursor-pointer { cursor: pointer; }
            `}</style>
        </AuthLayout>
    );
};

export default ResetPassword;
