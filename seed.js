var db = require('./db/index.js');
var Messages = db.Messages;

db.Messages.create({
  text: 'Is the earth round?',
  latitude: 37.3343314,
  longitude: -122.0332186,
  userAuth: 'Thomas Cruise'
})
.then(function () {
  return db.Messages.create({
  text: 'When were dogs?',
  latitude: 37.3323314,
  longitude: -122.0332186,
  userAuth: 'Thomas Cruise'
  });
})
.then(function () {
  return db.Messages.create({
  text: 'Is it?',
  latitude: 37.3303314,
  longitude: -122.0332186,
  userAuth: 'Thomas Cruise'
  });
})
.then(function () {
  return db.Messages.create({
  text: 'This was the second best',
  latitude: 37.3323314,
  longitude: -122.0342186,
  userAuth: 'Thomas Cruise'
  });
})
.then(function () {
  return db.Messages.create({
  text: 'It just is',
  latitude: 37.3303314,
  longitude: -122.0312186,
  userAuth: 'Thomas Cruise'
  });
})
.then(function () {
  return db.Messages.create({
  text: 'The worst',
  latitude: 37.3303314,
  longitude: -122.0352186,
  userAuth: 'Thomas Cruise'
  });
})
.then(function () {
  return db.Messages.create({
  text: 'Why was it?',
  latitude: 37.3323314,
  longitude: -122.0372186,
  userAuth: 'Thomas Cruise'
  });
})
.then(function () {
  process.exit();
});
