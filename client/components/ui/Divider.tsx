import React from 'react'

interface DividerProps {
  className?: string;
}
export default function Divider({ className}: DividerProps) {

  return (
    // <div className="border-t border-gray-500 w-full"></div>
    <div className={`border-t border-gray-500 w-full ${className}`}></div>
  )
}
