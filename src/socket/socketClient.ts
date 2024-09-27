import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../api";

interface SubmissionResponse {
    userId: string;
    payload: Payload;

}

interface Payload {
    response: Response,
    userId: string,
    submissionId: string
}

interface Response {
    output: string,
    status: string
}

class SocketService {
    private socket: Socket;

    constructor() {
        this.socket = io(SOCKET_URL);
        this.initialize();
    }

    private initialize() {
        this.socket.on("connect", () => {
            console.log("Connected to Socket.IO server");
        });

        this.socket.on("disconnect", () => {
            console.log("Disconnected from Socket.IO server");
        });
    }

    public setUserId(userId: string) {
        this.socket.emit("setUserId", userId);
    }

    public getSubmissionPayload() {
        return new Promise((resolve, reject) => {
            this.socket.once("submissionPayloadResponse", (response: SubmissionResponse) => {
                resolve(response);
            });

            setTimeout(() => {
                reject(new Error("Response not received within timeout"));
            }, 30000);
        });
    }

    public onConnectionId(callback: (connId: string) => void) {
        this.socket.on("connectionId", callback);
    }

}

const socketService = new SocketService();
export default socketService;
