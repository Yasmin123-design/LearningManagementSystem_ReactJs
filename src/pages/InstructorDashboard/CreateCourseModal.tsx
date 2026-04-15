import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse, fetchCategories } from '../../features/courses/coursesSlice';
import type { AppDispatch, RootState } from '../../app/store';

interface CreateCourseModalProps {
    show: boolean;
    onHide: () => void;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ show, onHide }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { categories, loading } = useSelector((state: RootState) => state.courses);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        categoryId: ''
    });

    useEffect(() => {
        if (show && categories.length === 0) {
            dispatch(fetchCategories());
        }
    }, [show, categories.length, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(createCourse({
                title: formData.title,
                description: formData.description,
                price: Number(formData.price),
                categoryId: formData.categoryId
            })).unwrap();
            setFormData({ title: '', description: '', price: '', categoryId: '' });
            onHide();
        } catch (err) {
            console.error('Failed to create course:', err);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="premium-modal">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">Create New Course</Modal.Title>
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
                            placeholder="e.g. Mastering React 18"
                            className="form-control-custom"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-secondary">CATEGORY</Form.Label>
                        <Form.Select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="form-control-custom"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </Form.Select>
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
                            placeholder="What will students learn in this course?"
                            className="form-control-custom"
                            required
                        />
                    </Form.Group>

                    <div className="d-flex gap-2 mb-2">
                        <Button variant="light" className="flex-grow-1 fw-bold py-2 rounded-3" onClick={onHide}>
                            Cancel
                        </Button>
                        <Button type="submit" className="btn-save flex-grow-1 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Create Course'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateCourseModal;
