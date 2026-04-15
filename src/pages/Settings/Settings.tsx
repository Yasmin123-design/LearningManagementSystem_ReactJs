import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { PencilLine, CheckCircle2, Info, ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react';
import DashboardLayout from '../../layouts/Dashboard/DashboardLayout';
import { updateProfile, updateAvatar, changePassword } from '../../features/auth/authSlice';
import type { RootState, AppDispatch } from '../../app/store';
import './Settings.css';
import { getAvatarUrl } from '../../utils/getAvatarUrl';

const Settings: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.auth);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        bio: ''
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [isChangingPassword, setIsRefreshingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        
        try {
            await dispatch(updateProfile({
                name: formData.name,
                email: formData.email,
                bio: formData.bio
            })).unwrap();
            
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Failed to update profile:', err);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            await dispatch(updateAvatar(formData)).unwrap();
            setSuccessMessage('Avatar updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Failed to update avatar:', err);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setPasswordData(prev => ({ ...prev, [id]: value }));
        if (passwordError) setPasswordError(null);
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords don't match");
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            return;
        }

        setIsRefreshingPassword(true);
        try {
            await dispatch(changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            })).unwrap();
            
            setPasswordSuccess('Password changed successfully!');
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setTimeout(() => setPasswordSuccess(null), 5000);
        } catch (err: any) {
            setPasswordError(err || 'Failed to change password');
        } finally {
            setIsRefreshingPassword(false);
        }
    };

    const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const avatarUrl = getAvatarUrl(user?.avatar);

    return (
        <DashboardLayout>
            <div className="settings-container">
                <header className="settings-header">
                    <h1 className="settings-title">Profile Settings</h1>
                    <p className="settings-subtitle">
                        Manage your public presence and personal identity. This information will be 
                        displayed to your team and across shared projects.
                    </p>
                </header>

                {error && (
                    <div className="alert alert-danger rounded-4 py-3 px-4 mb-4 border-0 shadow-sm d-flex align-items-center gap-3">
                        <Info size={20} />
                        <div>{error}</div>
                    </div>
                )}

                {successMessage && (
                    <div className="alert alert-success rounded-4 py-3 px-4 mb-4 border-0 shadow-sm d-flex align-items-center gap-3">
                        <CheckCircle2 size={20} />
                        <div>{successMessage}</div>
                    </div>
                )}

                <div className="row g-5">
                    <div className="col-lg-4 text-center">
                        <div className="avatar-section">
                            <div className="avatar-wrapper">
                                <img 
                                    src={avatarUrl} 
                                    alt={user?.name} 
                                    className="avatar-image"
                                    style={{objectFit: 'contain' }}
                                />
                            </div>
                            <button 
                                className="avatar-edit-btn" 
                                onClick={handleAvatarClick}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    <PencilLine size={20} />
                                )}
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                style={{ display: 'none' }} 
                                accept="image/*"
                            />
                        </div>
                        <p className="avatar-hint">
                            Recommended size: 400×400px.<br />
                            Supports JPG, PNG or WebP.
                        </p>
                    </div>

                    <div className="col-lg-8">
                        <div className="settings-card">
                            <Form onSubmit={handleSave}>
                                <Row className="mb-4">
                                    <Col md={6} className="mb-3 mb-md-0">
                                        <Form.Group controlId="name">
                                            <Form.Label className="form-label">Full Name</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                className="form-control-custom"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter your full name"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="email">
                                            <Form.Label className="form-label">Email Address</Form.Label>
                                            <Form.Control 
                                                type="email" 
                                                className="form-control-custom"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Enter your email"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group controlId="role" className="mb-4">
                                    <Form.Label className="form-label">Role</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        className="form-control-custom"
                                        value={formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group controlId="bio" className="mb-4">
                                    <Form.Label className="form-label">Bio</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        className="form-control-custom"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Write a short bio about yourself..."
                                        maxLength={250}
                                    />
                                    <span className="char-count">{formData.bio.length}/250 characters</span>
                                </Form.Group>

                                <div className="verification-banner mb-4">
                                    <div className="verification-icon">
                                        <CheckCircle2 fill="#2563eb" color="white" size={24} />
                                    </div>
                                    <div className="verification-text">
                                        <h4>Account Verification</h4>
                                        <p>Your profile is currently verified and public.</p>
                                    </div>
                                    <a href="#" className="learn-more-link">Learn more</a>
                                </div>

                                <div className="settings-actions">
                                    
                                    <button 
                                        type="submit" 
                                        className="btn-save"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Saving...
                                            </>
                                        ) : 'Save Changes'}
                                    </button>
                                </div>
                            </Form>
                        </div>

                        {/* Security Section */}
                        <div className="settings-card mt-4">
                            <div className="card-header-with-icon mb-4">
                                <div className="header-icon bg-primary-light">
                                    <ShieldCheck size={24} color="#2563eb" />
                                </div>
                                <div>
                                    <h3 className="section-title mb-0">Password & Security</h3>
                                    <p className="section-subtitle">Update your password to keep your account secure.</p>
                                </div>
                            </div>

                            {passwordError && (
                                <div className="alert alert-danger rounded-4 py-3 px-4 mb-4 border-0 shadow-sm d-flex align-items-center gap-3">
                                    <Info size={20} />
                                    <div>{passwordError}</div>
                                </div>
                            )}

                            {passwordSuccess && (
                                <div className="alert alert-success rounded-4 py-3 px-4 mb-4 border-0 shadow-sm d-flex align-items-center gap-3">
                                    <CheckCircle2 size={20} />
                                    <div>{passwordSuccess}</div>
                                </div>
                            )}

                            <Form onSubmit={handlePasswordSubmit}>
                                <Row className="mb-4">
                                    <Col md={12} className="mb-3">
                                        <Form.Group controlId="oldPassword">
                                            <Form.Label className="form-label">Current Password</Form.Label>
                                            <div className="password-input-wrapper">
                                                <Form.Control 
                                                    type={showPasswords.old ? "text" : "password"}
                                                    className="form-control-custom"
                                                    value={passwordData.oldPassword}
                                                    onChange={handlePasswordChange}
                                                    placeholder="Enter current password"
                                                    required
                                                />
                                                <button 
                                                    type="button" 
                                                    className="password-toggle"
                                                    onClick={() => togglePasswordVisibility('old')}
                                                >
                                                    {showPasswords.old ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3 mb-md-0">
                                        <Form.Group controlId="newPassword">
                                            <Form.Label className="form-label">New Password</Form.Label>
                                            <div className="password-input-wrapper">
                                                <Form.Control 
                                                    type={showPasswords.new ? "text" : "password"}
                                                    className="form-control-custom"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    placeholder="Minimum 8 characters"
                                                    required
                                                />
                                                <button 
                                                    type="button" 
                                                    className="password-toggle"
                                                    onClick={() => togglePasswordVisibility('new')}
                                                >
                                                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="confirmPassword">
                                            <Form.Label className="form-label">Confirm New Password</Form.Label>
                                            <div className="password-input-wrapper">
                                                <Form.Control 
                                                    type={showPasswords.confirm ? "text" : "password"}
                                                    className="form-control-custom"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    placeholder="Repeat new password"
                                                    required
                                                />
                                                <button 
                                                    type="button" 
                                                    className="password-toggle"
                                                    onClick={() => togglePasswordVisibility('confirm')}
                                                >
                                                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="settings-actions">
                                    <button 
                                        type="submit" 
                                        className="btn-save btn-security"
                                        disabled={isChangingPassword}
                                    >
                                        {isChangingPassword ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={18} className="me-2" />
                                                Update Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
