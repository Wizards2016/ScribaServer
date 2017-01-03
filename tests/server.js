const mysql = require('mysql');
const request = require('request');
const expect = require('chai').expect;
const assert = require('chai').assert;

const baseUrl = 'http://127.0.0.1:8000';
// Start the server
require('../server.js');

describe('Server and database', () => {
  let dbConnection;

  beforeEach((done) => {
    // If running in the terminal:
    // start mysql server and use scribedb database
    dbConnection = mysql.createConnection({
      user: 'root',
      password: '',
      database: 'scribedb'
    });

    dbConnection.connect();
    const tablename = 'truncate Messages';

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
      json: { text: 'test #1' }
    }, (err, response) => {
      expect(response.statusCode).to.equal(201);
    });
    request({
      method: 'POST',
      url: `${baseUrl}/messages`,
      json: { text: 'test #2' }
    }, (err, response) => {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('should not post an empty message to the database', (done) => {
    request({
      method: 'POST',
      url: `${baseUrl}/messages`,
      json: { text: '' }
    }, (err, response) => {
      expect(response.statusCode).to.equal(406);
      done();
    });
  });

  it('should get a message from the database', (done) => {
    request({
      method: 'POST',
      url: `${baseUrl}/messages`,
      json: { text: 'Test #1' }
    }, (err1, response) => {
      expect(response.statusCode).to.equal(201);
      request({
        method: 'GET',
        url: `${baseUrl}/messages`
      }, (err2, response) => {
        expect(JSON.parse(response.body)[0].text).to.equal('Test #1');
      });
    });

    request({
      method: 'POST',
      url: `${baseUrl}/messages`,
      json: { text: 'Test #2' }
    }, (err1, response) => {
      expect(response.statusCode).to.equal(201);
      request({
        method: 'GET',
        url: `${baseUrl}/messages`
      }, (err2, response) => {
        expect(JSON.parse(response.body)[1].text).to.equal('Test #2');
        done();
      });
    });
  });
});
