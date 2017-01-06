const express = require('express');
const app = express();
const controller = require('./controllers');
const router = require('express').Router();
const parser = require('body-parser');

app.use(parser.json());
app.use('/', router);

router.get('/messages', controller.messages.get);
router.post('/messages', controller.messages.post);
router.post('/users', controller.users.post);
router.post('/votes', controller.users.post);

const server = app.listen(8000, () => {
  const port = server.address().port;
  console.log('Listening on port', port);
});

module.exports = server;
