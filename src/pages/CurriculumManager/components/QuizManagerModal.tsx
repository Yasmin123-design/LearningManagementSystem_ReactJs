import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Accordion, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { 
    createQuiz, 
    updateQuiz, 
    addQuestion, 
    deleteQuestion, 
    addOption, 
    updateOption, 
    deleteOption 
} from '../../../features/quizzes/quizSlice';

interface QuizManagerModalProps {
    show: boolean;
    onHide: () => void;
    lesson: any;
}

const QuizManagerModal: React.FC<QuizManagerModalProps> = ({ show, onHide, lesson }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading: globalLoading } = useSelector((state: RootState) => state.quiz);

    const [quizData, setQuizData] = useState<any>(null);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [editingQuizDetail, setEditingQuizDetail] = useState(false);

    useEffect(() => {
        if (lesson?.quiz) {
            setQuizData(lesson.quiz);
        } else {
            setQuizData(null);
        }
    }, [lesson]);

    const handleCreateInitialQuiz = async () => {
        try {
            const action = await dispatch(createQuiz({ 
                lessonId: lesson.id, 
                data: { 
                    title: `${lesson.title} Quiz`, 
                    description: 'Initial quiz description', 
                    passingScore: 60,
                    questions: [] 
                } 
            }));
            if (createQuiz.fulfilled.match(action)) {
                setQuizData(action.payload);
            }
        } catch (err) {
            alert("Failed to create quiz");
        }
    };

    const handleUpdateQuizMeta = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            passingScore: Number(formData.get('passingScore'))
        };
        try {
            const action = await dispatch(updateQuiz({ quizId: quizData.id, data }));
            if (updateQuiz.fulfilled.match(action)) {
                setEditingQuizDetail(false);
                setQuizData({ ...quizData, ...data });
            }
        } catch (err) {
            alert("Update failed");
        }
    };

    const handleAddNewQuestion = async () => {
        if (!newQuestionText.trim()) return;
        try {
            const action = await dispatch(addQuestion({ 
                quizId: quizData.id, 
                data: { text: newQuestionText, points: 10 } 
            }));
            if (addQuestion.fulfilled.match(action)) {
                setQuizData({
                    ...quizData,
                    questions: [...(quizData.questions || []), action.payload]
                });
                setNewQuestionText('');
            }
        } catch (err) {
            alert("Failed to add question");
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!window.confirm("Delete this question?")) return;
        try {
            const action = await dispatch(deleteQuestion(id));
            if (deleteQuestion.fulfilled.match(action)) {
                setQuizData({
                    ...quizData,
                    questions: quizData.questions.filter((q: any) => q.id !== id)
                });
            }
        } catch (err) {
            alert("Delete failed");
        }
    };

    const handleAddOption = async (questionId: string) => {
        const text = prompt("Enter option text:");
        if (!text) return;
        try {
            const action = await dispatch(addOption({ questionId, data: { text, isCorrect: false } }));
            if (addOption.fulfilled.match(action)) {
                const updatedQuestions = quizData.questions.map((q: any) => {
                    if (q.id === questionId) {
                        return { ...q, options: [...(q.options || []), action.payload] };
                    }
                    return q;
                });
                setQuizData({ ...quizData, questions: updatedQuestions });
            }
        } catch (err) {
            alert("Failed to add option");
        }
    };

    const toggleOptionCorrectness = async (questionId: string, option: any) => {
        try {
            const action = await dispatch(updateOption({ optionId: option.id, data: { isCorrect: !option.isCorrect } }));
            if (updateOption.fulfilled.match(action)) {
                const updatedQuestions = quizData.questions.map((q: any) => {
                    if (q.id === questionId) {
                        return {
                            ...q,
                            options: q.options.map((o: any) => 
                                o.id === option.id ? { ...o, isCorrect: !o.isCorrect } : o
                            )
                        };
                    }
                    return q;
                });
                setQuizData({ ...quizData, questions: updatedQuestions });
            }
        } catch (err) {
            alert("Failed to update option");
        }
    };

    const handleDeleteOption = async (questionId: string, optionId: string) => {
        try {
            const action = await dispatch(deleteOption(optionId));
            if (deleteOption.fulfilled.match(action)) {
                const updatedQuestions = quizData.questions.map((q: any) => {
                    if (q.id === questionId) {
                        return { ...q, options: q.options.filter((o: any) => o.id !== optionId) };
                    }
                    return q;
                });
                setQuizData({ ...quizData, questions: updatedQuestions });
            }
        } catch (err) {
            alert("Delete failed");
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered className="quiz-manager-modal">
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold text-dark-primary">
                    Quiz Manager: <span className="text-primary">{lesson?.title}</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4" style={{ backgroundColor: '#f8fafc', maxHeight: '70vh', overflowY: 'auto' }}>
                {!quizData ? (
                    <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
                        <i className="bi bi-patch-question text-primary-light" style={{ fontSize: '4rem' }}></i>
                        <h4 className="mt-3 fw-bold">No Quiz Yet</h4>
                        <p className="text-secondary">Create a quiz to test your students' knowledge.</p>
                        <Button 
                            variant="primary" 
                            onClick={handleCreateInitialQuiz}
                            disabled={globalLoading}
                        >
                            {globalLoading ? 'Creating...' : 'Create Quiz Now'}
                        </Button>
                    </div>
                ) : (
                    <div className="quiz-content">
                        <div className="bg-white p-3 rounded-4 border shadow-sm mb-4">
                            {!editingQuizDetail ? (
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="fw-bold mb-1">{quizData.title}</h5>
                                        <p className="text-secondary mb-0 small">{quizData.description}</p>
                                        <Badge bg="info" className="mt-2">Passing Score: {quizData.passingScore}%</Badge>
                                    </div>
                                    <Button variant="light" size="sm" onClick={() => setEditingQuizDetail(true)}>
                                        <i className="bi bi-pencil"></i> Edit Details
                                    </Button>
                                </div>
                            ) : (
                                <Form onSubmit={handleUpdateQuizMeta}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="small fw-bold">Title</Form.Label>
                                        <Form.Control name="title" defaultValue={quizData.title} required />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="small fw-bold">Passing Score (%)</Form.Label>
                                        <Form.Control type="number" name="passingScore" defaultValue={quizData.passingScore} required />
                                    </Form.Group>
                                    <div className="d-flex gap-2">
                                        <Button size="sm" variant="primary" type="submit">Save</Button>
                                        <Button size="sm" variant="light" onClick={() => setEditingQuizDetail(false)}>Cancel</Button>
                                    </div>
                                </Form>
                            )}
                        </div>

                        <Accordion className="mb-4">
                            {quizData.questions?.map((question: any, qIdx: number) => (
                                <Accordion.Item eventKey={qIdx.toString()} key={question.id} className="mb-2">
                                    <Accordion.Header>
                                        <div className="d-flex justify-content-between align-items-center w-100 me-3">
                                            <span>{question.text}</span>
                                            <Badge bg="secondary">{question.points} pts</Badge>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="small fw-bold">Options</span>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleAddOption(question.id)}>Add Option</Button>
                                        </div>
                                        {question.options?.map((option: any) => (
                                            <div key={option.id} className="d-flex align-items-center justify-content-between p-2 border rounded mb-1">
                                                <div onClick={() => toggleOptionCorrectness(question.id, option)} style={{ cursor: 'pointer' }}>
                                                    <i className={`bi ${option.isCorrect ? 'bi-check-circle-fill text-success' : 'bi-circle'} me-2`}></i>
                                                    {option.text}
                                                </div>
                                                <Button variant="link" className="text-danger p-0" onClick={() => handleDeleteOption(question.id, option.id)}>
                                                    <i className="bi bi-trash"></i>
                                                </Button>
                                            </div>
                                        ))}
                                        <Button variant="outline-danger" size="sm" className="mt-3 w-100" onClick={() => handleDeleteQuestion(question.id)}>Delete Question</Button>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>

                        <div className="bg-white p-3 rounded-4 border shadow-sm">
                            <h6 className="fw-bold mb-3">Add New Question</h6>
                            <div className="d-flex gap-2">
                                <Form.Control 
                                    placeholder="Enter question text..." 
                                    value={newQuestionText}
                                    onChange={(e) => setNewQuestionText(e.target.value)}
                                />
                                <Button variant="primary" onClick={handleAddNewQuestion} disabled={globalLoading}>Add</Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default QuizManagerModal;
