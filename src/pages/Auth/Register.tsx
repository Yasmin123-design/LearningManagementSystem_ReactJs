import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { register } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import AuthLayout from '../../layouts/Auth/AuthLayout';
import { useForm } from '../../hooks/useForm';

const Register: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, token, user } = useSelector((state: RootState) => state.auth);

    const { values, handleChange, handleSubmit } = useForm({
        initialValues: {
            email: '',
            password: '',
            role: 'student'
        },
        onSubmit: (formValues) => {
            if (formValues.email && formValues.password && formValues.role) {
                dispatch(register(formValues));
            }
        }
    });

    useEffect(() => {
        if (token && user) {
            if (user.role === 'instructor') {
                navigate('/instructorcourses');
            } else {
                navigate('/courses');
            }
        }
    }, [token, user, navigate]);

    return (
        <AuthLayout>
            <div className="bg-white rounded p-4 p-sm-5 shadow-sm" style={{ borderRadius: '1.5rem' }}>
                <div style={{ fontWeight: 700, letterSpacing: '0.05em', color: '#4f46e5', marginBottom: '0.5rem' }} className="text-uppercase fs-xs">
                    Join Us
                </div>
                <h2 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2rem' }} className="fs-4xl">
                    Create Account
                </h2>

                {error && <div className="alert alert-danger p-2 small">{error}</div>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4" controlId="formBasicRole">
                        <Form.Label style={{ color: '#374151', fontWeight: 500 }} className="fs-sm">Select Role</Form.Label>
                        <Form.Select
                            name="role"
                            value={values.role}
                            onChange={handleChange}
                            style={{ borderRadius: '0.5rem', borderColor: '#e5e7eb', boxShadow: 'none', padding: '0.75rem 1rem' }}
                        >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formBasicEmail">
                        <Form.Label style={{ color: '#374151', fontWeight: 500 }} className="fs-sm">Email Address</Form.Label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 text-secondary">
                                <i className="bi bi-envelope"></i>
                            </span>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={values.email}
                                onChange={handleChange}
                                className="border-start-0 ps-0"
                                required
                                style={{ boxShadow: 'none' }}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formBasicPassword">
                        <Form.Label style={{ color: '#374151', fontWeight: 500 }} className="fs-sm">Password</Form.Label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 text-secondary">
                                <i className="bi bi-lock"></i>
                            </span>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={values.password}
                                onChange={handleChange}
                                className="border-start-0 ps-0"
                                required
                                style={{ boxShadow: 'none', letterSpacing: '2px' }}
                            />
                        </div>
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100 py-3 mb-4 mt-2 fs-lg"
                        disabled={loading}
                        style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5', fontWeight: 600, borderRadius: '0.5rem' }}
                    >
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Sign Up for Dashboard'}
                    </Button>
                </Form>

                <div className="d-flex align-items-center mb-4">
                    <hr className="flex-grow-1" style={{ opacity: 0.15 }} />
                    <span className="px-3 text-secondary fs-xs" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>OR SIGN UP WITH</span>
                    <hr className="flex-grow-1" style={{ opacity: 0.15 }} />
                </div>

                <div className="d-flex gap-3 mb-4">
                    <Button variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-center gap-2 py-2" style={{ borderRadius: '0.5rem', color: '#374151', borderColor: '#e5e7eb' }}>
                        <i className="bi bi-google text-danger"></i>
                        <span style={{ fontWeight: 500 }}>Google</span>
                    </Button>
                    <Button variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-center gap-2 py-2" style={{ borderRadius: '0.5rem', color: '#374151', borderColor: '#e5e7eb' }}>
                        <i className="bi bi-apple fs-5"></i>
                        <span style={{ fontWeight: 500 }}>Apple</span>
                    </Button>
                </div>

                <div className="text-center text-secondary fs-sm">
                    Already have an account? <Link to="/login" className="text-decoration-none" style={{ color: '#4f46e5', fontWeight: 600 }}>Login</Link>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Register;
