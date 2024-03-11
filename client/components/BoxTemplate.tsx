import React from 'react'

interface ChatWithProps {
  name: string;
  uid: string;
}
interface BoxTemplateProps {
  id: string,
  timestamp?: any,
  chatWith?: ChatWithProps[],
  boxStyle?: string,
  textStyle?: string
  message?: string;

}

export default function BoxTemplate({ message, textStyle, boxStyle, chatWith, id, timestamp}: BoxTemplateProps) {
  let formattedParticipantList = '';

  if (chatWith && chatWith.length > 0) {
    const participantList = chatWith.map(participant => participant.name);

    if (participantList.length === 1) {
      formattedParticipantList = participantList[0];
    } else {
      formattedParticipantList = participantList.join(', ');
    }
  }


  return (
    <div className={boxStyle}>
      <p>{!message ? 'No message' : message}</p>
      <p className={textStyle}>
       {chatWith ? formattedParticipantList : null }
      </p>
      <p>{timestamp}</p>
    </div>
  )
}
