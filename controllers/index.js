const db = require('../db');

module.exports = {
  messages: {
    get: function (req, res) {
      if (req.query.latitude && req.query.longitude) {
        const latitude = parseFloat(req.query.latitude);
        const longitude = parseFloat(req.query.longitude);
        const viewDistance = parseFloat(req.query.distance) || 1;
        db.Messages.findAll({
          where: {
            latitude: {
              $between: [latitude - viewDistance, latitude + viewDistance]
            },
            longitude: {
              $between: [longitude - viewDistance, longitude + viewDistance]
            }
          }
        })
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          console.log('error: ', error);
        });
      } else {
        db.Messages.findAll({})
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          console.log('error: ', error);
        });
      }
    },
    post: function (req, res) {
      // post delete request
      if (req.body.delete === true) {
        db.Messages.find({
          where: {
            id: parseInt(req.body.id)
          }
        })
        .then((found)=>{
          //find if message exists with that displayName
          if(found && found.UserDisplayName === req.body.displayName){
            // delete message
            db.Messages.destroy({
                where: {
                  id: parseInt(req.body.id)
                }
            })
            // update totalPosts of user with given displayName
            .then(()=>{
              db.Users.find({
                where: {
                  displayName: req.body.displayName
                }
              })
              .then((user)=>{
                db.Users.update({totalPosts: user.dataValues.totalPosts-1}, {
                  where: {
                displayName: req.body.displayName
                  }
                })
              })
            })
            // delete successful
            .then(() => res.json({status: 'deleted'}))
          } else {
            // delete request rejected
            res.sendStatus(400);
          }
        })
      // post message requires: text, lext.length, latitude, and logitude
      } else if (!req.body.text || req.body.text.length < 1 || !req.body.latitude || !req.body.longitude || !req.body.displayName) {
        res.status(406);
        res.send('valid user, text, latitude, and logitude required');
      } else {
        // if no name then anonymous just for dev purposes, to remove later!
        if(!req.body.displayName){
          req.body.displayName = 'ThomasCruise';
        }
        // find and verify displayName must be valid
        db.Users.find({
          where: {
            displayName: req.body.displayName,
            userAuth: req.body.userAuth
          }
        })
        .then((result)=>{
          if(!result){
          res.status(400);
          res.send('Username not valid');
          // create message
          } else {
            db.Messages.create({
              text: req.body.text,
              latitude: req.body.latitude,
              longitude: req.body.longitude,
              UserDisplayName: req.body.displayName,
              category: req.body.category,
              subCategory: req.body.subCategory
            })
            // update users totalPosts
            .then(()=>{
              db.Users.find({
                where: {
                  displayName: req.body.displayName
                }
              })
              .then((user)=>{
                db.Users.update({totalPosts: user.dataValues.totalPosts+1}, {
                  where: {
                    displayName: req.body.displayName
                  }
                })
              })
            })
            .then(() => {
              res.status(201);
              res.send('messsage posted');
            });
          }
        });
      }
    }
  },
  votes: {
    get: function(req, res){
      db.Votes.find({
        where: {
          UserDisplayName: req.query.displayName,
          MessageId: parseInt(req.query.messageId)
        }
      })
      .then((vote) => {
        console.log(vote);
        res.json(vote);
      });
    },
    post: function(req, res) {
      // validate user
      db.Users.find({
        where: {
          displayName: req.body.displayName,
          userAuth: req.body.userAuth
        }
      })
      .then((user)=>{
        // validate message exists
        if(user){
          db.Messages.find({
            where: {
              id: req.body.messageId
            }
          })
          .then((message)=>{
          var upvoteDif = 0;
          var downvoteDif = 0;
          var boolVote = !!req.body.vote;
            if(message){
              // check vote exists
              db.Votes.find({
                where: {
                  UserDisplayName: req.body.displayName,
                  MessageId: req.body.messageId
                }
              })
              .then((vote)=>{
                if(vote && vote.dataValues.vote === req.body.vote && !req.body.delete) {
                  res.status(200);
                  res.send('vote already on record');
                } else {
                  // delete vote
                  if(req.body.delete || req.body.vote === undefined || req.body.vote === null){
                    vote.dataValues.vote ? upvoteDif-- : downvoteDif--;
                    db.Votes.destroy({
                      where: {
                        UserDisplayName: req.body.displayName,
                        MessageId: req.body.messageId
                      }
                    });
                    res.status(200);
                    res.send('vote removed');
                  // if vote not found, then create
                  } else if(!vote){
                    db.Votes.create({
                      vote: boolVote,
                      UserDisplayName: req.body.displayName,
                      MessageId: req.body.messageId
                    })
                    boolVote == true ? upvoteDif+=1 : downvoteDif+=1;
                  // if vote found, then update
                  } else {
                    db.Votes.update({vote: boolVote},{
                      where: {
                        UserDisplayName: req.body.displayName,
                        MessageId: req.body.messageId
                      }
                    });
                    vote.dataValues.vote ? upvoteDif-- : downvoteDif--;
                    boolVote ? upvoteDif++ : downvoteDif++;
                  }
                  // update message stats
                  db.Messages.update({
                      upVotes: message.dataValues.upVotes + upvoteDif,
                      downVotes: message.dataValues.downVotes + downvoteDif
                    }, {
                    where: {
                      id: req.body.messageId
                    }
                  });
                  db.Messages.find({
                    where: {
                      id: req.body.messageId
                    }
                  })
                  .then((message)=>{
                    // update user vote totals
                    db.Users.update({
                        upVotes: message.dataValues.upVotes + upvoteDif,
                        downVotes: message.dataValues.downVotes + downvoteDif
                      }, {
                      where: {
                        displayName: message.dataValues.UserDisplayName
                      }
                    })
                    .then(()=>{
                    res.status(201);
                    res.send('vote recorded');
                    });
                  }); //then message for user stats
                } // else !(vote && vote.dataValues.vote == boolVote)
              }); // then vote
            } else {
              res.status(400);
              res.send('message not valid');
            }
          }); //then message
        } else {
          res.status(400);
          res.send('user not valid');
        }
      }) //then user
    } //posts
  }, //votes
  users:{
    post: function(req, res) {
      if(!req.body.displayName || !req.body.userAuth){
        res.status(400);
        res.send('userAuth and UserDisplayName requried');
      } else {
        db.Users.find({
          where: {
            userAuth: req.body.userAuth
          }
        })
        .then((user)=>{
          if(!!user){
            res.status(400);
            res.send('User already registered');
          } else {
            db.Users.find({
              where: {
                displayName: req.body.displayName,
              }
            })
            .then((user)=>{
              if(!!user){
                res.status(400);
                res.send('User name already taken');
              } else {
                db.Users.create({
                  where: {
                    displayName: req.body.displayName,
                    userAuth: req.body.userAuth
                  }
                });
                res.status(201);
                res.send('New user created');
              }
            })
          }
        })
      }
    },
    get: function(req, res) {
      db.Users.find({
        where: {
          userAuth: req.query.userAuth
        }
      })
      .then((user)=>{
        if(!user){
          res.status(400);
          res.send('user not on database');
        } else if (user.displayName){
          res.status(200);
          res.send(user.displayName);
        } else {
          res.status(204);
          res.send('user display name required');
        }
      })
    }
  }
};
