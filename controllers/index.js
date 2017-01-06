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
      //do the folowing only if user exists on database

      if (req.body.delete === true) {
        db.Messages.destroy({
            where: {
              id: parseInt(req.body.id)
            }
        })
        .then(() => res.json({status: 'deleted'}))
      } else if (req.body.text.length < 1 || !req.body.latitude || !req.body.longitude) {
        res.sendStatus(406);
      } else {
        if(!req.body.userAuth){
          req.body.userAuth = 'anonymous';
        }
        db.Users.findOrCreate({
          where: {
            userAuth: req.body.userAuth
          }
        }).then((user)=>{
          db.Messages.create({
            text: req.body.text,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            userAuth: req.body.userAuth,
            UserId: user[0].dataValues.id
          })
          .then(() => {
            res.sendStatus(201);
          });
        });
      }
    }
  },
  votes: {
    //post:
      //if no thumbs up or down
        //delete if exists
      //else findorcreate vote
        //vote up/down
        //userid
        //messageid
        //if up add to up
        //if down add to down
    post: function(req, res) {
      if(typeof req.body.vote === boolean){
        db.Votes.findOrCreate({
          where: {
            vote: req.body.vote,
            userId: req.body.userId,
            messageId: req.body.messageId
          }
        });
      } else {
        db.Votes.destroy({
          where: {
            userId: req.body.userId,
            messageId: req.body.messageId
          }
        });
      }
    }
  },
  users:{
    //post:
      //create user
        //userid
        //displayname
        //upvote
        //downvote
        //total posts
    post: function(req, res) {
      db.Users.create({
        userId: req.body.userId,
        displayName: req.body.displayName,
        userAuth: req.body.userAuth
      })
    }
  }
};
