
const Sequelize = require('sequelize');
const db = new Sequelize('scribedb', 'root', '');

const Votes = db.define('Votes', {
  vote: Sequelize.BOOLEAN
});

const Messages = db.define('Messages', {
  text: Sequelize.STRING,
  latitude: Sequelize.DOUBLE(12, 7),
  longitude: Sequelize.DOUBLE(12, 7),
  category: Sequelize.STRING,
  subCategory: Sequelize.STRING,
  upVotes: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  downVotes: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  readRange: Sequelize.DOUBLE(12, 7),
});

const Users = db.define('Users', {
  displayName: {
    type: Sequelize.STRING,
    primaryKey: true,
    unique: true
  },
  userAuth: {
    type: Sequelize.STRING,
    unique: true
  },
  upVotes: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  downVotes: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  totalPosts: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

Messages.belongsTo(Users);
Votes.belongsTo(Messages);
Votes.belongsTo(Users);

exports.Votes = Votes;
exports.Messages = Messages;
exports.Users = Users;
