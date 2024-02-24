import React from 'react'
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/react";

interface CardTemplateProps {
  message?: string,
  sender?: string,
  id: string,
  timestamp?: string,
  chatWith?: string
}

export default function CardTemplate({chatWith, message, sender, id, timestamp}: CardTemplateProps) {
  return (
    <Card key={id}>
      <CardBody>
        {message ? <p>{message}</p> : <p>{chatWith}</p>}
      </CardBody>
    </Card>
  )
}
