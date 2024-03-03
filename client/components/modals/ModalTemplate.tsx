import React from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

interface ModalTemplateProps {
    label: string;
}
export default function ModalTemplate({
    label
}: ModalTemplateProps) {
  return (
    <Modal>
        <ModalContent>
            <ModalBody>
            <h1>{label}</h1>

            </ModalBody>
        </ModalContent>
    </Modal>
  )
}
