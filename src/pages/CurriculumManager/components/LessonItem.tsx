import React from 'react';
import { Badge } from 'react-bootstrap';

interface LessonItemProps {
    lesson: any;
    index: number;
    onEdit: (lesson: any) => void;
    onDelete: (lesson: any) => void;
    onManageQuiz: (lesson: any) => void;
}

const LessonItem: React.FC<LessonItemProps> = ({ lesson, index, onEdit, onDelete, onManageQuiz }) => {
    const hasQuiz = !!lesson.quiz;

    return (
        <div className="lesson-item-builder d-flex justify-content-between align-items-center p-3 mb-2 rounded-3 bg-white border" style={{ borderColor: '#f1f5f9' }}>
            <div className="d-flex align-items-center gap-3">
                <span className="text-secondary fw-bold" style={{ width: '25px' }}>
                    {(index + 1).toString().padStart(2, '0')}.
                </span>
                <span className="fw-bold text-dark">{lesson.title}</span>
                {hasQuiz && (
                    <Badge bg="success-soft" className="text-success small-pill">
                        <i className="bi bi-check2-circle me-1"></i> Quiz Active
                    </Badge>
                )}
            </div>
            <div className="d-flex gap-2">
                <button 
                    className={`btn-icon-light-sm ${hasQuiz ? 'text-primary' : 'text-secondary'}`} 
                    onClick={() => onManageQuiz(lesson)}
                    title={hasQuiz ? "Manage Quiz" : "Add Quiz"}
                >
                    <i className={`bi ${hasQuiz ? 'bi-patch-question-fill' : 'bi-patch-question'}`}></i>
                </button>
                <button className="btn-icon-light-sm" onClick={() => onEdit(lesson)} title="Edit Lesson">
                    <i className="bi bi-pencil-fill text-secondary"></i>
                </button>
                <button className="btn-icon-light-sm" onClick={() => onDelete(lesson)} title="Delete Lesson">
                    <i className="bi bi-trash-fill text-secondary"></i>
                </button>
            </div>

            <style>{`
                .small-pill {
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 0.35em 0.8em;
                    background-color: #f0fdf4;
                    color: #15803d;
                    border: 1px solid #dcfce7;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
};

export default React.memo(LessonItem);
