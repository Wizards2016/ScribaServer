const db = require('./db/index.js');

// Create the Users, Messages, and Votes tables if they don't exist
db.Users.sync()
.then(() => {
  return db.Messages.sync();
})
.then(() => {
  return db.Votes.sync();
})
.then(() => {
  // Remove all items from the Users, Messages, and Votes tables
  return db.Users.destroy({
    where: {}
  });
})
.then(() => {
  return db.Messages.destroy({
    where: {}
  });
})
.then(() => {
  return db.Votes.destroy({
    where: {}
  });
})
.then(() => {
  return db.Users.create({
    displayName: 'ThomasCruise',
    userAuth: 'Thomas Cruise',
    upVotes: 1,
    downVotes: 1,
    totalPosts: 8
  });
})
.then(() => {
  return db.Messages.create({
    text: 'Free couch',
    latitude: 37.3344314,
    longitude: -122.0336186,
    userAuth: 'Thomas Cruise',
    UserDisplayName: 'ThomasCruise'
  });
})
.then(() => {
  return db.Messages.create({
    text: 'Lost my dog :\\',
    latitude: 37.3323314,
    longitude: -122.0333786,
    userAuth: 'Thomas Cruise',
    UserDisplayName: 'ThomasCruise'
  });
})
.then(() => {
  db.Messages.create({
    text: 'Dog found',
    latitude: 37.3303316,
    longitude: -122.0332196,
    userAuth: 'Thomas Cruise',
    UserDisplayName: 'ThomasCruise'
  });
})
.then(() => {
  return db.Messages.create({
    text: 'Yard Sale!',
    latitude: 37.3323314,
    longitude: -122.0342186,
    userAuth: 'Thomas Cruise',
    UserDisplayName: 'ThomasCruise'
  });
})
.then(() => {
  return db.Messages.findOne({
    where: {
      text: 'Yard Sale!'
    }
  });
})
.then((message) => {
  return db.Votes.create({
    vote: true,
    UserDisplayName: 'ThomasCruise',
    MessageId: message.dataValues.id
  });
})
.then(() => {
  return db.Messages.create({
    text: 'bus stop moved',
    latitude: 37.3303314,
    longitude: -122.0312186,
    downVotes: 1,
    userAuth: 'Thomas Cruise',
    UserDisplayName: 'ThomasCruise'
  });
})
.then(() => {
  return db.Messages.create({
    text: 'Pretty trees',
    latitude: 37.3303314,
    longitude: -122.0352186,
    userAuth: 'Thomas Cruise',
    UserDisplayName: 'ThomasCruise'
  });
})
.then(() => {
  return db.Messages.create({
    text: 'Street performers',
    latitude: 37.3323314,
    longitude: -122.0372186,
    userAuth: 'Thomas Cruise',
    UserDisplayName: 'ThomasCruise'
  });
})
.then(() => {
  return db.Messages.create({
    text: 'Best rootbeer!',
    latitude: 37.3313214,
    longitude: -122.0317106,
    upVotes: 1,
    userAuth: 'Thomas Cruise',
    UserDisplayName: 'ThomasCruise'
  });
})
.then(() => {
  return db.Messages.findOne({
    where: {
      text: 'Best rootbeer!'
    }
  });
})
.then((message) => {
  return db.Votes.create({
    vote: true,
    UserDisplayName: 'ThomasCruise',
    MessageId: message.dataValues.id
  });
})
.then(() => {
  process.exit();
});
