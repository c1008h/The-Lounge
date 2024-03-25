import { Message } from "@/interfaces/Chat"

export interface MessageContainerProps {
    messages: Message[];
    uid: string | null;
    displayName: string | null;
}