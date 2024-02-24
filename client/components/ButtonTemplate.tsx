import React from 'react'
import {Button} from "@nextui-org/react";

interface ButtonTemplateProps {
  label?: string, 
  className?: string,
  onPress: () => void
}

export default function ButtonTemplate({label, className, onPress}: ButtonTemplateProps) {
  return (
    <Button 
      radius="full" 
      onPress={onPress}
      className={className}
    >
      {label}
    </Button>
  )
}
