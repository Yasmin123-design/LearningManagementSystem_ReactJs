import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

interface MyCoursesHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

const MyCoursesHeader: React.FC<MyCoursesHeaderProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="d-flex justify-content-between align-items-end mb-5 mt-2">
            <div>
                <h2 className="fw-bold text-dark-primary mb-1">My Courses</h2>
                <p className="text-secondary small mb-0">Continue your learning journey</p>
            </div>
            <div className="search-wrapper">
                <InputGroup className="shadow-sm rounded-pill overflow-hidden bg-white" style={{ width: '350px' }}>
                    <InputGroup.Text className="bg-white border-0 ps-3">
                        <i className="bi bi-search text-muted"></i>
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Search your courses..."
                        className="border-0 py-2 shadow-none"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </InputGroup>
            </div>
        </div>
    );
};

export default React.memo(MyCoursesHeader);
