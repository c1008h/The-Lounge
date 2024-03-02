import React from 'react'
import { Modal } from '@nextui-org/react'

interface ModalTemplateProps {
    label: string;
}
export default function ModalTemplate({
    label
}: ModalTemplateProps) {
  return (
    <Modal>
      <h1>{label}</h1>
    </Modal>
  )
}
