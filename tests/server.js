const expect = require('chai').expect;
const assert = require('chai').assert;
const Sequelize = require('sequelize');
const sequelize = new Sequelize('scribedb', 'root', '');
const Models = require('../db');
const request = require('request');
const server = require('../server');
const baseUrl = 'http://127.0.0.1:8000';

xdescribe('Server', () => {
  it('Send a status of 200 when requesting to /messages', (done) => {
    request({
      method: 'GET',
      url: `${baseUrl}/messages`
    }, (error, response) => {
      expect(response.statusCode).to.equal(200);
    });
    done();
  });

  xit('Send a status of 200 when requesting to /users', (done) => {
    request({
      method: 'GET',
      url: `${baseUrl}/users`
    }, (error, response) => {
      expect(response.statusCode).to.equal(200);
    });
    done();
  });

  xit('Send a status of 200 when requesting to /votes', (done) => {
    request({
      method: 'GET',
      url: `${baseUrl}/votes`
    }, (error, response) => {
      expect(response.statusCode).to.equal(200);
    });
    done();
  });
});

describe('API & Database', () => {

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

  xdescribe('MESSAGES', () => {
    const messagesURL = `${baseUrl}/messages`;

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
          done();
        });
      });

      it('Get all messages if latitude and longitude are not specified', (done) => {
        messages.forEach((message, index) => {
          Models.Messages.create(message)
            .then(() => {
              if (index === messages.length - 1) {
                request({
                  method: 'GET',
                  url: messagesURL
                }, (error, response, body) => {
                  expect(JSON.parse(body).length).to.equal(2);
                  done();
                });
              }
            });
        });
      });

      // TODO: How to send data along with a get request?
      xit('Get nearby messages if latitude and longitude are specified', (done) => {
        request({
          method: 'GET',
          url: messagesURL,
          json: {
            latitude: 37,
            longitude: -122.0342186
          }
        }, (error, response, body) => {
          // console.log('========================================', response);
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
        }, (error, response, body) => {
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
        }, (error, response, body) => {
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
            }, (error, response, body) => {
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
        }, (error, response, body) => {
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
        }, (error, response, body) => {
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
        }, (error, response, body) => {
          // Check that the message was not posted
          expect(response.statusCode).to.equal(400);
          done();
        });
      });
    });
  });

  describe('USERS', () => {
    const usersURL = `${baseUrl}/users`;

    xdescribe('GET', () => {

    });

    describe('POST', () => {
      beforeEach((done) => {
        // Empty the Users table before each test
        Models.Users.destroy({
          where: {}
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


    });
  });
});
