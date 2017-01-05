var db = require('./db/index.js');
var Messages = db.Messages;

db.Messages.create({
  text: 'Free couch',
  latitude: 37.3344314,
  longitude: -122.0336186,
  userAuth: 'Thomas Cruise'
})
.then(function () {
  return db.Messages.create({
  text: 'Lost my dog :\\',
  latitude: 37.3323314,
  longitude: -122.0333786,
  userAuth: 'Thomas Cruise'
  });
})
.then(function () {
  return db.Messages.create({
  text: 'Dog found',
  latitude: 37.3303316,
  longitude: -122.0332196,
  userAuth: 'Thomas Cruise'
  });
})
.then(function () {
  return db.Messages.create({
  text: 'Yard Sale!',
  latitude: 37.3323314,
  longitude: -122.0342186,
  userAuth: 'Thomas Cruise'
  });
})
.then(function () {
  return db.Messages.create({
  text: 'bus stop moved',
  latitude: 37.3303314,
  longitude: -122.0312186,
  userAuth: 'Thomas Cruise'
  });
})
.then(function () {
  return db.Messages.create({
  text: 'Pretty trees',
  latitude: 37.3303314,
  longitude: -122.0352186,
  userAuth: 'Thomas Cruise'
  });
})
.then(function () {
  return db.Messages.create({
  text: 'Street performers',
  latitude: 37.3323314,
  longitude: -122.0372186,
  userAuth: 'Thomas Cruise'
  });
})
.then(function () {
  return db.Messages.create({
  text: 'Best rootbeer!',
  latitude: 37.3313214,
  longitude: -122.0317106,
  userAuth: 'Thomas Cruise'
  });
})
.then(function () {
  process.exit();
});
