const http = require('http');
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');
const app = require('./app');
const config = require('./config');
const { initRealtime } = require('./services/realtime');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST']
  }
});

initRealtime(io);

app.use('/peerjs', ExpressPeerServer(server, {
  proxied: true,
  debug: config.nodeEnv !== 'production'
}));

server.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
