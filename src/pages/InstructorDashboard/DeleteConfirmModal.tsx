import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCourse } from '../../features/courses/coursesSlice';
import type { AppDispatch, RootState } from '../../app/store';

interface DeleteConfirmModalProps {
    show: boolean;
    onHide: () => void;
    courseId: string | null;
    courseTitle: string | null;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ show, onHide, courseId, courseTitle }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.courses);

    const handleDelete = async () => {
        if (!courseId) return;
        try {
            await dispatch(deleteCourse(courseId)).unwrap();
            onHide();
        } catch (err) {
            console.error('Failed to delete course:', err);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="premium-modal">
            <Modal.Body className="p-4 text-center">
                <div className="mb-4 text-danger">
                    <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '3rem' }}></i>
                </div>
                <h4 className="fw-bold mb-3">Delete Course?</h4>
                <p className="text-secondary mb-4">
                    Are you sure you want to delete <strong>"{courseTitle}"</strong>? This action cannot be undone.
                </p>
                <div className="d-flex gap-2">
                    <Button variant="light" className="flex-grow-1 fw-bold py-2 rounded-3" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="danger" className="flex-grow-1 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center" onClick={handleDelete} disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Delete Course'}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DeleteConfirmModal;
