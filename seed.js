const db = require('./db/index.js');
const Messages = db.Messages;
const Users = db.Users;
const Votes = db.Votes;

Users.create({
  displayName: 'ThomasCruise',
  userAuth: 'Thomas Cruise',
  upVotes: 1,
  downVotes: 1,
  totalPosts: 8
}).then(function () {
  db.Messages.create({
    text: 'Free couch',
    latitude: 37.3344314,
    longitude: -122.0336186,
    userAuth: 'Thomas Cruise',
    UserDisplayName: 'ThomasCruise'
  });
})
.then(() => {
  Messages.create({
    text: 'Lost my dog :\\',
    latitude: 37.3323314,
    longitude: -122.0333786,
    userAuth: 'Thomas Cruise',
    UserDisplayName: 'ThomasCruise'
  });
})
.then(() => {
  Messages.create({
    text: 'Dog found',
    latitude: 37.3303316,
    longitude: -122.0332196,
    userAuth: 'Thomas Cruise',
    UserDisplayName: 'ThomasCruise'
  });
})
.then(() => {
  Messages.create({
    text: 'Yard Sale!',
    latitude: 37.3323314,
    longitude: -122.0342186,
    userAuth: 'Thomas Cruise',
    UserDisplayName: 'ThomasCruise'
  });
})
.then(function () {
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
  Messages.create({
    text: 'Pretty trees',
    latitude: 37.3303314,
    longitude: -122.0352186,
    userAuth: 'Thomas Cruise',
    UserDisplayName: 'ThomasCruise'
  });
})
.then(() => {
  Messages.create({
    text: 'Street performers',
    latitude: 37.3323314,
    longitude: -122.0372186,
    userAuth: 'Thomas Cruise',
    UserDisplayName: 'ThomasCruise'
  });
})
.then(function () {
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
  Votes.create({
    vote: true,
    UserDisplayName: 'ThomasCruise',
    MessageId: 8
  });
})
.then(() => {
  Votes.create({
    vote: false,
    UserDisplayName: 'ThomasCruise',
    MessageId: 5
  });
})
.then(() => {
  process.exit();
});
