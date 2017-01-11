const express = require('express');
const app = express();
const controller = require('./controllers');
const router = require('express').Router();
const parser = require('body-parser');
const db = require('./db/index.js');

app.use(parser.json());
app.use('/', router);

router.get('/messages', controller.messages.get);
router.post('/messages', controller.messages.post);
router.get('/users', controller.users.get);
router.post('/users', controller.users.post);
router.get('/votes', controller.votes.get);
router.post('/votes', controller.votes.post);

// Create the tables for the database
db.Users.sync()
.then(() => {
  db.Messages.sync();
})
.then(() => {
  db.Votes.sync();
});

// Start the server
const server = app.listen(8000, () => {
  const port = server.address().port;
  console.log('Listening on port', port);
});

module.exports = server;
