import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteLesson } from '../../features/courses/lessonsSlice';
import type { AppDispatch, RootState } from '../../app/store';

interface DeleteLessonModalProps {
    show: boolean;
    onHide: () => void;
    lessonToDelete: any;
}

const DeleteLessonModal: React.FC<DeleteLessonModalProps> = ({ show, onHide, lessonToDelete }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.lessons);

    const handleDelete = async () => {
        if (lessonToDelete) {
            try {
                await dispatch(deleteLesson(lessonToDelete.id)).unwrap();
                onHide();
            } catch (err) {
                console.error('Failed to delete lesson:', err);
            }
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="premium-modal text-center">
            <Modal.Header closeButton className="border-0 pb-0" />
            <Modal.Body className="py-4 px-5">
                <div className="mb-4">
                    <div className="icon-badge bg-danger bg-opacity-10 text-danger mx-auto mb-3" style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                        <i className="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <h3 className="fw-bold mb-2">Delete Lesson?</h3>
                    <p className="text-secondary mb-0">
                        Are you sure you want to delete "<span className="text-dark fw-bold">{lessonToDelete?.title}</span>"? 
                        This action cannot be undone.
                    </p>
                </div>

                <div className="d-flex gap-3 justify-content-center">
                    <Button variant="light" className="px-4 py-2 rounded-pill fw-bold" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="danger" className="px-4 py-2 rounded-pill fw-bold d-flex align-items-center gap-2" disabled={loading} onClick={handleDelete}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Delete Lesson'}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DeleteLessonModal;
