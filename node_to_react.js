const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const SerialPort = require("serialport").SerialPort;
const Readline = require("@serialport/parser-readline").ReadlineParser;

const app = express();
const port = 4001;
const httpServer = http.createServer(app);

var reading = "";

Defining the serial port_serial
const port_serial = new SerialPort({
  path: "COM10",
  baudRate: 9600,
  parser: new Readline("\n"),
});

// The Serial port parser
const parser = new Readline();
port_serial.pipe(parser);

Read the data from the serial port_serial
parser.on("data", (line) => {
  console.log("Current temperature: ", reading);
  reading = line;
});

const server = new socketio.Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// const generateDate = () => {
//   const date = Date();
//   return date;
// };

let timeChenge;
server.on("connection", (socket) => {
  if (timeChenge) clearInterval(timeChenge);
  setInterval(() => {
    socket.emit("message", reading), 1000;
  });
});

httpServer.listen(port);
