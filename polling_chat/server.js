const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const messages = [];
let lastMessageId = 0;

app.get('/messages', (req, res) => {
  const clientLastMessageId = parseInt(req.query.lastId || '0');
  
  const newMessages = messages.filter(msg => msg.id > clientLastMessageId);
  
  res.json({
    messages: newMessages,
    lastMessageId: messages.length > 0 ? messages[messages.length - 1].id : 0
  });
});

app.post('/messages', (req, res) => {
  lastMessageId++;
  const message = {
    ...req.body,
    id: lastMessageId,
    timestamp: new Date().toLocaleString()
  };
  messages.push(message);
  res.status(201).json(message);
});

app.listen(PORT, () => {
  console.log(`HTTP Polling Chat Server running on port ${PORT}`);
});