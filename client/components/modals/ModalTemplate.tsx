import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";

interface ModalTemplateProps {
    label?: string;
    visible?: boolean;
    onClose?: () => void;
    children?: React.ReactNode; 
}

export default function ModalTemplate({
    visible,
    label,
    onClose,
    children,
}: ModalTemplateProps) {
    return (
        <Modal 
            onClose={onClose}
            isOpen={visible} 
            closeButton
        >
            <ModalContent>
                <ModalHeader>{label}</ModalHeader>
                <ModalBody>{children}</ModalBody>
            </ModalContent>
        </Modal>
    )
}
