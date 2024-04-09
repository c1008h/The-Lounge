"use client"
import React from 'react'

interface LoadingProps {
    message: string;
}
export default function Loading({ message }: LoadingProps) {
  return (
    <div>{message}</div>
  )
}
