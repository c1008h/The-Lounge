import React from 'react'

interface BoxTemplateProps {
  id: string,
  timestamp?: string,
  chatWith?: string,
  boxStyle?: string,
  textStyle?: string
}

export default function BoxTemplate({ textStyle, boxStyle, chatWith, id, timestamp}: BoxTemplateProps) {
  return (
    <div className={boxStyle}>
      <p className={textStyle}>
       {chatWith}
      </p>
    </div>
  )
}
