
export interface UserProfile {
    userId: string;
    username: string;
}

export interface ChatMessage {
    id: string;
    content: string;
    senderId: string;
    roomId: string;
    createdAt: string;
    sender: {
        username: string;
    };
}

export interface ChatRoom {
    id: string;
    name: string;
    _count?: {
        messages: number;
    };
}