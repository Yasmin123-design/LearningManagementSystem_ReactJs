import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseDetails } from '../../features/courses/coursesSlice';
import { fetchModulesByCourse } from '../../features/courses/modulesSlice';
import { fetchLessonsByModule } from '../../features/courses/lessonsSlice';
import { fetchQuizByLesson } from '../../features/quizzes/quizSlice';
import type { AppDispatch, RootState } from '../../app/store';
import DashboardLayout from '../../layouts/Dashboard/DashboardLayout';
import { Button, Accordion, Badge, ProgressBar, Spinner } from 'react-bootstrap';
import QuizView from './components/QuizView';
import './CourseContent.css';

const CourseContent: React.FC = () => {
    const { courseId = '' } = useParams<{ courseId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { currentCourse, loading: courseLoading } = useSelector((state: RootState) => state.courses);
    const { modules } = useSelector((state: RootState) => state.modules);
    const { lessons } = useSelector((state: RootState) => state.lessons);

    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState<any>(null);

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('drive.google.com')) {
            const fileId = url.split('/d/')[1]?.split('/')[0];
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
        return url;
    };

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseDetails(courseId));
            dispatch(fetchModulesByCourse(courseId)).then((res) => {
                if (res.payload && Array.isArray(res.payload) && res.payload.length > 0) {
                    const firstModule = res.payload[0];
                    setActiveModuleId(firstModule.id);
                    dispatch(fetchLessonsByModule(firstModule.id)).then((lessonsRes) => {
                        if (lessonsRes.payload && Array.isArray(lessonsRes.payload) && lessonsRes.payload.length > 0) {
                            handleLessonClick(lessonsRes.payload[0]);
                        }
                    });
                }
            });
        }
    }, [dispatch, courseId]);

    const handleModuleToggle = (moduleId: string) => {
        setActiveModuleId(moduleId);
        const module = modules.find(m => m.id === moduleId);
        if (module && (!module.lessons || module.lessons.length === 0)) {
            dispatch(fetchLessonsByModule(moduleId));
        }
    };

    const handleLessonClick = async (lesson: any) => {
        setSelectedLesson(lesson);
        setIsPlaying(false);
        setIsQuizMode(false);
        setCurrentQuiz(null);
        
        try {
            const quizAction = await dispatch(fetchQuizByLesson(lesson.id));
            if (fetchQuizByLesson.fulfilled.match(quizAction)) {
                setCurrentQuiz(quizAction.payload);
            }
        } catch (err) {
            console.log("No quiz for this lesson");
        }
    };

    const handleQuizComplete = (score: number) => {
        console.log("Quiz completed with score:", score);
    };

    if (courseLoading && modules.length === 0) return (
        <DashboardLayout>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="course-content-viewer d-flex min-vh-100">
                <aside className="content-sidebar border-end d-flex flex-column bg-white shadow-sm" style={{ width: '350px' }}>
                    <div className="sidebar-header p-4 border-bottom">
                        <div className="course-mini-info d-flex align-items-center gap-3 mb-3">
                            <div className="course-thumb-sm rounded-3 overflow-hidden shadow-sm" style={{ width: '60px', height: '60px' }}>
                                <img src={currentCourse?.thumbnail || "https://picsum.photos/seed/course/100/100"} alt="Course" className="w-100 h-100 object-fit-cover" />
                            </div>
                            <div className="overflow-hidden">
                                <h6 className="fw-bold mb-0 text-dark-primary text-truncate">{currentCourse?.title || "Loading..."}</h6>
                                <span className="text-secondary small">Course Progress</span>
                            </div>
                        </div>
                        <ProgressBar now={45} variant="primary" style={{ height: '6px' }} className="rounded-pill" />
                    </div>

                    <div className="sidebar-nav flex-grow-1 overflow-auto py-3">
                        <Accordion activeKey={activeModuleId} flush className="module-accordion">
                            {modules.map((module, idx) => (
                                <Accordion.Item eventKey={module.id} key={module.id}>
                                    <Accordion.Header onClick={() => handleModuleToggle(module.id)}>
                                        <div className="d-flex align-items-center gap-3">
                                            <i className={`bi ${activeModuleId === module.id ? 'bi-journal-bookmark-fill text-primary' : 'bi-journal-bookmark'}`}></i>
                                            <span className={`fw-bold small ${activeModuleId === module.id ? 'text-primary' : 'text-dark-primary'}`}>
                                                Module {idx + 1}: {module.title}
                                            </span>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body className="p-0">
                                        <div className="lesson-list">
                                            {lessons.filter(l => l.moduleId === module.id).map((lesson) => (
                                                <div 
                                                    key={lesson.id} 
                                                    className={`lesson-item px-4 py-3 d-flex align-items-center gap-3 cursor-pointer ${selectedLesson?.id === lesson.id ? 'bg-primary-soft border-start border-4 border-primary' : 'hover-bg-light'}`}
                                                    onClick={() => handleLessonClick(lesson)}
                                                >
                                                    <i className={`bi ${lesson.type === 'video' ? 'bi-play-circle' : 'bi-file-text'} text-secondary`}></i>
                                                    <div className="flex-grow-1">
                                                        <div className={`small fw-bold ${selectedLesson?.id === lesson.id ? 'text-primary' : 'text-dark-primary'}`}>{lesson.title}</div>
                                                        {lesson.hasQuiz && <Badge bg="success-soft" className="text-success mt-1" style={{ fontSize: '0.6rem' }}>HAS QUIZ</Badge>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </div>
                </aside>

                <main className="main-content-area flex-grow-1 bg-light p-4 p-lg-5 overflow-auto">
                    <div className="player-wrapper container-fluid" style={{ maxWidth: '1000px' }}>
                        {isQuizMode && currentQuiz ? (
                            <div className="animate-fade-in">
                                <Button variant="link" className="text-secondary mb-3 p-0 text-decoration-none fw-bold" onClick={() => setIsQuizMode(false)}>
                                    <i className="bi bi-arrow-left me-2"></i> Back to Video
                                </Button>
                                <QuizView quiz={currentQuiz} onComplete={handleQuizComplete} />
                            </div>
                        ) : selectedLesson ? (
                            <div className="lesson-display animate-fade-in">
                                <div className="video-section rounded-4 overflow-hidden shadow-lg bg-black mb-4 position-relative" style={{ aspectRatio: '16/9' }}>
                                    {isPlaying ? (
                                        <iframe 
                                            src={getEmbedUrl(selectedLesson.videoUrl)} 
                                            width="100%" 
                                            height="100%" 
                                            allow="autoplay; encrypted-media" 
                                            allowFullScreen
                                            className="border-0"
                                        ></iframe>
                                    ) : (
                                        <div className="video-overlay h-100 d-flex flex-column justify-content-center align-items-center text-white" onClick={() => setIsPlaying(true)}>
                                            <div className="play-button-wrapper p-4 rounded-circle bg-primary shadow-lg hover-scale mb-4" style={{ cursor: 'pointer' }}>
                                                <i className="bi bi-play-fill display-4 text-white"></i>
                                            </div>
                                            <h3 className="fw-bold">{selectedLesson.title}</h3>
                                            <p className="opacity-75">Click to start streaming lesson</p>
                                        </div>
                                    )}
                                </div>

                                <div className="lesson-info-card bg-white p-4 rounded-4 shadow-sm border mb-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <Badge bg="primary-soft" className="text-primary mb-2 text-uppercase">Now Playing</Badge>
                                            <h2 className="fw-bold text-dark-primary">{selectedLesson.title}</h2>
                                        </div>
                                        {currentQuiz && (
                                            <Button 
                                                variant="success" 
                                                className="btn-success-lg px-4 d-flex align-items-center gap-2"
                                                onClick={() => setIsQuizMode(true)}
                                            >
                                                <i className="bi bi-patch-question-fill"></i> Take Lesson Quiz
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-secondary fs-5">{selectedLesson.content || "No description available for this lesson."}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-state text-center py-5">
                                <i className="bi bi-collection-play text-muted display-1"></i>
                                <h3 className="mt-4 text-secondary">Select a lesson to begin</h3>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            
            <style>{`
                .active-lesson-pill { font-size: 0.65rem; padding: 0.2rem 0.6rem; border-radius: 20px; }
                .hover-bg-light:hover { background-color: #f8fafc; }
                .bg-primary-soft { background-color: #eef2ff; }
                .bg-success-soft { background-color: #ecfdf5; }
                .cursor-pointer { cursor: pointer; }
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </DashboardLayout>
    );
};

export default CourseContent;
