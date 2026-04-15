import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteModule } from '../../features/courses/modulesSlice';
import type { AppDispatch, RootState } from '../../app/store';

interface DeleteModuleModalProps {
    show: boolean;
    onHide: () => void;
    moduleToDelete?: any;
}

const DeleteModuleModal: React.FC<DeleteModuleModalProps> = ({ show, onHide, moduleToDelete }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.modules);

    const handleDelete = async () => {
        if (!moduleToDelete) return;
        try {
            await dispatch(deleteModule(moduleToDelete.id)).unwrap();
            onHide();
        } catch (err) {
            console.error('Failed to delete module:', err);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="premium-modal">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold text-danger">Delete Module</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-3 pb-4">
                <div className="text-center mb-4">
                    <div className="bg-light rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '60px', height: '60px' }}>
                        <i className="bi bi-exclamation-triangle text-danger fs-3"></i>
                    </div>
                    <h5 className="fw-bold px-3">Are you sure you want to delete "{moduleToDelete?.title}"?</h5>
                    <p className="text-secondary small mt-2 px-3">
                        This action cannot be undone. All lessons within this module may also be deleted or orphaned.
                    </p>
                </div>
                
                <div className="d-flex gap-2">
                    <Button variant="light" className="flex-grow-1 fw-bold py-2 rounded-pill" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        className="flex-grow-1 fw-bold py-2 rounded-pill d-flex align-items-center justify-content-center border-0 shadow-sm" 
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Yes, Delete it'}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DeleteModuleModal;
