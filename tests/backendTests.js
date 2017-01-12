const expect = require('chai').expect;
const Models = require('../db/index');
const request = require('request');
const server = require('../server');
const baseUrl = 'http://localhost:8000';

const messagesURL = `${baseUrl}/messages`;
const usersURL = `${baseUrl}/users`;
const votesURL = `${baseUrl}/votes`;

xdescribe('Server', () => {
  it('Send a status of 200 when requesting to /messages', (done) => {
    request({
      method: 'GET',
      url: messagesURL
    }, (error, response) => {
      expect(response.statusCode).to.equal(200);
    });
    done();
  });

  it('Send a status of 200 when requesting to /users', (done) => {
    request({
      method: 'GET',
      url: usersURL
    }, (error, response) => {
      expect(response.statusCode).to.equal(200);
    });
    done();
  });

  it('Send a status of 200 when requesting to /votes', (done) => {
    request({
      method: 'GET',
      url: votesURL
    }, (error, response) => {
      expect(response.statusCode).to.equal(200);
    });
    done();
  });
});

describe('API & Database', () => {
  // Create the tables
  before((done) => {
    Models.Users.sync()
      .then(() => {
        Models.Messages.sync();
      })
      .then(() => {
        Models.Votes.sync();
      })
      .then(() => {
        done();
      });
  });

  beforeEach((done) => {
    // Empty the messages, users, and votes table before the MESSAGES, USERS, and VOTES tests
    Models.Messages.destroy({
      where: {}
    })
    .then(() => {
      Models.Users.destroy({
        where: {}
      });
    })
    .then(() => {
      Models.Votes.destroy({
        where: {}
      });
    })
    .then(() => {
      done();
    });
  });

  describe('MESSAGES', () => {
    const messages = [{
      text: 'Yard Sale!',
      latitude: 37.3323314,
      longitude: -122.0342186,
      userAuth: 'Thomas Cruise',
      displayName: 'ThomasCruise'
    }, {
      text: 'Free couch',
      latitude: 39.5344314,
      longitude: -122.0336186,
      userAuth: 'Thomas Cruise',
      displayName: 'ThomasCruise'
    }];

    const position = {
      latitude: 37.3323314,
      longitude: -122.0342186
    };


    describe('GET', () => {
      beforeEach((done) => {
        // Empty the messages table
        Models.Messages.destroy({
          where: {}
        })
        .then(() => {
          // Create messages
          messages.forEach((message, index) => {
            Models.Messages.create(message)
              .then(() => {
                if (index === messages.length - 1) {
                  done();
                }
              });
          });
        });
      });

      it('Get all messages if latitude and longitude are not specified', (done) => {
        request({
          method: 'GET',
          url: messagesURL
        }, (error, response, body) => {
          expect(JSON.parse(body).length).to.equal(2);
          done();
        });
      });

      it('Get nearby messages if latitude and longitude are specified', (done) => {
        request({
          method: 'GET',
          url: messagesURL,
          qs: position
        }, (error, response, body) => {
          expect(JSON.parse(body).length).to.equal(1);
          done();
        });
      });
    });

    describe('POST', () => {
      beforeEach((done) => {
        // Empty the users and messages tables before each post test
        Models.Users.destroy({
          where: {}
        })
        .then(() => {
          Models.Messages.destroy({
            where: {}
          });
        })
        .then(() => {
          // Create a user before each post test
          Models.Users.create({
            displayName: 'Jean Valjean',
            userAuth: '1234567890'
          });
        })
        .then(() => {
          done();
        });
      });

      it('Post a message', (done) => {
        request({
          method: 'POST',
          url: messagesURL,
          json: {
            text: 'Hello world',
            latitude: 39.5344314,
            longitude: 122.0336186,
            displayName: 'Jean Valjean',
            userAuth: '1234567890'
          }
        }, (error, response) => {
          expect(response.statusCode).to.equal(201);
          done();
        });
      });

      it('Delete a message', (done) => {
        // Post a message with this user
        request({
          method: 'POST',
          url: messagesURL,
          json: {
            text: 'Hello world',
            latitude: 39.5344314,
            longitude: 122.0336186,
            displayName: 'Jean Valjean',
            userAuth: '1234567890'
          }
        }, () => {
          // Get the id of the message that was posted
          request({
            method: 'GET',
            url: messagesURL
          }, (error, response, body) => {
            const messageID = JSON.parse(body)[0].id;
            // Send a delete request for this message
            request({
              method: 'POST',
              url: messagesURL,
              json: {
                delete: true,
                id: messageID,
                displayName: 'Jean Valjean',
                userAuth: '1234567890'
              }
            }, () => {
              // Check that the message was deleted
              request({
                method: 'GET',
                url: messagesURL
              }, (error, response, body) => {
                expect(JSON.parse(body).length).to.equal(0);
                done();
              });
            });
          });
        });
      });

      it('Should not post a message if text length is less than 1', (done) => {
        // Post a message with this user
        request({
          method: 'POST',
          url: messagesURL,
          json: {
            text: '',
            latitude: 39.5344314,
            longitude: 122.0336186,
            displayName: 'Jean Valjean',
            userAuth: '1234567890'
          }
        }, () => {
          // Check that the message was not posted
          request({
            method: 'GET',
            url: messagesURL
          }, (error, response, body) => {
            expect(JSON.parse(body).length).to.equal(0);
            done();
          });
        });
      });

      it('Should not post a message if location is not given', (done) => {
        // Post a message with this user
        request({
          method: 'POST',
          url: messagesURL,
          json: {
            text: 'Hello world',
            displayName: 'Jean Valjean',
            userAuth: '1234567890'
          }
        }, () => {
          // Check that the message was not posted
          request({
            method: 'GET',
            url: messagesURL
          }, (error, response, body) => {
            expect(JSON.parse(body).length).to.equal(0);
            done();
          });
        });
      });

      it('Should respond with 404 when an invalid displayName or userAuth is given', (done) => {
        // Post a message with an incorrect user
        request({
          method: 'POST',
          url: messagesURL,
          json: {
            text: 'Hello world',
            latitude: 39.5344314,
            longitude: 122.0336186,
            displayName: 'Jean Valjohn',
            userAuth: '1234567890'
          }
        }, (error, response) => {
          // Check that the message was not posted
          expect(response.statusCode).to.equal(400);
          done();
        });
      });
    });
  });

  describe('USERS', () => {
    describe('GET', () => {
      it('Returns the user\'s display name when given userAuth', (done) => {
        Models.Users.create({
          displayName: 'Fantine',
          userAuth: '0000000000'
        })
        .then(() => {
          request({
            method: 'GET',
            url: usersURL,
            qs: {
              userAuth: '0000000000'
            }
          }, (error, response) => {
            expect(response.statusCode).to.equal(200);
            done();
          });
        });
      });
    });

    describe('POST', () => {
      beforeEach((done) => {
        // Empty the Users table before each test
        Models.Users.destroy({
          where: {}
        })
        .then(() => {
          // Create a new user
          Models.Users.create({
            displayName: 'Fantine',
            userAuth: '0000000000'
          });
        })
        .then(() => {
          done();
        });
      });

      it('Create a new user', (done) => {
        request({
          method: 'POST',
          url: usersURL,
          json: {
            displayName: 'Javert',
            userAuth: '0987654321'
          }
        }, (error, response, body) => {
          expect(response.statusCode).to.equal(201);
          expect(body).to.equal('New user created');
          done();
        });
      });

      it('Should not create a user if the displayName is taken', (done) => {
        request({
          method: 'POST',
          url: usersURL,
          json: {
            displayName: 'Fantine',
            userAuth: 'google123456'
          }
        }, (error, response, body) => {
          expect(response.statusCode).to.equal(400);
          expect(body).to.equal('User name already taken');
          done();
        });
      });
    });
  });

  describe('VOTES', () => {
    let messageID;

    beforeEach((done) => {
      Models.Votes.destroy({
        where: {}
      })
      .then(() => {
        // Create a user
        Models.Users.create({
          displayName: 'Fantine',
          userAuth: '0000000000'
        });
      })
      .then(() => {
        // Create a second user
        Models.Users.create({
          displayName: 'Jean Valjean',
          userAuth: '1234567890'
        });
      })
      .then(() => {
        // Create a message
        request({
          method: 'POST',
          url: messagesURL,
          json: {
            text: 'My name is Jean Valjean!',
            latitude: 37.3323314,
            longitude: -122.0342186,
            userAuth: '1234567890',
            displayName: 'Jean Valjean'
          }
        }, () => {
          Models.Messages.findAll({})
            .then((results) => {
              messageID = results[0].id;
            })
            .then(() => {
              done();
            });
        });
      });
    });

    describe('GET', () => {
      it('Gets the vote made by a user on a certain message', (done) => {
        // Make a vote on a message
        request({
          method: 'POST',
          url: votesURL,
          json: {
            displayName: 'Fantine',
            userAuth: '0000000000',
            messageId: messageID,
            vote: true
          }
        }, () => {
          // Get the votes from the database
          request({
            method: 'GET',
            url: votesURL,
            qs: {
              displayName: 'Fantine',
              messageId: messageID
            }
          }, (error, response, body) => {
            const parsedBody = JSON.parse(body);
            expect(parsedBody.vote).to.equal(true);
            // Note the capitalization
            expect(parsedBody.MessageId).to.equal(messageID);
            done();
          });
        });
      });
    });

    describe('POST', () => {
      it('Create a new vote for a message by a user', (done) => {
        request({
          method: 'POST',
          url: votesURL,
          json: {
            displayName: 'Fantine',
            userAuth: '0000000000',
            messageId: messageID,
            vote: true
          }
        }, (error, response) => {
          expect(response.statusCode).to.equal(201);
          done();
        });
      });

      it('Should not create a vote if incorrect user information is given', (done) => {
        request({
          method: 'POST',
          url: votesURL,
          json: {
            displayName: 'Cosette',
            userAuth: '0000000000',
            messageId: messageID,
            vote: true
          }
        }, (error, response, body) => {
          expect(response.statusCode).to.equal(400);
          expect(body).to.equal('user not valid');
          done();
        });
      });

      it('Changes a vote if it exists and the user votes differently', (done) => {
        // Make an initial upvote
        request({
          method: 'POST',
          url: votesURL,
          json: {
            displayName: 'Fantine',
            userAuth: '0000000000',
            messageId: messageID,
            vote: true
          }
        }, () => {
          // Check that there is an upvote for this message
          Models.Votes.findAll({})
            .then((results) => {
              expect(results[0].vote).to.equal(true);
            })
            .then(() => {
              // Make a downvote on the same message
              request({
                method: 'POST',
                url: votesURL,
                json: {
                  displayName: 'Fantine',
                  userAuth: '0000000000',
                  messageId: messageID,
                  vote: false
                }
              }, () => {
                // Check that there is a downvote for this message
                Models.Votes.findAll({})
                  .then((results) => {
                    expect(results[0].vote).to.equal(false);
                    done();
                  });
              });
            });
        });
      });

      it('Deletes an existing vote', (done) => {
        // Make an initial vote
        request({
          method: 'POST',
          url: votesURL,
          json: {
            displayName: 'Fantine',
            userAuth: '0000000000',
            messageId: messageID,
            vote: true
          }
        }, () => {
          // Check that the vote exists
          Models.Votes.findAll({})
            .then((results) => {
              expect(results.length).to.equal(1);
            })
            .then(() => {
              // Delete the vote
              request({
                method: 'POST',
                url: votesURL,
                json: {
                  delete: true,
                  displayName: 'Fantine',
                  userAuth: '0000000000',
                  messageId: messageID
                }
              }, () => {
                // Check that there are no votes in the database
                Models.Votes.findAll({})
                  .then((results) => {
                    expect(results.length).to.equal(0);
                    done();
                  });
              });
            });
        });
      });

      it('When a vote is posted, the messages table is also updated', (done) => {
        // Check that the message has 0 upvotes and 0 downvotes
        Models.Messages.findOne({
          where: {
            id: messageID
          }
        })
        .then((message) => {
          expect(message.dataValues.upVotes).to.equal(0);
          expect(message.dataValues.downVotes).to.equal(0);
        })
        .then(() => {
          // Create a new vote
          request({
            method: 'POST',
            url: votesURL,
            json: {
              displayName: 'Fantine',
              userAuth: '0000000000',
              messageId: messageID,
              vote: true
            }
          }, () => {
            // Check that the message has 1 upvote and 0 downvotes
            Models.Messages.findOne({
              where: {
                id: messageID
              }
            })
            .then((message) => {
              expect(message.dataValues.upVotes).to.equal(1);
              expect(message.dataValues.downVotes).to.equal(0);
              done();
            });
          });
        });
      });

      it('When a vote is posted, the users table is also updated', (done) => {
        // Check that the user has 0 upvotes and 0 downvotes
        Models.Users.findOne({
          where: {
            displayName: 'Jean Valjean'
          }
        })
        .then((user) => {
              console.log('==================b4 upvotes: ', user.dataValues.upVotes);
          expect(user.dataValues.upVotes).to.equal(0);
          expect(user.dataValues.downVotes).to.equal(0);
        })
        .then(() => {
          // Create a new vote
          request({
            method: 'POST',
            url: votesURL,
            json: {
              displayName: 'Fantine',
              userAuth: '0000000000',
              messageId: messageID,
              vote: true
            }
          }, (err, res, body) => {
                  console.log('====================body: ', body);
            // Check that the user has 1 upvote and 0 downvotes
            Models.Users.findOne({
              where: {
                displayName: 'Jean Valjean'
              }
            })
            .then((user) => {
              console.log('====================upvotes: ', user.dataValues.upVotes);
              expect(user.dataValues.upVotes).to.equal(1);
              expect(user.dataValues.downVotes).to.equal(0);
              done();
            });
          });
        });
      });
    });
  });
});
