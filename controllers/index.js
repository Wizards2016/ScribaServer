const db = require('../db');

module.exports = {
  messages: {
    get: function (req, res) {
      console.log('get req: ', req.query);
      db.Message.findAll({})
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log('error: ', error);
      });
    },
    post: function (req, res) {
      if (req.body.text.length < 1) {
        res.sendStatus(406);
      } else {
        db.Message.create({
          text: req.body.text
        })
        .then(() => {
          res.sendStatus(201);
        });
      }
    }
  }
};
