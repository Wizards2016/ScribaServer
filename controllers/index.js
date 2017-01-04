const db = require('../db');

module.exports = {
  messages: {
    get: function (req, res) {
      // console.log('get req: ', req.query);
      if (req.query.latitude && req.query.longitude) { // whereas here has query
        const latitude = parseFloat(req.query.latitude);
        const longitude = parseFloat(req.query.longitude);
        db.Messages.findAll({
          where: {
            latitude: {
              $between: [latitude - 1, latitude + 1]
            },
            longitude: {
              $between: [longitude - 1, longitude + 1]
            }
          }
        })
        .then((data) => {
          // console.log('data: ', data);
          res.json(data);
        })
        .catch((error) => {
          console.log('error: ', error);
        });
      } else {
        db.Messages.findAll({}) // find all with no query.
        .then((data) => {
          // console.log('data: ', data);
          res.json(data);
        })
        .catch((error) => {
          console.log('error: ', error);
        });
      }
    },
    post: function (req, res) {
      // console.log('post req: ', req.body);
      if (req.body.text.length < 1) {
        res.sendStatus(406);
      } else {
        db.Messages.create({
          text: req.body.text,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          userAuth: req.body.userAuth
        })
        .then(() => {
          res.sendStatus(201);
        });
      }
    }
  }
};
