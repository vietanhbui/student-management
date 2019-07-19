module.exports = function (io) {
    var express = require('express');
    var router = express.Router();

    var listStudent = [];
    var sockets = [];

    io.on('connection', function (socket) {

        socket.on('JOIN_CLASS', function (data) {
            if (!sockets[data.studentId]) {
                let studentData = {
                    name: data.name,
                    studentId: data.studentId,
                    socketId: socket.id
                }
                listStudent.push(studentData);
                sockets[data.studentId] = socket.id;
            }
            socket.join(data.room);
            socket.to(data.room).emit('NEW_STUDENT_JOIN', {
                message: data.name + ' joined room ' + data.room,
                name: data.name,
                type: 'joined'
            });
        });

        socket.on('LEAVE_CLASS', function (data) {
            socket.leave(data.room);
            socket.to(data.room).emit('STUDENT_LEAVE', {
                message: data.name + ' leaved room ' + data.room,
                name: data.name,
                type: 'joined'
            });
        });

        socket.on('SEND_MESSAGE_CLASS', function (data) {
            socket.to(data.room).emit('MESSAGE_CLASS', {
                message: data.message,
                name: data.name,
                type: 'f'
            });
        });

        socket.on('JOIN_PRIVATE', data => {
            if (!sockets[data.studentId]) {
                let studentData = {
                    name: data.name,
                    studentId: data.sender,
                    socketId: socket.id
                }
                listStudent.push(studentData);
                sockets[data.sender] = socket.id;
            }
            socket.to(sockets[data.receiver]).emit('PERSONAL', {
                message: data.name + ' joined',
                sender: data.sender,
                type: 'joined'
            });
        })

        socket.on('PRIVATE_MESSAGE', data => {
            socket.to(sockets[data.receiver]).emit('PERSONAL', {
                message: data.message,
                sender: data.sender,
                type: 'f'
            });
        })

        socket.on('LEAVE_PRIVATE', data => {
            socket.to(sockets[data.receiver]).emit('PERSONAL', {
                message: data.name + ' leaved',
                sender: data.sender,
                type: 'joined'
            });
        })
    });
    return router;
}