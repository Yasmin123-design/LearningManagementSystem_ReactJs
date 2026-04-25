import React from 'react';
import { Button } from 'react-bootstrap';

interface CourseStructureHeaderProps {
    title: string;
    description: string;
    onAddModule: () => void;
}

const CourseStructureHeader: React.FC<CourseStructureHeaderProps> = ({ title, description, onAddModule }) => {
    return (
        <div className="mb-5 d-flex justify-content-between align-items-start">
            <div>
                <h1 className="display-4 fw-bold text-dark-primary mb-3" style={{ color: '#0047a0' }}>
                    {title || "Course Title"}
                </h1>
                <p className="lead text-secondary" style={{ maxWidth: '700px', fontSize: '1.1rem' }}>
                    {description || "Course description goes here."}
                </p>
            </div>
            <Button 
                className="btn-brand shadow-sm rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 w-auto" 
                style={{ backgroundColor: '#004aa8', border: 'none' }}
                onClick={onAddModule}
            >
                <i className="bi bi-plus-circle-fill"></i> Add New Module
            </Button>
        </div>
    );
};

export default React.memo(CourseStructureHeader);
