import React from 'react';
import { Button } from 'react-bootstrap';
import LessonItem from './LessonItem';

interface ModuleItemProps {
    module: any;
    index: number;
    lessons: any[];
    onAddLesson: (moduleId: string) => void;
    onEditModule: (module: any) => void;
    onDeleteModule: (module: any) => void;
    onEditLesson: (lesson: any) => void;
    onDeleteLesson: (lesson: any) => void;
    onManageQuiz: (lesson: any) => void;
}

const ModuleItem: React.FC<ModuleItemProps> = ({
    module,
    index,
    lessons,
    onAddLesson,
    onEditModule,
    onDeleteModule,
    onEditLesson,
    onDeleteLesson,
    onManageQuiz
}) => {
    return (
        <div className="module-card-builder bg-white p-4 mb-4" style={{ borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
            <div className="module-header-builder d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-light">
                <div className="d-flex align-items-center gap-3">
                    <i className="bi bi-chevron-down text-secondary"></i>
                    <h5 className="fw-bold m-0">{module.title || `Module ${index + 1}`}</h5>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <Button 
                        variant="link" 
                        className="text-secondary text-decoration-none p-0 fw-bold d-flex align-items-center gap-1" 
                        style={{ color: '#4f46e5', fontSize: '0.9rem' }}
                        onClick={() => onAddLesson(module.id)}
                    >
                        <i className="bi bi-plus-lg"></i> Add Lesson
                    </Button>
                    <button className="btn-icon-light" onClick={() => onAddLesson(module.id)}>
                        <i className="bi bi-plus-lg text-primary ms-1"></i>
                    </button>
                    <div className="border-start ms-2 me-2" style={{ height: '20px' }}></div>
                    <button className="btn-icon-light" onClick={() => onEditModule(module)}>
                        <i className="bi bi-pencil-fill" style={{ color: '#004aa8' }}></i>
                    </button>
                    <button className="btn-icon-light" onClick={() => onDeleteModule(module)}>
                        <i className="bi bi-trash-fill" style={{ color: '#dc3545' }}></i>
                    </button>
                </div>
            </div>

            <div className="lessons-container">
                {lessons.map((lesson, lIndex) => (
                    <LessonItem 
                        key={lesson.id} 
                        lesson={lesson} 
                        index={lIndex} 
                        onEdit={onEditLesson} 
                        onDelete={onDeleteLesson} 
                        onManageQuiz={onManageQuiz}
                    />
                ))}
            </div>
        </div>
    );
};

export default React.memo(ModuleItem);
