const express = require('express');
const app = express();
const controller = require('./controllers');
const router = require('express').Router();
const parser = require('body-parser');

app.use(parser.json());
app.use('/', router);

router.get('/messages', controller.messages.get);
router.post('/messages', controller.messages.post);
router.get('/users', controller.users.get);
router.post('/users', controller.users.post);
router.get('/votes', controller.votes.get);
router.post('/votes', controller.votes.post);


const server = app.listen(8000, () => {
  const port = server.address().port;
  console.log('Listening on port', port);
});

module.exports = server;
