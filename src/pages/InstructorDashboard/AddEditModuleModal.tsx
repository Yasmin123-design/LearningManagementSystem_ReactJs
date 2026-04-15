import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createModule, updateModule } from '../../features/courses/modulesSlice';
import type { AppDispatch, RootState } from '../../app/store';

interface AddEditModuleModalProps {
    show: boolean;
    onHide: () => void;
    courseId: string;
    moduleToEdit?: any;
    nextOrderNumber: number;
}

const AddEditModuleModal: React.FC<AddEditModuleModalProps> = ({ show, onHide, courseId, moduleToEdit, nextOrderNumber }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.modules);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        order: nextOrderNumber
    });

    useEffect(() => {
        if (show) {
            if (moduleToEdit) {
                setFormData({
                    title: moduleToEdit.title || '',
                    description: moduleToEdit.description || '',
                    order: moduleToEdit.order || nextOrderNumber
                });
            } else {
                setFormData({ title: '', description: '', order: nextOrderNumber });
            }
        }
    }, [show, moduleToEdit, nextOrderNumber]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'order' ? parseInt(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (moduleToEdit) {
                await dispatch(updateModule({
                    id: moduleToEdit.id,
                    data: {
                        title: formData.title,
                        description: formData.description,
                        order: Number(formData.order)
                    }
                })).unwrap();
            } else {
                await dispatch(createModule({
                    title: formData.title,
                    description: formData.description,
                    order: Number(formData.order),
                    courseId
                })).unwrap();
            }
            onHide();
        } catch (err) {
            console.error('Failed to save module:', err);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="premium-modal">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">{moduleToEdit ? 'Edit Module' : 'Add New Module'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-4">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-secondary">MODULE TITLE</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Introduction to NestJS"
                            className="form-control-custom"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-secondary">DESCRIPTION</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of this module..."
                            className="form-control-custom"
                        />
                    </Form.Group>

                    <input type="hidden" name="order" value={formData.order} />

                    <div className="d-flex gap-2 mt-4">
                        <Button variant="light" className="flex-grow-1 fw-bold py-2 rounded-pill" onClick={onHide}>
                            Cancel
                        </Button>
                        <Button type="submit" className="btn-brand flex-grow-1 fw-bold py-2 rounded-pill d-flex align-items-center justify-content-center" disabled={loading} style={{ backgroundColor: '#004aa8', border: 'none' }}>
                            {loading ? <Spinner animation="border" size="sm" /> : (moduleToEdit ? 'Save Changes' : 'Create Module')}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddEditModuleModal;
