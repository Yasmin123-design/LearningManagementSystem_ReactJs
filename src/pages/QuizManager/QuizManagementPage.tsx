import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchQuizByLesson, updateQuiz, addQuestion, deleteQuestion, updateOption, addOption, deleteOption } from '../../features/quizzes/quizSlice';
import type { AppDispatch } from '../../app/store';
import DashboardLayout from '../../layouts/Dashboard/DashboardLayout';
import { Button, Form, Card, Badge, Row, Col, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import './QuizManagementPage.css';

const QuizManagementPage: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const [quizData, setQuizData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Editing States
    const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [addingOptionToQuestion, setAddingOptionToQuestion] = useState<string | null>(null);
    const [newOptionText, setNewOptionText] = useState('');

    useEffect(() => {
        if (lessonId) {
            setLoading(true);
            dispatch(fetchQuizByLesson(lessonId)).then((res) => {
                if (res.payload) {
                    setQuizData(res.payload);
                }
                setLoading(false);
            });
        }
    }, [dispatch, lessonId]);

    // Custom Confirmation Toast
    const confirmAction = (message: string, onConfirm: () => void) => {
        toast((t) => (
            <div className="d-flex flex-column gap-3 p-2">
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <div>
                        <h6 className="mb-0 fw-bold">Are you sure?</h6>
                        <p className="mb-0 small text-secondary">{message}</p>
                    </div>
                </div>
                <div className="d-flex justify-content-end gap-2 border-top pt-2">
                    <Button variant="light" size="sm" className="fw-bold" onClick={() => toast.dismiss(t.id)}>Cancel</Button>
                    <Button variant="danger" size="sm" className="fw-bold px-3" onClick={() => {
                        toast.dismiss(t.id);
                        onConfirm();
                    }}>Confirm</Button>
                </div>
            </div>
        ), {
            duration: 5000,
            position: 'top-center',
            style: {
                minWidth: '350px',
                borderRadius: '16px',
                background: '#fff',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                border: '1px solid #f1f5f9'
            },
        });
    };

    const handleSaveGeneralSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            passingScore: Number(formData.get('passingScore'))
        };
        const action = await dispatch(updateQuiz({ quizId: quizData.id, data }));
        if (updateQuiz.fulfilled.match(action)) {
            toast.success("Settings saved!");
        }
        setSaving(false);
    };

    const handleAddNewQuestion = async () => {
        const action = await dispatch(addQuestion({ 
            quizId: quizData.id, 
            data: { text: "New Question", points: 10 } 
        }));
        if (addQuestion.fulfilled.match(action)) {
            setQuizData({
                ...quizData,
                questions: [...(quizData.questions || []), action.payload]
            });
            toast.success("Question created!");
        }
    };

    const handleDeleteQuestion = (id: string) => {
        confirmAction("Delete this entire question and all its options?", async () => {
            const action = await dispatch(deleteQuestion(id));
            if (deleteQuestion.fulfilled.match(action)) {
                setQuizData({
                    ...quizData,
                    questions: quizData.questions.filter((q: any) => q.id !== id)
                });
                toast.success("Question deleted successfully!");
            }
        });
    };

    const handleStartAddingOption = (questionId: string) => {
        setAddingOptionToQuestion(questionId);
        setNewOptionText('');
    };

    const submitNewOption = async (questionId: string) => {
        if (!newOptionText.trim()) {
            setAddingOptionToQuestion(null);
            return;
        }
        const action = await dispatch(addOption({ questionId, data: { text: newOptionText, isCorrect: false } }));
        if (addOption.fulfilled.match(action)) {
            const updated = quizData.questions.map((q: any) => 
                q.id === questionId ? { ...q, options: [...(q.options || []), action.payload] } : q
            );
            setQuizData({ ...quizData, questions: updated });
            setAddingOptionToQuestion(null);
            toast.success("Option added!");
        }
    };

    const handleOptionToggle = async (questionId: string, option: any) => {
        const action = await dispatch(updateOption({ optionId: option.id, data: { isCorrect: !option.isCorrect } }));
        if (updateOption.fulfilled.match(action)) {
            const updated = quizData.questions.map((q: any) => {
                if (q.id === questionId) {
                    return {
                        ...q,
                        options: q.options.map((o: any) => o.id === option.id ? { ...o, isCorrect: !o.isCorrect } : o)
                    };
                }
                return q;
            });
            setQuizData({ ...quizData, questions: updated });
            toast.success("Correct answer set!");
        }
    };

    const handleStartEditingOption = (option: any) => {
        setEditingOptionId(option.id);
        setEditingText(option.text);
    };

    const handleSaveOptionEdit = async (questionId: string, optionId: string) => {
        if (!editingText.trim()) return;
        const action = await dispatch(updateOption({ optionId, data: { text: editingText } }));
        if (updateOption.fulfilled.match(action)) {
            const updated = quizData.questions.map((q: any) => {
                if (q.id === questionId) {
                    return {
                        ...q,
                        options: q.options.map((o: any) => o.id === optionId ? { ...o, text: editingText } : o)
                    };
                }
                return q;
            });
            setQuizData({ ...quizData, questions: updated });
            setEditingOptionId(null);
            toast.success("Option updated!");
        }
    };

    const handleDeleteOption = (questionId: string, optionId: string) => {
        confirmAction("Remove this option from the question?", async () => {
            const action = await dispatch(deleteOption(optionId));
            if (deleteOption.fulfilled.match(action)) {
                const updated = quizData.questions.map((q: any) => {
                    if (q.id === questionId) {
                        return { ...q, options: q.options.filter((o: any) => o.id !== optionId) };
                    }
                    return q;
                });
                setQuizData({ ...quizData, questions: updated });
                toast.success("Option removed.");
            }
        });
    };

    if (loading) return (
        <DashboardLayout>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        </DashboardLayout>
    );

    if (!quizData) return (
        <DashboardLayout>
            <div className="p-5 text-center">
                <h3>No Quiz Found</h3>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="quiz-management-page p-4 p-lg-5 bg-light min-vh-100">
                <div className="max-width-container mx-auto" style={{ maxWidth: '1000px' }}>
                    
                    <Card className="border-0 shadow-sm rounded-4 mb-5 overflow-hidden border-top border-primary border-4">
                        <Card.Header className="bg-white p-4 border-bottom-0 pt-5">
                            <h2 className="fw-bold text-dark-primary mb-1">Quiz Management</h2>
                            <p className="text-secondary small">Manage your quiz configuration and question set from this central dashboard.</p>
                        </Card.Header>
                        <Card.Body className="p-4 pt-0">
                            <Form onSubmit={handleSaveGeneralSettings}>
                                <Row className="g-4 mb-4">
                                    <Col md={8}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-uppercase text-secondary ls-1">Quiz Title</Form.Label>
                                            <Form.Control name="title" defaultValue={quizData.title} className="bg-light border-0 py-2 shadow-none" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-uppercase text-secondary ls-1">Passing Score (%)</Form.Label>
                                            <Form.Select name="passingScore" defaultValue={quizData.passingScore} className="bg-light border-0 py-2 shadow-none">
                                                <option value="50">50%</option>
                                                <option value="60">60%</option>
                                                <option value="70">70%</option>
                                                <option value="80">80%</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-uppercase text-secondary ls-1">Description</Form.Label>
                                            <Form.Control as="textarea" name="description" rows={3} defaultValue={quizData.description} className="bg-light border-0 shadow-none" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                                    <Button variant="danger" className="rounded-3 px-4 py-2 fw-bold d-flex align-items-center gap-2" onClick={() => toast.error("Delete functionality protected!")}>
                                        <i className="bi bi-trash-fill"></i> Delete Quiz
                                    </Button>
                                    <Button type="submit" variant="primary" className="rounded-3 px-4 py-2 fw-bold" disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold text-dark-primary m-0">Question Bank ({quizData.questions?.length || 0})</h4>
                        <Button variant="link" className="text-success text-decoration-none fw-bold p-0 d-flex align-items-center gap-2" onClick={handleAddNewQuestion}>
                            <i className="bi bi-plus-circle-fill"></i> Add New Question
                        </Button>
                    </div>

                    {quizData.questions?.map((question: any, idx: number) => (
                        <Card key={question.id} className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden animate-fade-in hover-border-primary transition-all">
                            <Card.Body className="p-4 p-lg-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <Badge bg="primary-soft" className="text-primary rounded-2 px-3 py-2 fw-bold">0{idx + 1}</Badge>
                                        <span className="text-secondary small fw-bold text-uppercase ls-1">Multiple Choice</span>
                                    </div>
                                    <i className="bi bi-copy text-secondary cursor-pointer hover-text-primary" onClick={() => toast.success("Question copied to clipboard!")}></i>
                                </div>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-uppercase text-secondary ls-1">Question Text</Form.Label>
                                    <Form.Control defaultValue={question.text} className="bg-light border-0 py-3 fs-5 shadow-none" />
                                </Form.Group>

                                <div className="options-section mb-4">
                                    <Form.Label className="small fw-bold text-uppercase text-secondary ls-1 mb-3">Answer Options</Form.Label>
                                    {question.options?.map((option: any, oIdx: number) => (
                                        <div key={option.id} className={`d-flex align-items-center gap-3 mb-2 p-3 rounded-4 border transition-all ${option.isCorrect ? 'bg-indigo-50 border-primary' : 'bg-white border-light hover-shadow-sm'}`}>
                                            <div 
                                                className={`option-letter flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all ${option.isCorrect ? 'bg-primary text-white scale-110' : 'bg-light text-secondary border'}`}
                                                style={{ width: '36px', height: '36px', cursor: 'pointer' }}
                                                onClick={() => handleOptionToggle(question.id, option)}
                                            >
                                                {String.fromCharCode(65 + oIdx)}
                                            </div>
                                            
                                            <div className="flex-grow-1">
                                                {editingOptionId === option.id ? (
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <Form.Control 
                                                            autoFocus
                                                            size="sm"
                                                            value={editingText}
                                                            onChange={(e) => setEditingText(e.target.value)}
                                                            className="border-primary shadow-none"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveOptionEdit(question.id, option.id)}
                                                        />
                                                        <i className="bi bi-check-circle-fill text-success cursor-pointer fs-5" onClick={() => handleSaveOptionEdit(question.id, option.id)}></i>
                                                        <i className="bi bi-x-circle-fill text-danger cursor-pointer fs-5" onClick={() => setEditingOptionId(null)}></i>
                                                    </div>
                                                ) : (
                                                    <span className={`fs-6 ${option.isCorrect ? 'fw-bold text-dark' : 'text-secondary'}`}>{option.text}</span>
                                                )}
                                            </div>

                                            <div className="d-flex gap-1">
                                                <button className="btn-icon-indigo" onClick={() => handleStartEditingOption(option)} disabled={editingOptionId === option.id}>
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button className="btn-icon-danger" onClick={() => handleDeleteOption(question.id, option.id)}>
                                                    <i className="bi bi-trash3-fill"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {addingOptionToQuestion === question.id ? (
                                        <div className="mt-3 p-3 rounded-4 border-2 border-dashed bg-white d-flex gap-2 animate-fade-in">
                                            <Form.Control 
                                                autoFocus
                                                placeholder="Type your new option here..." 
                                                value={newOptionText}
                                                onChange={(e) => setNewOptionText(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && submitNewOption(question.id)}
                                                className="border-0 bg-light shadow-none"
                                            />
                                            <Button size="sm" variant="primary" className="fw-bold px-3" onClick={() => submitNewOption(question.id)}>Save</Button>
                                            <Button size="sm" variant="light" onClick={() => setAddingOptionToQuestion(null)}>✕</Button>
                                        </div>
                                    ) : (
                                        <Button variant="link" className="text-primary text-decoration-none small fw-bold p-0 mt-3 d-inline-flex align-items-center gap-2 hover-shift" onClick={() => handleStartAddingOption(question.id)}>
                                            <div className="rounded-circle bg-primary-soft d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                                                <i className="bi bi-plus"></i>
                                            </div>
                                            Add Another Option
                                        </Button>
                                    )}
                                </div>

                                <div className="d-flex justify-content-end align-items-center gap-4 pt-4 border-top mt-4">
                                    <span className="text-secondary small fw-bold cursor-pointer hover-text-danger" onClick={() => handleDeleteQuestion(question.id)}>
                                        <i className="bi bi-trash me-1"></i> Delete Question
                                    </span>
                                    <Button variant="success" className="rounded-3 px-4 py-2 fw-bold shadow-sm" onClick={() => toast.success("Question changes saved!")}>Save Question</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}

                    <div 
                        className="add-question-large-btn border-2 border-dashed rounded-4 p-5 text-center mb-5 cursor-pointer hover-bg-white transition-all shadow-hover bg-white"
                        style={{ borderColor: '#cbd5e1' }}
                        onClick={handleAddNewQuestion}
                    >
                        <div className="bg-primary-soft text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '56px', height: '56px' }}>
                            <i className="bi bi-plus-lg fs-3"></i>
                        </div>
                        <h5 className="fw-bold text-dark-primary mb-1">Create New Question</h5>
                        <p className="text-secondary small mb-0">Expand your quiz with more interactive content</p>
                    </div>

                    <Row className="g-4">
                        <Col md={4}><ActionCard title="Quiz Analytics" desc="Detailed student insights." icon="bi-bar-chart-fill" bg="bg-indigo-600 text-white" /></Col>
                        <Col md={4}><ActionCard title="Publish Quiz" desc="Share with your students." icon="bi-rocket-takeoff-fill" bg="bg-white border-primary-hover" iconColor="text-primary" /></Col>
                        <Col md={4}><ActionCard title="Access Control" desc="Permissions & Privacy." icon="bi-shield-check" bg="bg-warm" iconColor="text-warm-dark" /></Col>
                    </Row>
                </div>
            </div>
            
            <style>{`
                .bg-indigo-50 { background-color: #f5f3ff; }
                .bg-indigo-600 { background-color: #4f46e5; }
                .hover-border-primary:hover { border: 1px solid #4f46e5 !important; }
                .btn-icon-indigo { border: none; background: #eef2ff; color: #4f46e5; width: 32px; height: 32px; border-radius: 8px; transition: all 0.2s; }
                .btn-icon-indigo:hover { background: #4f46e5; color: #fff; }
                .btn-icon-danger { border: none; background: #fef2f2; color: #ef4444; width: 32px; height: 32px; border-radius: 8px; transition: all 0.2s; }
                .btn-icon-danger:hover { background: #ef4444; color: #fff; }
                .hover-shift:hover { transform: translateX(5px); transition: transform 0.2s; }
                .scale-110 { transform: scale(1.1); }
            `}</style>
        </DashboardLayout>
    );
};

const ActionCard = ({ title, desc, icon, bg, iconColor }: any) => (
    <Card className={`border-0 shadow-sm rounded-4 h-100 cursor-pointer hover-scale ${bg}`} onClick={() => toast("Feature coming soon!")}>
        <Card.Body className="p-4">
            <i className={`bi ${icon} fs-3 mb-3 d-block ${iconColor}`}></i>
            <h6 className="fw-bold mb-1">{title}</h6>
            <p className="small opacity-75 mb-0">{desc}</p>
        </Card.Body>
    </Card>
);

export default QuizManagementPage;
