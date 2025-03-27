const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();
const messages = [];

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', (ws) => {
  clients.add(ws);

  ws.send(JSON.stringify({ type: 'history', messages }));

  ws.on('message', (rawMessage) => {
    const message = JSON.parse(rawMessage);
    messages.push(message);

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebSocket Chat Server running on port ${PORT}`);
});