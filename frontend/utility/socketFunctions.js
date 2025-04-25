import 'https://cdn.socket.io/4.8.1/socket.io.min.js';
import { Game } from './state.js';

// @ts-ignore
export const socket =  io();

/** joins a room by emitting the "joinRoom" event, which is defined in the socket handlers. */
export function joinRoom(number) {
    socket.emit("joinRoom", number, (ack) => { // ack is a acknowledgement message, if everything goes right
        // do something here
    });
}

/** Sends a message, by emitting the "sendMessage" event, which is defined in the socket handlers. */
export function sendMessage(room, text) {
    socket.emit("sendMessage", ({sender: socket.id, room: room, text: text }), (ack) => {
        // do something here
    });
}

/** emits the gameUpdate event, which tells a room to update its game status */
export function gameUpdate(gameCode) {
    socket.emit("gameUpdate", gameCode, (ack) => {
        // do something here
    })
}

// tells what to do, when the server emits the joinRoom event someone joins a room
socket.on('joinRoom', (msg) => {
    // console.loq('Joined room:', msg);
});

// tells what to do, when the server emits the message event someone joins a room
socket.on("message", (msg) => {
    // console.loq("message", msg.text, "from", msg.sender)
});

