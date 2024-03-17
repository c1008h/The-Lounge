import { Timestamp } from 'firebase/firestore';

export function formatTimestamp(timestamp: Timestamp | Date | string): string {
    if (timestamp instanceof Date) {
        return timestamp.toLocaleString();
    } else if (typeof timestamp === 'string') {
        return timestamp;
    } else if (timestamp instanceof Timestamp) { 
        return timestamp.toDate().toLocaleString();
    } else {
        return "Unknown";
    }
}