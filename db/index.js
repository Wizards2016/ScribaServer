const Sequelize = require('sequelize');
const db = new Sequelize('scribedb', 'root', '');

const Messages = db.define('Messages', {
  text: Sequelize.STRING,
  // location
  latitude: Sequelize.DOUBLE(12, 7),
  longitude: Sequelize.DOUBLE(12, 7),
  // user
  userAuth: Sequelize.STRING,
  catagory: Sequelize.STRING,
  subCatagory: Sequelize.STRING,
  upVotes: Sequelize.INTEGER,
  downVotes: Sequelize.INTEGER

});

const Users = db.define('Users', {
  displayName: Sequelize.STRING,
  loginId: {
    type: Sequelize.STRING,
    unique: true
  }
  // total votes
});

const Votes = db.define('Votes', {
  voteUp: Sequelize.BOOLEAN,
  voteDown: Sequelize.BOOLEAN
  //foreign key message
  //foreign key who voted userId
});

Messages.belongsTo(Users);
Users.hasMany(Messages);

Votes.belongsTo(Messages);
Messages.hasMany(Votes);

Votes.belongsTo(Users);
Users.hasMany(Votes);

Messages.sync();
Users.sync();
Votes.sync();

exports.Messages = Messages;
exports.Users = Users;
