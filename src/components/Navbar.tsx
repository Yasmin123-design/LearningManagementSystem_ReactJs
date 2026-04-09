import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';
import type { RootState, AppDispatch } from '../app/store';
import { logout } from '../features/auth/authSlice';

const Navbar: React.FC = () => {
    const { token, user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <BsNavbar expand="lg" className="px-4 py-3 bg-white border-bottom shadow-sm" sticky="top" style={{ zIndex: 1040 }}>
            <Container fluid>
                <BsNavbar.Brand as={Link as any} to="/" className="fs-2xl" style={{ color: '#4f46e5', fontWeight: 700 }}>
                    Midnight Luminary
                </BsNavbar.Brand>

                <BsNavbar.Toggle aria-controls="basic-navbar-nav" />

                <BsNavbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="align-items-center gap-3 fs-lg" style={{ color: '#6b7280' }}>
                        <Nav.Link as={Link as any} to={user?.role === 'instructor' ? "/instructorcourses" : "/courses"} className="text-secondary hover-primary">
                            {user?.role === 'instructor' ? "My Courses" : "Courses"}
                        </Nav.Link>
                        <Nav.Link as={Link as any} to="/about" className="text-secondary hover-primary">About</Nav.Link>

                        <div className="mx-2 border-start h-50 d-none d-lg-block" style={{ borderColor: '#e5e7eb' }}></div>

                        {token ? (
                            <div className="d-flex align-items-center gap-3 ms-2">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={handleLogout}
                                    style={{ borderColor: '#4f46e5', color: '#4f46e5', fontWeight: 600 }}
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-2 ms-2">
                                <Button
                                    as={Link as any}
                                    to="/login"
                                    variant="light"
                                    size="sm"
                                    className="fw-medium text-secondary"
                                >
                                    Login
                                </Button>
                                <Button
                                    as={Link as any}
                                    to="/register"
                                    variant="primary"
                                    size="sm"
                                    style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5', fontWeight: 600 }}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        )}

                        <div className="ms-2 d-flex gap-3 align-items-center mt-3 mt-lg-0">
                            <i className="bi bi-question-circle text-secondary hover-primary" style={{ fontSize: '1.1rem', cursor: 'pointer' }}></i>
                            <i className="bi bi-globe text-secondary hover-primary" style={{ fontSize: '1.1rem', cursor: 'pointer' }}></i>
                        </div>
                    </Nav>
                </BsNavbar.Collapse>
            </Container>

            <style>{`
                .hover-primary:hover {
                    color: #4f46e5 !important;
                    transition: color 0.2s ease-in-out;
                }
            `}</style>
        </BsNavbar>
    );
};

export default Navbar;
