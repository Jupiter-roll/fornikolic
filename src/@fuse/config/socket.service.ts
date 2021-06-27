import {io} from 'socket.io-client';
import {environment} from "../../environments/environment";

export class SocketService {
    socket;
    constructor() {
    }

    setupSocketConnection() {
        this.socket = io(environment.websocketUrl, {forceNew: true});
        this.socket.emit('my message', 'Hello there from Angular')
    }
}
