const db = require('../db');

module.exports = {
  messages: {
    get: (req, res) => {
      // get messages from specific user
      if (req.query.displayName) {
        db.Messages.findAll({
          where: {
            UserDisplayName: req.query.displayName
          }
        })
        .then((data) => {
          if (data.length > 0) {
            res.json(data);
          } else {
            res.status(400);
            res.send('no messages found for user of that displayName');
          }
        });
      // get messages for given location
      } else if (req.query.latitude && req.query.longitude) {
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
      // get all messages
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
    post: (req, res) => {
      // post delete request
      if (req.body.delete === true) {
        if (!req.body.id) {
          res.status(400);
          res.send('id for valid message required for deleting');
        } else {
          db.Messages.find({
            where: {
              id: parseInt(req.body.id, 0)
            }
          })
          .then((message) => {
            // find if message exists with that displayName
            if (message && message.UserDisplayName === req.body.displayName) {
              db.Users.find({
                where: {
                  displayName: req.body.displayName
                }
              }).then((user) => {
                if (user.userAuth === req.body.userAuth) {
                  // delete message
                  db.Messages.destroy({
                    where: {
                      id: parseInt(req.body.id, 0)
                    }
                  })
                  // update totalPosts of messages author
                  .then(() => {
                    db.Users.find({
                      where: {
                        displayName: req.body.displayName
                      }
                    })
                    .then((user) => {
                      db.Users.update({ totalPosts: user.dataValues.totalPosts - 1 }, {
                        where: {
                          displayName: req.body.displayName
                        }
                      });
                    });
                  })
                  .then(() => {
                    res.status(200);
                    res.send('message deleted');
                  });
                } else {
                  res.status(400);
                  res.send('userAuth wrong, users can only delete their own messages');
                }
              });
            } else if (!message) {
              res.status(400);
              res.send('message not found');
            } else {
              res.status(400);
              res.send('displayName not associated with that message');
            }
          });
        }
      // post message requires: text, lext.length, latitude, and logitude
      } else if (!req.body.text ||
                  req.body.text.length < 1 ||
                  !req.body.latitude ||
                  !req.body.longitude ||
                  !req.body.displayName) {
        res.status(406);
        res.send('valid user, text, latitude, and logitude required');
      } else {
        // find and verify displayName must be valid
        db.Users.find({
          where: {
            displayName: req.body.displayName,
            userAuth: req.body.userAuth
          }
        })
        .then((user) => {
          if (!user) {
            res.status(400);
            res.send('displayName and/or userAuth is incorrect');
          // create message
          } else {
            db.Messages.create({
              text: req.body.text,
              latitude: req.body.latitude,
              longitude: req.body.longitude,
              UserDisplayName: req.body.displayName,
              category: req.body.category,
              subCategory: req.body.subCategory,
              readRange: req.body.readRange
            })
            // update users totalPosts
            .then(() => {
              db.Users.find({
                where: {
                  displayName: req.body.displayName
                }
              })
              .then((user) => {
                db.Users.update({ totalPosts: user.dataValues.totalPosts + 1 }, {
                  where: {
                    displayName: req.body.displayName
                  }
                });
              });
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
    get: (req, res) => {
      // find a single vote
      if (req.query.displayName && req.query.messageId) {
        db.Votes.find({
          where: {
            UserDisplayName: req.query.displayName,
            MessageId: parseInt(req.query.messageId, 0)
          }
        })
        .then((vote) => {
          if (vote) {
            res.json(vote);
          } else {
            res.status(400);
            res.send('requested vote does not exist');
          }
        });
      // get all votes made by one user
      } else if (req.query.displayName && !req.query.messageId) {
        db.Votes.findAll({
          where: {
            UserDisplayName: req.query.displayName
          }
        })
        .then((votes) => {
          if (votes.length > 0) {
            res.json(votes);
          } else {
            res.status(400);
            res.send('no votes on record for that user displayName');
          }
        });
      // get all votes to a message
      } else if (req.query.messageId && !req.query.displayName) {
        db.Votes.findAll({
          where: {
            MessageId: req.query.messageId
          }
        })
        .then((votes) => {
          if (votes.length > 0) {
            res.json(votes);
          } else {
            res.status(400);
            res.send('no votes on record for that user messageId');
          }
        });
      // missing required query
      } else {
        res.status(400);
        res.send('displayName and/or MessageId required');
      }
    },
    post: (req, res) => {
      // validate user
      db.Users.find({
        where: {
          displayName: req.body.displayName,
          userAuth: req.body.userAuth
        }
      })
      .then((user) => {
        // validate message exists
        if (user) {
          db.Messages.find({
            where: {
              id: req.body.messageId
            }
          })
          .then((message) => {
            let upvoteDif = 0;
            let downvoteDif = 0;
            const boolVote = !!req.body.vote;
            if (message) {
              // check vote exists
              db.Votes.find({
                where: {
                  UserDisplayName: req.body.displayName,
                  MessageId: req.body.messageId
                }
              })
              .then((vote) => {
                if (vote && vote.dataValues.vote === req.body.vote && !req.body.delete) {
                  res.status(200);
                  res.send('vote already on record');
                } else {
                  // delete vote
                  if (req.body.delete ||
                      req.body.vote === undefined ||
                      req.body.vote === null) {
                    if (!vote) {
                      res.status(400);
                      res.send('vote to remove does not exist');
                    } else {
                      vote.dataValues.vote ? (upvoteDif -= 1) : (downvoteDif -= 1);
                      db.Votes.destroy({
                        where: {
                          UserDisplayName: req.body.displayName,
                          MessageId: req.body.messageId
                        }
                      });
                      res.status(200);
                      res.send('vote removed');
                    }
                  // if vote not found, then create
                  } else if (!vote) {
                    db.Votes.create({
                      vote: boolVote,
                      UserDisplayName: req.body.displayName,
                      MessageId: req.body.messageId
                    });
                    boolVote === true ? (upvoteDif += 1) : (downvoteDif += 1);
                    res.status(201);
                    res.send('vote created');
                  // if vote found, then update
                  } else {
                    db.Votes.update({ vote: boolVote }, {
                      where: {
                        UserDisplayName: req.body.displayName,
                        MessageId: req.body.messageId
                      }
                    });
                    vote.dataValues.vote ? (upvoteDif -= 1) : (downvoteDif -= 1);
                    boolVote ? (upvoteDif += 1) : (downvoteDif += 1);
                    res.status(201);
                    res.send('vote updated');
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
                  db.Users.find({
                    where: {
                      displayName: message.dataValues.UserDisplayName
                    }
                  })
                  .then((author) => {
                    // update user vote totals
                    db.Users.update({
                      upVotes: author.dataValues.upVotes + upvoteDif,
                      downVotes: author.dataValues.downVotes + downvoteDif
                    }, {
                      where: {
                        displayName: message.dataValues.UserDisplayName
                      }
                    });
                  }); // then message for user stats
                } // else !(vote && vote.dataValues.vote == boolVote)
              }); // then vote
            } else {
              res.status(400);
              res.send('message not valid');
            }
          }); // then message
        } else {
          res.status(400);
          res.send('user not valid');
        }
      }); // then user
    } // posts
  }, // votes
  users: {
    post: (req, res) => {
      // displayName and userAuth required
      if (req.body.displayName && req.body.userAuth) {
        db.Users.find({
          where: {
            userAuth: req.body.userAuth
          }
        })
        .then((user) => {
          // if user is not on Database yet, then see if displayName is taken
          if (!user) {
            db.Users.find({
              where: {
                displayName: req.body.displayName
              }
            })
            .then((user) => {
              // if displayName available, then create new user
              if (!user) {
                db.Users.create({
                  displayName: req.body.displayName,
                  userAuth: req.body.userAuth
                });
                res.status(201);
                res.send('New user created');
              } else {
                res.status(400);
                res.send('User displayName already taken');
              }
            });
          // if delete user account request
          } else if (req.body.delete === true) {
            // if userAuth and displayName is correct, then delete and adjust all instances
            if (req.body.displayName === user.displayName && req.body.userAuth === user.userAuth) {
              // findAll votes from the displayName
              db.Votes.findAll({
                where: {
                  UserDisplayName: user.displayName
                }
              })
              // for each vote, adjust vote counts for those messages
              .then((votes) => {
                if (votes.length > 0) {
                  let upvoteDifTotal = 0;
                  let downvoteDifTotal = 0;
                  votes.forEach((val, i) => {
                    let upvoteDif = 0;
                    let downvoteDif = 0;
                    votes[i].dataValues.vote ? (upvoteDif -= 1) : (downvoteDif -= 1);
                    votes[i].dataValues.vote ? (upvoteDifTotal -= 1) : (downvoteDifTotal -= 1);
                    db.Messages.find({
                      where: {
                        id: votes[i].dataValues.MessageId
                      }
                    })
                    .then((message) => {
                      if (message) {
                        db.Messages.update({
                          upVotes: message.dataValues.upVotes + upvoteDif,
                          downVotes: message.dataValues.downVotes + downvoteDif
                        }, {
                          where: {
                            id: votes[i].dataValues.MessageId
                          }
                        });
                      }
                    // find and update vote counts for the user who wrote the message
                      db.Users.find({
                        where: {
                          displayName: message.dataValues.UserDisplayName
                        }
                      })
                      .then((author) => {
                        if (author) {
                          db.Users.update({
                            upVotes: author.dataValues.upVotes + upvoteDifTotal,
                            downVotes: author.dataValues.downVotes + downvoteDifTotal
                          }, {
                            where: {
                              displayName: message.dataValues.UserDisplayName
                            }
                          });
                        }
                      });
                    });
                  }); // forEach vote
                  // delete all votes with displayName as its UserDisplayName
                  db.Votes.destroy({
                    where: {
                      UserDisplayName: req.body.displayName
                    }
                  });
                } // if votes.length
              }) //then vote
              // delete all votes for user's messages///////// / // /
              .then(() => {
                db.Messages.findAll({
                  where: {
                    UserDisplayName: req.body.displayName
                  }
                })
                .then((messages) => {
                  messages.forEach((val, i) => {
                    db.Votes.destroy({
                      where: {
                        MessageId: messages[i].dataValues.id
                      }
                    })
                  })
                })
                // delete all messages with displayName as its UserDisplayName
                .then(() => {
                  db.Messages.destroy({
                    where: {
                      UserDisplayName: req.body.displayName
                    }
                  });
                })
                // delete user by displayName from Users table
                .then(() => {
                  db.Users.destroy({
                    where: {
                      displayName: req.body.displayName,
                      userAuth: req.body.userAuth
                    }
                  });
                });
              });
              // response user deleted
              res.status(200);
              res.send('user account and all of their data deleted');
            // else only users can delete their own accounts
            } else {
              res.status(400);
              res.send('only users can delete their own accounts');
            }
          } else {
            res.status(400);
            res.send('user already registered');
          }
        });
      } else {
        res.status(400);
        res.send('userAuth and UserDisplayName requried');
      }
    }, // users/post
    get: (req, res) => {
      // userAuth or displayName required
      if (req.query.userAuth || req.query.displayName) {
        let userAuth = req.query.userAuth;
        let displayName = req.query.displayName;
        db.Users.find({
          where: ['userAuth=? or displayName=?', userAuth, displayName]
        })
        .then((user) => {
          // if user found reply with their displayName
          if (user) {
            res.status(200);
            res.json({ status: 200, displayName: user.displayName, upVotes: user.upVotes, downVotes: user.downVotes, totalPosts: user.totalPosts, createdAt: user.createdAt });
          } else {
            res.status(400);
            res.send('user not on database');
          }
        });
      } else {
        res.status(400);
        res.send('user userAuth required');
      }
    } // users/get
  } // users
};
