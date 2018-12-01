export interface ChatMessage {
    username: string,
    msg: string
}

export const serverPort = 3027

export interface Server {
    socketEvents: any
}