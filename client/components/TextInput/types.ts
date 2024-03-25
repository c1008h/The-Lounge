import { Message } from "@/interfaces/Chat";

export interface MessageInputProps {
    sendMessage: (params: string, message: Message) => void;
    sessionId: string;
    uid: string | null;
    displayName: string | null;
}