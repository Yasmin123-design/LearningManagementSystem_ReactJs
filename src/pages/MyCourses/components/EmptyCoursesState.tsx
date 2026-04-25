import React from 'react';
import { Button } from 'react-bootstrap';

interface EmptyCoursesStateProps {
    searchTerm: string;
    onClearSearch: () => void;
}

const EmptyCoursesState: React.FC<EmptyCoursesStateProps> = ({ searchTerm, onClearSearch }) => {
    return (
        <div className="text-center py-5 w-100">
            <div className="mb-4">
                <i className="bi bi-search text-muted display-1"></i>
            </div>
            <h3 className="fw-bold text-dark-primary">No results found</h3>
            <p className="text-secondary">We couldn't find any courses matching your search "{searchTerm}".</p>
            <Button 
                variant="outline-primary" 
                className="btn-brand-outline mt-3"
                onClick={onClearSearch}
            >
                Clear Search
            </Button>
        </div>
    );
};

export default React.memo(EmptyCoursesState);
