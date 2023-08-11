import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const gomoku_ws = Stomp.over(function(){
    return process.env.NEXT_PUBLIC_GOMOKU_SOCKET_URL && new SockJS(process.env.NEXT_PUBLIC_GOMOKU_SOCKET_URL);
});

gomoku_ws.reconnectDelay = 1000;

export {
    gomoku_ws
};