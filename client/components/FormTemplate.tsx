import React from 'react'
import {Textarea} from "@nextui-org/react";

interface FormTemplateProps {
    label?: string;
    placeholder?: string;
    className?: string;
    onValueChange: (value: string) => void
}

export default function FormTemplate({label, placeholder, className, onValueChange}: FormTemplateProps) {
  return (
    <Textarea
        label={label}
        placeholder={placeholder}
        className={className}
        onValueChange={onValueChange}
    />
  )
}
