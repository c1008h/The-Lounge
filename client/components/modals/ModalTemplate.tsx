import React from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

interface ModalTemplateProps {
    label?: string;
    content?: string;
}
export default function ModalTemplate({
    label,
    content
}: ModalTemplateProps) {
  return (
    <Modal>
        <ModalContent>
            <ModalHeader>
                {label}
            </ModalHeader>
            <ModalBody>
                <p>{content}</p>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}
