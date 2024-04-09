import React from 'react'
import { Input } from "@nextui-org/react";

interface InputFormProps {
    onValueChange?: (value: string) => void;
    onChange?: (value: string) => void | ((event: React.ChangeEvent<HTMLInputElement>) => void);
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    value: string;
    style?:  React.CSSProperties,
    placeholder?: string;
}

export default function InputForm({style, value, placeholder='',onKeyDown, className, onValueChange, onChange}: InputFormProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => onValueChange?.(event.target.value);

    return (
        <Input 
            style={style}
            onChange={handleChange}
            className={className}
            value={value}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
        />
    )
}
