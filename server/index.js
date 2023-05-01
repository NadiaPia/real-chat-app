const express = require("express");
const app = express();
const http = require("http");  //to build server with the socket.io
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app); //to generate a server

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);

    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});



server.listen(3001, () => {
    console.log("SEVER RUNNING ON PORT 3001");
});