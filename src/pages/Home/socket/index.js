/* eslint-disable import/prefer-default-export */
import io from "socket.io-client";
import { SOCKET_URL } from "../../../constants";

export function initSocket(handleSocketData) {
  const socket = io("https://explorer-test.aelf.io/", {
    path: SOCKET_URL,
    transports: ["websocket", "polling"],
  });

  socket.on("reconnect_attempt", () => {
    socket.io.opts.transports = ["polling", "websocket"];
  });
  socket.on("connection", (data) => {
    if (data !== "success") {
      throw new Error("can't connect to socket");
    }
  });

  let isFirst = true;
  socket.on("getBlocksList", (data) => {
    if (isFirst) {
      handleSocketData(data, true);
      isFirst = false;
    } else {
      handleSocketData(data);
    }
  });

  socket.emit("getBlocksList");
  return socket;
}
