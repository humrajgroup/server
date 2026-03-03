const jwt = require('jsonwebtoken');
const config = require('../config');

function initRealtime(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Missing token'));
      }
      socket.user = jwt.verify(token, config.jwtSecret);
      return next();
    } catch (error) {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('class:join', ({ classId }) => {
      const room = `class:${classId}`;
      socket.join(room);
      if (socket.user.role === 'student') {
        socket.join(`${room}:students`);
      }
      socket.emit('class:joined', { classId, role: socket.user.role });
    });

    socket.on('teacher:signal:all', ({ classId, signal }) => {
      if (socket.user.role !== 'teacher') return;
      io.to(`class:${classId}:students`).emit('teacher:signal', {
        fromTeacherId: socket.user.sub,
        classId,
        signal
      });
    });

    socket.on('teacher:signal:student', ({ classId, studentSocketId, signal }) => {
      if (socket.user.role !== 'teacher') return;
      io.to(studentSocketId).emit('teacher:signal:direct', {
        fromTeacherId: socket.user.sub,
        classId,
        signal
      });
    });

    socket.on('student:signal:teacher', ({ classId, teacherSocketId, signal }) => {
      if (socket.user.role !== 'student') return;
      io.to(teacherSocketId).emit('student:signal:direct', {
        fromStudentId: socket.user.sub,
        classId,
        signal
      });
    });

    socket.on('chat:send', ({ classId, message }) => {
      if (!config.features.chat) return;
      io.to(`class:${classId}`).emit('chat:message', {
        classId,
        fromUserId: socket.user.sub,
        role: socket.user.role,
        message,
        sentAt: new Date().toISOString()
      });
    });
  });
}

module.exports = { initRealtime };
