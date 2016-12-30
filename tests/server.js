const mysql = require('mysql');
const request = require('request');
const expect = require('chai').expect;
const assert = require('chai').assert;
const baseUrl = 'http://127.0.0.1:8000';

describe('Server and database', () => {
  let dbConnection;

  beforeEach((done) => {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: '',
      database: 'scribeDB'
    });

    dbConnection.connect();
    const tablename = 'truncate messages';

    // Empty the db table before each test so that multiple tests won't screw each other up
    dbConnection.query(tablename, done);
  });

  it('should return a status code of 200', (done) => {
    request.get(`${baseUrl}/messages`, (err, response) => {
      assert.equal(200, response.statusCode);
      done();
    });
  });

  it('should post a message to the database', (done) => {
    request({
      method: 'POST',
      url: `${baseUrl}/messages`,
      json: { text: 'A testing message' }
    }, (err, response) => {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('should get a message from the database', (done) => {
    request({
      method: 'POST',
      url: `${baseUrl}/messages`,
      json: { text: 'A testing message' }
    }, (err1, response) => {
      expect(response.statusCode).to.equal(201);
      request({
        method: 'GET',
        url: `${baseUrl}/messages`
      }, (err2, response) => {
        expect(JSON.parse(response.body)[0].text).to.equal('A testing message');
        done();
      });
    });
  });
});
