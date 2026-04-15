import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createLesson, updateLesson } from '../../features/courses/lessonsSlice';
import type { AppDispatch, RootState } from '../../app/store';

interface AddEditLessonModalProps {
    show: boolean;
    onHide: () => void;
    moduleId: string;
    lessonToEdit?: any;
    nextOrderNumber: number;
}

const AddEditLessonModal: React.FC<AddEditLessonModalProps> = ({ show, onHide, moduleId, lessonToEdit, nextOrderNumber }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.lessons);
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        videoUrl: '',
        type: 'video',
        order: nextOrderNumber
    });

    useEffect(() => {
        if (show) {
            if (lessonToEdit) {
                setFormData({
                    title: lessonToEdit.title || '',
                    content: lessonToEdit.content || '',
                    videoUrl: lessonToEdit.videoUrl || '',
                    type: lessonToEdit.type || 'video',
                    order: lessonToEdit.order || nextOrderNumber
                });
            } else {
                setFormData({ 
                    title: '', 
                    content: '', 
                    videoUrl: '', 
                    type: 'video', 
                    order: nextOrderNumber 
                });
            }
        }
    }, [show, lessonToEdit, nextOrderNumber]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'order' ? parseInt(value) || 0 : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (lessonToEdit) {
                await dispatch(updateLesson({
                    id: lessonToEdit.id,
                    data: {
                        ...formData,
                        order: Number(formData.order)
                    }
                })).unwrap();
            } else {
                await dispatch(createLesson({
                    ...formData,
                    order: Number(formData.order),
                    moduleId
                })).unwrap();
            }
            onHide();
        } catch (err) {
            console.error('Failed to save lesson:', err);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="premium-modal">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">{lessonToEdit ? 'Edit Lesson' : 'Add New Lesson'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-4">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-secondary text-uppercase">Lesson Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Introduction to React Hooks"
                            className="form-control-custom"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-secondary text-uppercase">Type</Form.Label>
                        <Form.Select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="form-control-custom"
                        >
                            <option value="video">Video</option>
                            <option value="article">Article</option>
                            <option value="quiz">Quiz</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-secondary text-uppercase">Video URL (Optional)</Form.Label>
                        <Form.Control
                            type="url"
                            name="videoUrl"
                            value={formData.videoUrl}
                            onChange={handleChange}
                            placeholder="https://youtube.com/..."
                            className="form-control-custom"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-secondary text-uppercase">Content / Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Detailed lesson content or description..."
                            className="form-control-custom"
                        />
                    </Form.Group>

                    <input type="hidden" name="order" value={formData.order} />

                    <div className="d-flex gap-2 mt-4">
                        <Button variant="light" className="flex-grow-1 fw-bold py-2 rounded-pill" onClick={onHide}>
                            Cancel
                        </Button>
                        <Button type="submit" className="btn-brand flex-grow-1 fw-bold py-2 rounded-pill d-flex align-items-center justify-content-center" disabled={loading} style={{ backgroundColor: '#004aa8', border: 'none' }}>
                            {loading ? <Spinner animation="border" size="sm" /> : (lessonToEdit ? 'Save Changes' : 'Create Lesson')}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddEditLessonModal;
