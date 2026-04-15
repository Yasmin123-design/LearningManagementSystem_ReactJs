import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateCourse } from '../../features/courses/coursesSlice';
import type { Course } from '../../features/courses/coursesSlice';
import type { AppDispatch, RootState } from '../../app/store';

interface EditCourseModalProps {
    show: boolean;
    onHide: () => void;
    course: Course | null;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({ show, onHide, course }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.courses);
    
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: ''
    });

    useEffect(() => {
        if (course) {
            setFormData({
                title: course.title || '',
                price: course.price?.toString() || '',
                description: course.description || ''
            });
        }
    }, [course]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!course) return;

        try {
            await dispatch(updateCourse({
                id: course.id,
                data: {
                    title: formData.title,
                    price: Number(formData.price),
                    description: formData.description
                }
            })).unwrap();
            onHide();
        } catch (err) {
            console.error('Failed to update course:', err);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="premium-modal">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">Edit Course</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-4">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-secondary">COURSE TITLE</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter course title"
                            className="form-control-custom"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-secondary">PRICE ($)</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                            className="form-control-custom"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="small fw-bold text-secondary">DESCRIPTION</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your course..."
                            className="form-control-custom"
                            required
                        />
                    </Form.Group>

                    <div className="d-flex gap-2 mb-2">
                        <Button variant="light" className="flex-grow-1 fw-bold py-2 rounded-3" onClick={onHide}>
                            Cancel
                        </Button>
                        <Button type="submit" className="btn-save flex-grow-1 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditCourseModal;
