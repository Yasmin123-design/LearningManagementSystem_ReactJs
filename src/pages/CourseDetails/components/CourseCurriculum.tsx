import React from 'react';
import { Accordion } from 'react-bootstrap';
import { PlayCircle, Lock } from 'lucide-react';

interface CourseCurriculumProps {
    courseContent: any[];
    isEnrolled: boolean;
}

const CourseCurriculum: React.FC<CourseCurriculumProps> = ({ courseContent, isEnrolled }) => {
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <h2 className="fw-bold mb-0">Curriculum</h2>
                        <span className="text-muted fs-sm fw-medium">
                            {courseContent.length} Modules • {courseContent.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0)} Lessons
                        </span>
                    </div>

                    <Accordion defaultActiveKey="0" className="curriculum-accordion custom-accordion">
                        {courseContent.map((module: any, index: number) => (
                            <Accordion.Item eventKey={index.toString()} key={module.id} className="mb-3 border rounded-3 overflow-hidden shadow-sm">
                                <Accordion.Header>
                                    <div className="w-100 pe-3">
                                        <span className="text-primary fs-xxs fw-bold text-uppercase mb-1 d-block letter-spacing-1">Module {module.order}</span>
                                        <h5 className="mb-1 fw-bold text-dark">{module.title}</h5>
                                        <p className="mb-0 text-secondary fs-sm fw-normal">{module.description}</p>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body className="p-0">
                                    <div className="lesson-list">
                                        {module.lessons?.map((lesson: any) => (
                                            <div key={lesson.id} className="lesson-item d-flex align-items-center justify-content-between p-4 border-bottom hover-bg-light transition-all">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="lesson-icon bg-light rounded-circle p-2 d-flex align-items-center justify-content-center text-primary">
                                                        <PlayCircle size={20} />
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-1 fw-semibold text-dark">Lesson {module.order}.{lesson.order}: {lesson.title}</h6>
                                                        <span className="text-muted fs-xs">Video content • {lesson.duration || '15:00'}</span>
                                                    </div>
                                                </div>
                                                {!isEnrolled && index > 0 ? <Lock size={16} className="text-muted" /> : <PlayCircle size={16} className="text-primary" />}
                                            </div>
                                        ))}
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

export default React.memo(CourseCurriculum);
