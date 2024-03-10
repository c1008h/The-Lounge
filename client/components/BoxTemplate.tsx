import React from 'react'

interface BoxTemplateProps {
  id: string,
  timestamp?: any,
  chatWith?: string,
  boxStyle?: string,
  textStyle?: string
  message?: string;

}

export default function BoxTemplate({ message, textStyle, boxStyle, chatWith, id, timestamp}: BoxTemplateProps) {
  return (
    <div className={boxStyle}>
      <p>{!message ? 'No message' : message}</p>
      <p className={textStyle}>
       {chatWith}
      </p>
      <p>{timestamp}</p>
    </div>
  )
}
