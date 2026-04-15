import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseDetails } from '../../features/courses/coursesSlice';
import { fetchModulesByCourse } from '../../features/courses/modulesSlice';
import { fetchLessonsByModule } from '../../features/courses/lessonsSlice';
import type { AppDispatch, RootState } from '../../app/store';
import DashboardLayout from '../../layouts/Dashboard/DashboardLayout';
import { Button, Row, Col, Accordion, Badge, ProgressBar } from 'react-bootstrap';
import './CourseContent.css';

const CourseContent: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { currentCourse, loading: courseLoading, error: courseError } = useSelector((state: RootState) => state.courses);
    const { modules, loading: modulesLoading, error: modulesError } = useSelector((state: RootState) => state.modules);
    const { lessons, loading: lessonsLoading, error: lessonsError } = useSelector((state: RootState) => state.lessons);

    const loading = courseLoading || modulesLoading || lessonsLoading;
    const error = courseError || modulesError || lessonsError;
    const courseContent = modules;
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('drive.google.com')) {
            const fileId = url.split('/d/')[1]?.split('/')[0];
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
        return url;
    };
    useEffect(() => {
        console.log('Full State Structure (Modules + Nested Lessons):', courseContent);
    }, [courseContent]);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseDetails(courseId));
            dispatch(fetchModulesByCourse(courseId)).then((res) => {
                if (res.payload && Array.isArray(res.payload) && res.payload.length > 0) {
                    const firstModule = res.payload[0];
                    setActiveModuleId(firstModule.id);
                    dispatch(fetchLessonsByModule(firstModule.id)).then((lessonsRes) => {
                        if (lessonsRes.payload && Array.isArray(lessonsRes.payload) && lessonsRes.payload.length > 0) {
                            const lesson = lessonsRes.payload[0];
                            setSelectedLesson(lesson);
                        }
                    });
                }

            });
        }
    }, [dispatch, courseId]);

    const handleModuleToggle = (moduleId: string) => {
        setActiveModuleId(moduleId);
        const module = courseContent.find(m => m.id === moduleId);
        if (module && (!module.lessons || module.lessons.length === 0)) {
            dispatch(fetchLessonsByModule(moduleId));
        }
    };

    const handleLessonClick = (lesson: any) => {
        setSelectedLesson(lesson);
        setIsPlaying(false); // Reset player when changing lesson
    };

    if (loading && courseContent.length === 0) return (
        <DashboardLayout>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        </DashboardLayout>
    );

    if (error) return (
        <DashboardLayout>
            <div className="alert alert-danger m-5">Error: {error}</div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="course-content-viewer d-flex">
                <aside className="content-sidebar border-end d-flex flex-column bg-white">
                    <div className="sidebar-header p-4 border-bottom">
                        <div className="course-mini-info d-flex align-items-center gap-3 mb-3">
                            <div className="course-thumb-sm">
                                <img src={currentCourse?.thumbnail || "https://picsum.photos/seed/course/100/100"} alt="Course" />
                            </div>
                            <div>
                                <h6 className="fw-bold mb-0 text-dark-primary">{currentCourse?.title || "Mastering the Atelier"}</h6>
                                <span className="text-secondary small">12 of 24 Lessons Complete</span>
                            </div>
                        </div>
                        <ProgressBar now={50} variant="primary" style={{ height: '6px' }} className="rounded-pill" />
                    </div>

                    <div className="sidebar-nav flex-grow-1 overflow-auto py-2">
                        <div className="nav-item-simple px-4 py-2 text-secondary fw-medium small">
                            <i className="bi bi-info-circle me-3"></i> Introduction
                        </div>

                        <Accordion activeKey={activeModuleId} flush className="module-accordion">
                            {courseContent.map((module, idx) => (
                                <Accordion.Item eventKey={module.id} key={module.id} onClick={() => handleModuleToggle(module.id)}>
                                    <Accordion.Header>
                                        <div className="d-flex align-items-center gap-3">
                                            <i className={`bi ${activeModuleId === module.id ? 'bi-journal-bookmark-fill text-brand' : 'bi-journal-bookmark'}`}></i>
                                            <span className={`fw-bold ${activeModuleId === module.id ? 'text-brand' : 'text-dark-primary'}`}>
                                                Module {idx + 1}: {module.title.split(':').slice(1).join(':') || module.title}
                                            </span>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body className="p-0">
                                        <div className="lesson-list">
                                            {lessons.filter(l => l.moduleId === module.id).map((lesson) => (
                                                <div 
                                                    key={lesson.id} 
                                                    className={`lesson-item px-5 py-2 d-flex align-items-center gap-3 ${selectedLesson?.id === lesson.id ? 'active' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLessonClick(lesson);
                                                    }}
                                                >
                                                    <i className={`bi ${lesson.type === 'video' ? 'bi-play-circle' : 'bi-file-text'} small`}></i>
                                                    <span className="small fw-medium">{lesson.title}</span>
                                                    {selectedLesson?.id === lesson.id && <Badge className="bg-brand ms-auto rounded-pill" style={{ fontSize: '0.6rem' }}>CURRENT</Badge>}
                                                </div>
                                            ))}
                                            {(!module.lessons || module.lessons.length === 0) && <div className="p-3 text-center text-muted small">Loading lessons...</div>}
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                        
                        <div className="nav-item-simple px-4 py-2 text-secondary fw-medium small">
                             <i className="bi bi-star me-3"></i> Final Assessment
                        </div>
                    </div>

                    <div className="sidebar-footer p-4 border-top">
                        <Button className="btn-brand-orange w-100 py-2 fw-bold d-flex justify-content-between align-items-center">
                            Continue Learning <i className="bi bi-arrow-right"></i>
                        </Button>
                    </div>
                </aside>

                <main className="main-content-area flex-grow-1 bg-light overflow-auto p-4 p-lg-5">
                    <div className="container-fluid">
                        <div className="mb-4">
                            <Badge className="bg-light text-secondary border px-3 py-2 mb-3 fw-bold rounded-pill" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>CORE CURRICULUM</Badge>
                            <h1 className="display-5 fw-bold text-dark-primary mb-3">
                                {currentCourse?.title ? (
                                    <>
                                        {currentCourse.title.split(' ').slice(0, -1).join(' ')} <span className="text-brand fst-italic">{currentCourse.title.split(' ').slice(-1)}</span>
                                    </>
                                ) : "Course Title"}
                            </h1>
                            <p className="text-secondary fs-5" style={{ maxWidth: '800px' }}>
                                {currentCourse?.description || "A comprehensive journey through the curriculum. Progress from fundamental principles to complex theoretical frameworks."}
                            </p>
                        </div>

                        <div className="lesson-video-player rounded-4 overflow-hidden shadow-lg bg-black mb-5" style={{ minHeight: '500px', height: '500px' }}>
                             {selectedLesson ? (
                                isPlaying ? (
                                    <iframe 
                                        src={getEmbedUrl(selectedLesson.videoUrl)} 
                                        width="100%" 
                                        height="100%" 
                                        allow="autoplay" 
                                        className="border-0"
                                    ></iframe>
                                ) : (
                                    <div 
                                        className="video-placeholder h-100 d-flex flex-column justify-content-center align-items-center text-white p-5 text-center"
                                        onClick={() => setIsPlaying(true)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i className="bi bi-play-circle-fill display-1 mb-3 text-brand hover-scale"></i>
                                        <h2 className="fw-bold mb-2">{selectedLesson.title}</h2>
                                        <p className="opacity-75 mb-4" style={{ maxWidth: '500px' }}>
                                            {selectedLesson.content || "Ready to start this lesson? Click play or the button below to begin streaming the content."}
                                        </p>
                                        <Button 
                                            className="btn-brand px-5 py-3 fw-bold rounded-pill"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsPlaying(true);
                                            }}
                                        >
                                            <i className="bi bi-play-fill me-2"></i> Start Learning
                                        </Button>
                                    </div>
                                )
                             ) : (
                                <div className="d-flex justify-content-center align-items-center h-100 text-white opacity-50">
                                    Select a lesson to start learning
                                </div>
                             )}
                        </div>

                        <div className="curriculum-preview mb-5">
                             <h4 className="fw-bold mb-4">Curriculum Overview</h4>
                             {courseContent.map((module, mIdx) => (
                                 <div key={module.id} className="module-static-card bg-white rounded-3 p-4 mb-3 border d-flex justify-content-between align-items-center">
                                     <div className="d-flex align-items-center gap-4">
                                         <span className="display-6 fw-bold text-light" style={{ color: '#eee' }}>0{mIdx + 1}</span>
                                         <div>
                                             <h5 className="fw-bold mb-1">{module.title}</h5>
                                             <span className="text-secondary small">{lessons.filter(l => l.moduleId === module.id).length || 0} Lessons • {module.description}</span>
                                         </div>
                                     </div>
                                     <i className="bi bi-chevron-down text-secondary"></i>
                                 </div>
                             ))}
                        </div>

                        <Row className="g-4">
                            <Col md={8}>
                                <div className="workshop-card bg-brand rounded-4 p-5 text-white shadow-lg h-100 d-flex flex-column justify-content-between">
                                    <div>
                                         <h3 className="fw-bold mb-3">Upcoming Workshop</h3>
                                         <p className="opacity-75 mb-4">Join our live session on "The Ethics of AI Curation" next Thursday at 6PM GMT.</p>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <Button variant="light" className="text-brand fw-bold px-4 rounded-3">Reserve Spot</Button>
                                        <span className="small opacity-50">Limited Seats Remaining</span>
                                    </div>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="score-card rounded-4 p-5 h-100 d-flex flex-column justify-content-center shadow-sm" style={{ backgroundColor: '#ffedd5' }}>
                                    <div className="mb-4">
                                        <i className="bi bi-trophy-fill fs-2" style={{ color: '#9a3412' }}></i>
                                    </div>
                                    <h1 className="display-4 fw-bold mb-0" style={{ color: '#9a3412' }}>85%</h1>
                                    <span className="text-uppercase fw-bold ls-1" style={{ color: '#9a3412', fontSize: '0.75rem' }}>Average Quiz Score</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
};

export default CourseContent;
