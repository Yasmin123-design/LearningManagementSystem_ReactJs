import React, { useState } from 'react';
import { Button, Card, ProgressBar, Badge, ListGroup } from 'react-bootstrap';

interface QuizViewProps {
    quiz: any;
    onComplete: (score: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                <i className="bi bi-exclamation-triangle text-warning display-4"></i>
                <h4 className="mt-3 fw-bold">No questions available in this quiz.</h4>
                <p className="text-secondary">Please contact your instructor.</p>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentIndex];
    const totalQuestions = quiz.questions.length;
    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    const handleOptionSelect = (optionId: string) => {
        setSelectedOptions({
            ...selectedOptions,
            [currentQuestion.id]: optionId
        });
    };

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            calculateResults();
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const calculateResults = () => {
        let correctCount = 0;
        quiz.questions.forEach((q: any) => {
            const selectedId = selectedOptions[q.id];
            const correctOption = q.options.find((o: any) => o.isCorrect);
            if (selectedId === correctOption?.id) {
                correctCount++;
            }
        });
        const finalScore = (correctCount / totalQuestions) * 100;
        setShowResults(true);
        onComplete(finalScore);
    };

    if (showResults) {
        const correctCount = quiz.questions.filter((q: any) => {
            const selectedId = selectedOptions[q.id];
            const correctOption = q.options.find((o: any) => o.isCorrect);
            return selectedId === correctOption?.id;
        }).length;
        const score = (correctCount / totalQuestions) * 100;
        const isPassed = score >= (quiz.passingScore || 60);

        return (
            <div className="quiz-results-container text-center py-5 px-3 bg-white rounded-4 shadow-lg border">
                <div className="mb-4">
                    {isPassed ? (
                        <div className="success-animation">
                            <i className="bi bi-trophy-fill text-warning" style={{ fontSize: '5rem' }}></i>
                            <h2 className="fw-bold mt-3 text-success">Congratulations!</h2>
                            <p className="text-secondary">You passed the quiz with flying colors.</p>
                        </div>
                    ) : (
                        <div className="fail-animation">
                            <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '5rem' }}></i>
                            <h2 className="fw-bold mt-3 text-danger">Good Try!</h2>
                            <p className="text-secondary">You didn't reach the passing score. Keep practicing!</p>
                        </div>
                    )}
                </div>

                <div className="score-display mb-5 p-4 rounded-4 bg-light d-inline-block px-5">
                    <span className="d-block text-secondary text-uppercase fw-bold small mb-1">Your Score</span>
                    <h1 className={`display-3 fw-bold mb-0 ${isPassed ? 'text-success' : 'text-danger'}`}>
                        {Math.round(score)}%
                    </h1>
                    <Badge bg={isPassed ? 'success' : 'danger'} className="mt-2 px-3 py-2">
                        {isPassed ? 'PASSED' : 'FAILED'} (Passing: {quiz.passingScore || 60}%)
                    </Badge>
                </div>

                <div className="details-grid mb-4">
                    <div className="d-flex justify-content-center gap-4 text-center">
                        <div>
                            <h4 className="fw-bold mb-0">{totalQuestions}</h4>
                            <span className="text-secondary small">Total Questions</span>
                        </div>
                        <div className="border-start ps-4">
                            <h4 className="fw-bold mb-0 text-success">{correctCount}</h4>
                            <span className="text-secondary small">Correct</span>
                        </div>
                        <div className="border-start ps-4">
                            <h4 className="fw-bold mb-0 text-danger">{totalQuestions - correctCount}</h4>
                            <span className="text-secondary small">Wrong</span>
                        </div>
                    </div>
                </div>

                <Button variant="primary" className="btn-primary-lg px-5" onClick={() => window.location.reload()}>
                    Back to Course
                </Button>
            </div>
        );
    }

    return (
        <Card className="quiz-view-card border-0 shadow-lg rounded-4 overflow-hidden">
            <Card.Header className="bg-white p-4 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <Badge bg="primary-light" className="text-primary fw-bold text-uppercase px-3 py-2 mb-2" style={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                            Question {currentIndex + 1} of {totalQuestions}
                        </Badge>
                        <h4 className="fw-bold text-dark-primary m-0">{quiz.title}</h4>
                    </div>
                    <div className="text-end">
                        <span className="text-secondary small fw-bold">PROGRESS</span>
                        <div className="fw-bold text-brand">{Math.round(progress)}%</div>
                    </div>
                </div>
                <ProgressBar now={progress} variant="primary" style={{ height: '8px' }} className="rounded-pill shadow-sm" />
            </Card.Header>
            <Card.Body className="p-4 p-lg-5">
                <div className="question-content mb-5">
                    <h3 className="fw-bold text-dark-primary mb-4" style={{ lineHeight: '1.4' }}>
                        {currentQuestion.text}
                    </h3>
                    
                    <ListGroup className="options-list border-0">
                        {currentQuestion.options?.map((option: any) => (
                            <ListGroup.Item 
                                key={option.id}
                                className={`option-item p-3 mb-3 rounded-4 border-2 transition-all cursor-pointer d-flex align-items-center gap-3 ${
                                    selectedOptions[currentQuestion.id] === option.id 
                                    ? 'border-primary bg-primary-soft shadow-sm' 
                                    : 'border-light hover-border-secondary'
                                }`}
                                onClick={() => handleOptionSelect(option.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={`option-radio flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle ${
                                    selectedOptions[currentQuestion.id] === option.id 
                                    ? 'bg-primary text-white border-primary' 
                                    : 'border text-transparent'
                                }`} style={{ width: '24px', height: '24px', border: '2px solid' }}>
                                    {selectedOptions[currentQuestion.id] === option.id && <i className="bi bi-check" style={{ fontSize: '1.2rem' }}></i>}
                                </div>
                                <span className={`fs-5 ${selectedOptions[currentQuestion.id] === option.id ? 'fw-bold text-primary' : 'text-dark-secondary'}`}>
                                    {option.text}
                                </span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>

                <div className="quiz-navigation d-flex justify-content-between align-items-center pt-4 border-top">
                    <Button 
                        variant="link" 
                        className="text-secondary text-decoration-none fw-bold d-flex align-items-center gap-2 p-0"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        <i className="bi bi-arrow-left"></i> Previous Question
                    </Button>

                    <Button 
                        variant="primary" 
                        className="btn-primary-lg px-5 shadow-sm" 
                        disabled={!selectedOptions[currentQuestion.id]}
                        onClick={handleNext}
                    >
                        {currentIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'} <i className="bi bi-arrow-right ms-2"></i>
                    </Button>
                </div>
            </Card.Body>

            <style>{`
                .bg-primary-soft { background-color: #f0f7ff; }
                .hover-border-secondary:hover { border-color: #cbd5e1 !important; }
                .transition-all { transition: all 0.2s ease-in-out; }
                .text-primary-light { color: #4f46e5; border: 1px solid #e0e7ff; }
            `}</style>
        </Card>
    );
};

export default QuizView;
