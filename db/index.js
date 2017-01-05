
const Sequelize = require('sequelize');
const db = new Sequelize('scribedb', 'root', '');

const Votes = db.define('Votes', {
  voteUp: Sequelize.BOOLEAN,
  voteDown: Sequelize.BOOLEAN
});

const Messages = db.define('Messages', {
  text: Sequelize.STRING,
  latitude: Sequelize.DOUBLE(12, 7),
  longitude: Sequelize.DOUBLE(12, 7),
  userAuth: Sequelize.STRING,
  catagory: Sequelize.STRING,
  subCatagory: Sequelize.STRING,
  upVotes: Sequelize.INTEGER,
  downVotes: Sequelize.INTEGER

});

const Users = db.define('Users', {
  displayName: Sequelize.STRING,
  userAuth: {
    type: Sequelize.STRING,
    unique: true,
  }
});

Messages.belongsTo(Users);

Votes.belongsTo(Messages);

Votes.belongsTo(Users);

Messages.sync();
Users.sync();
Votes.sync();

exports.Messages = Messages;
exports.Users = Users;
