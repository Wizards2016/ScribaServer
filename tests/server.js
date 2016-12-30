const mysql = require('mysql');
const request = require('request');
const expect = require('chai').expect;

describe('Testing functionalty', () => {
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

  it('Posting A Message', (done) => {
    request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/messages',
      json: { text: 'A testing message' }
    }, (err, results) => {
      expect(results.statusCode).to.equal(201);
      done();
    });
  });

  it('Getting A Posted Message', (done) => {
    request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/messages',
      json: { text: 'A testing message' }
    }, (err1, results1) => {
      expect(results1.statusCode).to.equal(201);
      request({
        method: 'GET',
        url: 'http://127.0.0.1:8000/messages'
      }, (err2, results2) => {
        expect(JSON.parse(results2.body)[0].text).to.equal('A testing message');
        done();
      });
    });
  });
});
