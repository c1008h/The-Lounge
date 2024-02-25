export interface SessionProps {
    id: string;
    chatWith: string;
}

export interface TextMessageProps {
    id: string;
    message: string;
    sender: string;
    timestamp: string;
}
