var Sequelize = require('sequelize');
var db = new Sequelize('scribedb', 'root', '');


var Message = db.define('Message', {
  text: Sequelize.STRING
});

Message.sync();

exports.Message = Message;
