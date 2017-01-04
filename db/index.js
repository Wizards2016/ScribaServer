const Sequelize = require('sequelize');
const db = new Sequelize('scribedb', 'root', '');

const Message = db.define('Message', {
  text: Sequelize.STRING,
  // location
  latitude: Sequelize.DOUBLE(12, 7),
  longitude: Sequelize.DOUBLE(12, 7),
  // user
  userId: Sequelize.STRING
  // catagory
  // sub-catagory
  // vote up
  // votes down
});

const Users = db.define('Users', {
  // display username
  // unique login userId
  text: Sequelize.STRING
});

// Message.belongsTo(User);
// User.hasMany(message);

Message.sync();
Users.sync();

exports.Message = Message;
exports.Users = Users;
