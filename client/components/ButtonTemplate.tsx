import React from 'react'
import {Button} from "@nextui-org/react";

interface ButtonTemplateProps {
  label?: string; 
  className?: string; 
  onPress?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
}

export default function ButtonTemplate({
  label, 
  type = 'button', 
  className, 
  onPress,
  disabled = false
}: ButtonTemplateProps) {
  return (
    <Button 
      // radius="full" 
      onClick={onPress}
      className={className}
      type={type}
      disabled={disabled}
    >
      {label}
    </Button>
  )
}
