const app = require('./app');
const connectToDB = require('./config/db');
const socket = require('socket.io');
require('dotenv').config();
const http = require('http').Server(app);

//? Connection with the DB
connectToDB();

//? server setup
http.listen(process.env.PORT, () => {
    console.log(`Server is up and runnning at port ${process.env.PORT}`);
});

const socketIO = socket(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

//* This is a type of global variable 
global.onlineUsers = new Map();

socketIO.on('connection', (socket) => {

    global.chatSocket = socket;

    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        // console.log(onlineUsers);
    });

    socket.on("send-msg", (data) => {
        let sendUserSocket = onlineUsers.get(data.to);
        console.log(data);
        if(sendUserSocket)
            socket.to(sendUserSocket).emit("msg-receive", data.msg);
    });

});



