import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { login, getGoogleAuthUrl, getLinkedInAuthUrl } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import AuthLayout from '../../layouts/Auth/AuthLayout';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, token, user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (token && user) {
            if (user.role === 'instructor') {
                navigate('/instructorcourses');
            } else {
                navigate('/courses');
            }
        }
    }, [token, user, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            dispatch(login({ email, password }));
        }
    };

    const handleOAuthLogin = async (provider: 'google' | 'linkedin') => {
        const action = provider === 'google' 
            ? await dispatch(getGoogleAuthUrl()) 
            : await dispatch(getLinkedInAuthUrl());
            
        if (getGoogleAuthUrl.fulfilled.match(action) || getLinkedInAuthUrl.fulfilled.match(action)) {
            window.location.href = action.payload as string;
        }
    };

    return (
        <AuthLayout>
            <div className="mb-5 text-center text-lg-start">
                <div className="d-flex align-items-center justify-content-center justify-content-lg-start mb-4">
                    <div className="bg-primary rounded d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-mortarboard-fill text-white fs-2xl"></i>
                    </div>
                    <span className="fs-xl fw-bold" style={{ color: '#2563eb' }}>Lumina Academy</span>
                </div>

                <h2 className="fs-4xl fw-bold text-dark mb-2">Start Your Learning Journey</h2>
                <p className="text-secondary fs-sm">Sign in to access your dashboard, courses, and community.</p>
            </div>

            {error && <div className="alert alert-danger p-2 small rounded-3 mb-4">{error}</div>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="formBasicEmail">
                    <Form.Label className="fs-xxs fw-bold text-uppercase text-muted mb-2" style={{ letterSpacing: '0.05em' }}>Email</Form.Label>
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

                <Form.Group className="mb-4" controlId="formBasicPassword">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <Form.Label className="fs-xxs fw-bold text-uppercase text-muted m-0" style={{ letterSpacing: '0.05em' }}>Password</Form.Label>
                        <a href="#forgot" className="text-decoration-none fs-xxs fw-bold text-primary">Forgot password?</a>
                    </div>
                    <InputGroup>
                        <InputGroup.Text className="bg-light border-0 ps-3 text-secondary" style={{ borderRadius: '0.75rem 0 0 0.75rem' }}>
                            <i className="bi bi-lock"></i>
                        </InputGroup.Text>
                        <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-light border-0 py-3 ps-2 fs-sm"
                            required
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

                <div className="d-flex align-items-center mb-4">
                    <Form.Check
                        type="checkbox"
                        label="Keep me logged in"
                        className="fs-sm text-secondary"
                        checked={keepSignedIn}
                        onChange={(e) => setKeepSignedIn(e.target.checked)}
                    />
                </div>

                <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-3 mb-4 fs-md fw-bold rounded-3 shadow-primary d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                    style={{ background: 'linear-gradient(45deg, #2563eb, #3b82f6)', border: 'none' }}
                >
                    {loading ? <span className="spinner-border spinner-border-sm" role="status"></span> : (
                        <>
                            Login to Academy <i className="bi bi-arrow-right"></i>
                        </>
                    )}
                </Button>
            </Form>

            <div className="d-flex align-items-center mb-4">
                <hr className="flex-grow-1 opacity-10" />
                <span className="px-3 text-muted fs-xxs fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>Or continue with</span>
                <hr className="flex-grow-1 opacity-10" />
            </div>

            <div className="row g-3 mb-5">
                <div className="col-6">
                    <Button
                        variant="outline-light"
                        className="w-100 py-3 border text-dark fs-sm fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3 hover-shadow"
                        onClick={() => handleOAuthLogin('google')}
                    >
                        <i className="bi bi-google text-danger fs-xl"></i> <span className="d-none d-sm-inline">Google</span>
                    </Button>
                </div>
                <div className="col-6">
                    <Button
                        variant="outline-light"
                        className="w-100 py-3 border text-dark fs-sm fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3 hover-shadow"
                        onClick={() => handleOAuthLogin('linkedin')}
                    >
                        <i className="bi bi-linkedin text-primary fs-xl"></i> <span className="d-none d-sm-inline">LinkedIn</span>
                    </Button>
                </div>
            </div>


            <div className="text-center text-muted fs-sm">
                Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none ms-1">Sign up for free</Link>
            </div>

            <style>{`
                .shadow-primary {
                    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
                }
                .hover-shadow:hover {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    background-color: #f8fafc !important;
                }
                .cursor-pointer { cursor: pointer; }
            `}</style>
        </AuthLayout>
    );
};

export default Login;
