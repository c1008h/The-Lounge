import React from 'react'
import {useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button} from "@nextui-org/react";

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
    // const { isOpen, onOpenChange } = useDisclosure();


    console.log("Modal is open now!")
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
