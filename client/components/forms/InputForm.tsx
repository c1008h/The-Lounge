import React from 'react'
import {Input} from "@nextui-org/react";

interface InputFormProps {
    onValueChange?: (value: string) => void;
    onChange?: (value: string) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    className: string;
    value: string;
}

export default function InputForm({value, onKeyDown, className, onValueChange, onChange}: InputFormProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => onValueChange?.(event.target.value);

    return (
        <Input 
            onChange={handleChange}
            className={className}
            value={value}
            onKeyDown={onKeyDown}
        />
    )
}
