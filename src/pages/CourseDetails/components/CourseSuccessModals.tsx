import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Check, CheckCircle } from 'lucide-react';

interface CourseSuccessModalsProps {
    showSuccessModal: boolean;
    showPaymentSuccessModal: boolean;
    onHideSuccess: () => void;
    onHidePayment: () => void;
    courseTitle: string;
}

const CourseSuccessModals: React.FC<CourseSuccessModalsProps> = ({
    showSuccessModal,
    showPaymentSuccessModal,
    onHideSuccess,
    onHidePayment,
    courseTitle
}) => {
    return (
        <>
            {/* Success Modal */}
            <Modal
                show={showSuccessModal}
                onHide={onHideSuccess}
                centered
                contentClassName="border-0 rounded-4 shadow-lg overflow-hidden"
            >
                <div className="text-center p-5">
                    <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex p-4 mb-4" style={{ width: '80px', height: '80px', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={40} className="fw-bold" />
                    </div>
                    <h2 className="fw-bold text-dark mb-3">Congratulations!</h2>
                    <p className="text-secondary mb-4 fs-lg">
                        You have successfully enrolled in <br />
                        <span className="text-dark fw-bold">"{courseTitle}"</span>
                    </p>
                    <div className="d-grid gap-3">
                        <Button
                            variant="primary"
                            className="py-3 fw-bold rounded-3 btn-premium"
                            onClick={onHideSuccess}
                        >
                            Start Learning Now
                        </Button>
                        <Button
                            variant="light"
                            className="py-3 fw-semibold text-secondary rounded-3 border-0"
                            onClick={onHideSuccess}
                        >
                            Maybe Later
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Payment Success Modal */}
            <Modal
                show={showPaymentSuccessModal}
                onHide={onHidePayment}
                centered
                contentClassName="border-0 rounded-4 shadow-lg overflow-hidden"
            >
                <div className="text-center p-5">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-4 mb-4" style={{ width: '80px', height: '80px', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={40} className="fw-bold" />
                    </div>
                    <h2 className="fw-bold text-dark mb-3">Payment Done Successfully!</h2>
                    <p className="text-secondary mb-4 fs-lg">
                        Your transaction was processed securely. <br />
                        Welcome to <span className="text-dark fw-bold">"{courseTitle}"</span>
                    </p>
                    <div className="d-grid gap-3">
                        <Button
                            variant="primary"
                            className="py-3 fw-bold rounded-3 btn-premium"
                            onClick={onHidePayment}
                        >
                            Start Learning Now
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default React.memo(CourseSuccessModals);
