import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFullCourseContent, fetchCourseDetails } from '../../features/courses/coursesSlice';
import type { AppDispatch, RootState } from '../../app/store';
import DashboardLayout from '../../layouts/Dashboard/DashboardLayout';
import { Button, Spinner } from 'react-bootstrap';
import './CourseStructureManager.css';

// Import New Sub-components
import CourseStructureHeader from './components/CourseStructureHeader';
import ModuleItem from './components/ModuleItem';

// Import Modals
import AddEditModuleModal from '../InstructorDashboard/AddEditModuleModal';
import DeleteModuleModal from '../InstructorDashboard/DeleteModuleModal';
import AddEditLessonModal from '../InstructorDashboard/AddEditLessonModal';
import DeleteLessonModal from '../InstructorDashboard/DeleteLessonModal';

const CourseStructureManager: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
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

    useEffect(() => {
        if (courseId) {
            dispatch(fetchFullCourseContent(courseId));
            dispatch(fetchCourseDetails(courseId));
        }
    }, [dispatch, courseId]);

    const lessonsByModule = useMemo(() => {
        const grouping: Record<string, any[]> = {};
        lessons.forEach(lesson => {
            if (!grouping[lesson.moduleId]) {
                grouping[lesson.moduleId] = [];
            }
            grouping[lesson.moduleId].push(lesson);
        });
        return grouping;
    }, [lessons]);

    const handleAddModuleClick = useCallback(() => {
        setActiveModule(null);
        setShowAddEditModal(true);
    }, []);

    const handleEditModuleClick = useCallback((module: any) => {
        setActiveModule(module);
        setShowAddEditModal(true);
    }, []);

    const handleDeleteModuleClick = useCallback((module: any) => {
        setActiveModule(module);
        setShowDeleteModal(true);
    }, []);

    const handleHideAddEditModal = useCallback(() => setShowAddEditModal(false), []);
    const handleHideDeleteModal = useCallback(() => setShowDeleteModal(false), []);

    const handleAddLesson = useCallback((moduleId: string) => {
        setTargetModuleId(moduleId);
        setActiveLesson(null);
        setShowAddEditLessonModal(true);
    }, []);

    const handleEditLesson = useCallback((lesson: any) => {
        setTargetModuleId(lesson.moduleId);
        setActiveLesson(lesson);
        setShowAddEditLessonModal(true);
    }, []);

    const handleDeleteLesson = useCallback((lesson: any) => {
        setActiveLesson(lesson);
        setShowDeleteLessonModal(true);
    }, []);

    const handleManageQuizClick = useCallback((lesson: any) => {
        navigate(`/instructor/courses/${courseId}/lessons/${lesson.id}/quiz`);
    }, [navigate, courseId]);
    
    const handleHideAddEditLessonModal = useCallback(() => setShowAddEditLessonModal(false), []);
    const handleHideDeleteLessonModal = useCallback(() => setShowDeleteLessonModal(false), []);

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
                <div className="position-relative" style={{ zIndex: 1 }}>
                    <CourseStructureHeader 
                        title={(course as any).title}
                        description={(course as any).description}
                        onAddModule={handleAddModuleClick}
                    />

                    <div className="mb-4 d-flex align-items-center">
                        <h3 className="fw-bold m-0" style={{ marginRight: '2rem' }}>Course Curriculum</h3>
                        <div className="flex-grow-1 border-bottom border-light"></div>
                    </div>

                    <div className="modules-list">
                        {modules.length > 0 ? modules.map((module: any, mIndex: number) => (
                            <ModuleItem 
                                key={module.id}
                                module={module}
                                index={mIndex}
                                lessons={lessonsByModule[module.id] || []}
                                onAddLesson={handleAddLesson}
                                onEditModule={handleEditModuleClick}
                                onDeleteModule={handleDeleteModuleClick}
                                onEditLesson={handleEditLesson}
                                onDeleteLesson={handleDeleteLesson}
                                onManageQuiz={handleManageQuizClick}
                            />
                        )) : (
                            <div className="empty-module-placeholder p-4 mb-4 d-flex justify-content-between align-items-center rounded-3 bg-white" style={{ border: '2px dashed #e2e8f0' }}>
                                <div className="d-flex align-items-center gap-3 opacity-50">
                                    <i className="bi bi-chevron-right text-secondary"></i>
                                    <h5 className="fw-bold m-0 text-secondary">New Empty Module</h5>
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

            {/* Modals */}
            <AddEditModuleModal 
                show={showAddEditModal} 
                onHide={handleHideAddEditModal}
                courseId={courseId!}
                moduleToEdit={activeModule}
                nextOrderNumber={modules.length + 1}
            />

            <DeleteModuleModal 
                show={showDeleteModal}
                onHide={handleHideDeleteModal}
                moduleToDelete={activeModule}
            />

            <AddEditLessonModal 
                show={showAddEditLessonModal}
                onHide={handleHideAddEditLessonModal}
                moduleId={targetModuleId}
                lessonToEdit={activeLesson}
                nextOrderNumber={(lessons.filter((l: any) => l.moduleId === targetModuleId).length || 0) + 1}
            />

            <DeleteLessonModal 
                show={showDeleteLessonModal}
                onHide={handleHideDeleteLessonModal}
                lessonToDelete={activeLesson}
            />
        </DashboardLayout>
    );
};

export default CourseStructureManager;
