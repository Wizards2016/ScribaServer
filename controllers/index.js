var db = require ('../db');

module.exports = {
  messages: {
    get: function (req, res){
      console.log('get req: ', req.query);
      db.Message.findAll({})
      .then(function(data){
        console.log('data: ', data);
        res.json(data);
      })
      .catch(function(error){
        console.log('error: ', error);
      });
    },
    post: function (req, res){
      console.log('post req: ', req.body);
      db.Message.create({
        text: req.body.text
      })
      .then(function(data){
        res.sendStatus(201);
      });
    }
  }
};
