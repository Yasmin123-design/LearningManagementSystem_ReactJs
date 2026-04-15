import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFullCourseContent, fetchCourseDetails } from '../../features/courses/coursesSlice';
import type { AppDispatch, RootState } from '../../app/store';
import DashboardLayout from '../../layouts/Dashboard/DashboardLayout';
import { Button, Spinner } from 'react-bootstrap';
import './CourseStructureManager.css';
import AddEditModuleModal from '../InstructorDashboard/AddEditModuleModal';
import DeleteModuleModal from '../InstructorDashboard/DeleteModuleModal';
import AddEditLessonModal from '../InstructorDashboard/AddEditLessonModal';
import DeleteLessonModal from '../InstructorDashboard/DeleteLessonModal';

const CourseStructureManager: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    
    const { currentCourse, loading: courseLoading, error: courseError } = useSelector((state: RootState) => state.courses);
    const { modules, loading: modulesLoading, error: modulesError } = useSelector((state: RootState) => state.modules);
    const { lessons, loading: lessonsLoading, error: lessonsError } = useSelector((state: RootState) => state.lessons);

    const loading = courseLoading || modulesLoading || lessonsLoading;
    const error = courseError || modulesError || lessonsError;

    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeModule, setActiveModule] = useState<any>(null);

    const [showAddEditLessonModal, setShowAddEditLessonModal] = useState(false);
    const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
    const [activeLesson, setActiveLesson] = useState<any>(null);
    const [targetModuleId, setTargetModuleId] = useState<string>('');

    const handleAddModuleClick = () => {
        setActiveModule(null);
        setShowAddEditModal(true);
    };

    const handleEditModuleClick = (module: any) => {
        setActiveModule(module);
        setShowAddEditModal(true);
    };

    const handleDeleteModuleClick = (module: any) => {
        setActiveModule(module);
        setShowDeleteModal(true);
    };

    const handleAddLesson = (moduleId: string) => {
        setTargetModuleId(moduleId);
        setActiveLesson(null);
        setShowAddEditLessonModal(true);
    };

    const handleEditLesson = (lesson: any) => {
        setTargetModuleId(lesson.moduleId);
        setActiveLesson(lesson);
        setShowAddEditLessonModal(true);
    };

    const handleDeleteLesson = (lesson: any) => {
        setActiveLesson(lesson);
        setShowDeleteLessonModal(true);
    };

    useEffect(() => {
        if (courseId) {
            dispatch(fetchFullCourseContent(courseId));
            dispatch(fetchCourseDetails(courseId));
        }
    }, [dispatch, courseId]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" variant="primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
                    <h3 className="text-danger mb-3">Error</h3>
                    <p>{error}</p>
                    <Link to="/instructorcourses" className="btn btn-outline-primary mt-3">Back to Dashboard</Link>
                </div>
            </DashboardLayout>
        );
    }

    const course = currentCourse || {};

    return (
        <DashboardLayout>
            <div className="structure-manager-container container-fluid bg-light min-vh-100 position-relative" style={{ padding: '3rem 5%' }}>
                
                <div 
                    className="position-absolute rounded-circle" 
                    style={{
                        width: '300px', 
                        height: '300px', 
                        backgroundColor: '#f1f5f9', 
                        top: '5%', 
                        left: '2%', 
                        zIndex: 0,
                        opacity: 0.8
                    }}
                ></div>

                <div className="position-relative" style={{ zIndex: 1 }}>
                    <div className="mb-5 d-flex justify-content-between align-items-start">
                        <div>

                            <h1 className="display-4 fw-bold text-dark-primary mb-3" style={{ color: '#0047a0' }}>
                                {(course as any).title || "Course Title"}
                            </h1>
                            <p className="lead text-secondary" style={{ maxWidth: '700px', fontSize: '1.1rem' }}>
                                {(course as any).description || "Course description goes here."}
                            </p>
                        </div>
                        <Button 
                            className="btn-brand shadow-sm rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 w-auto" 
                            style={{ backgroundColor: '#004aa8', border: 'none' }}
                            onClick={handleAddModuleClick}
                        >
                            <i className="bi bi-plus-circle-fill"></i> Add New Module
                        </Button>
                    </div>

                    <div className="mb-4 d-flex align-items-center">
                        <h3 className="fw-bold m-0" style={{ marginRight: '2rem' }}>Course Curriculum</h3>
                        <div className="flex-grow-1 border-bottom border-light"></div>
                    </div>

                    <div className="modules-list">
                        {modules.length > 0 ? modules.map((module: any, mIndex: number) => (
                            <div key={module.id} className="module-card-builder bg-white p-4 mb-4" style={{ borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
                                <div className="module-header-builder d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-light">
                                    <div className="d-flex align-items-center gap-3">
                                        <i className="bi bi-chevron-down text-secondary"></i>
                                        <h5 className="fw-bold m-0">{module.title || `Module ${mIndex + 1}`}</h5>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <Button 
                                            variant="link" 
                                            className="text-secondary text-decoration-none p-0 fw-bold d-flex align-items-center gap-1" 
                                            style={{ color: '#4f46e5', fontSize: '0.9rem' }}
                                            onClick={() => handleAddLesson(module.id)}
                                        >
                                            <i className="bi bi-plus-lg"></i> Add Lesson
                                        </Button>
                                        <button className="btn-icon-light" onClick={() => handleAddLesson(module.id)}><i className="bi bi-plus-lg text-primary ms-1"></i></button>
                                        <div className="border-start ms-2 me-2" style={{ height: '20px' }}></div>
                                        <button className="btn-icon-light" onClick={() => handleEditModuleClick(module)}><i className="bi bi-pencil-fill" style={{ color: '#004aa8' }}></i></button>
                                        <button className="btn-icon-light" onClick={() => handleDeleteModuleClick(module)}><i className="bi bi-trash-fill" style={{ color: '#dc3545' }}></i></button>
                                    </div>
                                </div>

                                <div className="lessons-container">
                                    {lessons.filter((l: any) => l.moduleId === module.id).map((lesson: any, lIndex: number) => (
                                        <div key={lesson.id} className="lesson-item-builder d-flex justify-content-between align-items-center p-3 mb-2 rounded-3" style={{ border: '1px solid #f1f5f9' }}>
                                            <div className="d-flex align-items-center gap-3">
                                                <span className="text-secondary fw-bold" style={{ width: '25px' }}>
                                                    {(lIndex + 1).toString().padStart(2, '0')}.
                                                </span>
                                                <span className="fw-bold text-dark">{lesson.title}</span>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button className="btn-icon-light-sm" onClick={() => handleEditLesson(lesson)}><i className="bi bi-pencil-fill text-secondary"></i></button>
                                                <button className="btn-icon-light-sm" onClick={() => handleDeleteLesson(lesson)}><i className="bi bi-trash-fill text-secondary"></i></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )) : (
                            <div className="empty-module-placeholder p-4 mb-4 d-flex justify-content-between align-items-center rounded-3 bg-white" style={{ border: '2px dashed #e2e8f0' }}>
                                <div className="d-flex align-items-center gap-3 opacity-50">
                                    <i className="bi bi-chevron-right text-secondary"></i>
                                    <h5 className="fw-bold m-0 text-secondary">New Empty Module</h5>
                                </div>
                                <div className="d-flex align-items-center gap-3 opacity-50 pe-none">
                                    <span className="text-secondary fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.9rem' }}>
                                        <i className="bi bi-plus-lg"></i> Add Lesson
                                    </span>
                                    <div className="border-start ms-2 me-2" style={{ height: '20px' }}></div>
                                    <button className="btn-icon-light"><i className="bi bi-pencil-fill text-secondary"></i></button>
                                    <button className="btn-icon-light"><i className="bi bi-trash-fill text-secondary"></i></button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-5 text-center d-flex justify-content-center">
                        <Button 
                            className="btn-outline-brand shadow-sm rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2 bg-white w-auto mx-auto" 
                            style={{ color: '#004aa8', borderColor: '#e2e8f0' }}
                            onClick={handleAddModuleClick}
                        >
                            <i className="bi bi-plus-square-fill" style={{ color: '#004aa8' }}></i> Add New Module
                        </Button>
                    </div>

                </div>
            </div>

            {/* Modals placed completely outside the typical DOM flow */}
            <AddEditModuleModal 
                show={showAddEditModal} 
                onHide={() => setShowAddEditModal(false)}
                courseId={courseId!}
                moduleToEdit={activeModule}
                nextOrderNumber={modules.length + 1}
            />

            <DeleteModuleModal 
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                moduleToDelete={activeModule}
            />

            <AddEditLessonModal 
                show={showAddEditLessonModal}
                onHide={() => setShowAddEditLessonModal(false)}
                moduleId={targetModuleId}
                lessonToEdit={activeLesson}
                nextOrderNumber={(lessons.filter((l: any) => l.moduleId === targetModuleId).length || 0) + 1}
            />

            <DeleteLessonModal 
                show={showDeleteLessonModal}
                onHide={() => setShowDeleteLessonModal(false)}
                lessonToDelete={activeLesson}
            />
        </DashboardLayout>
    );
};

export default CourseStructureManager;
