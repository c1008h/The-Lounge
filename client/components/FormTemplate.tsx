import React from 'react'
import {Textarea} from "@nextui-org/react";

interface FormTemplateProps {
    label?: string;
    placeholder?: string;
    value: string;
    className?: string;
    onValueChange: (value: string) => void
}

export default function FormTemplate({
  value, 
  label, 
  placeholder, 
  className, 
  onValueChange
}: FormTemplateProps) {
  return (
    <Textarea
      label={label}
      value={value}
      placeholder={placeholder}
      className={className}
      onChange={(e) => onValueChange(e.target.value)}
    />
  )
}
