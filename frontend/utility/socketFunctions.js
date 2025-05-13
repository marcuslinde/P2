/* global io */

import 'https://cdn.socket.io/4.8.1/socket.io.min.js';

// @ts-ignore
export const socket =  io();

/** joins a room by emitting the "joinRoom" event, which is defined in the socket handlers. */
export function joinRoom(number) {
    socket.emit("joinRoom", number, () => { // ack is a acknowledgement message, if everything goes right

        // do something here
    });
}

/** Sends a message, by emitting the "sendMessage" event, which is defined in the socket handlers. */
export function sendMessage(room, text) {
    socket.emit("sendMessage", ({sender: socket.id, room: room, text: text }), () => {
        // do something here
    });
}

/** emits the gameUpdate event, which tells a room to update its game status */
export function gameUpdate(gameCode) {
    socket.emit("gameUpdate", gameCode, () => {
        // do something here
    })
}




