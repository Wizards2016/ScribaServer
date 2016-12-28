const Sequelize = require('sequelize');
const db = new Sequelize('scribedb', 'root', '');

const Message = db.define('Message', {
  text: Sequelize.STRING
});

Message.sync();

exports.Message = Message;
