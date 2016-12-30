var mysql = require('mysql');
var request = require('request');
var expect = require('chai').expect;

describe('Testing functionalty', function() {

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: '',
      database: 'scribeDB'
    });
    dbConnection.connect();

       var tablename = "messages";

    // Empty the db table before each test so that multiple tests won't screw each other up
    dbConnection.query('truncate ' + tablename, done);
  });

  it('Posting A Message', function(done) {
    request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/messages',
      json: {text: 'A testing message'}
    }, function(err, results) {
      expect(results.statusCode).to.equal(201);
      done();
    });
  });

  it('Getting A Posted Message', function(done) {
    request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/messages',
      json: {text: 'A testing message'}
    }, function(err, results) {
      expect(results.statusCode).to.equal(201);
      request({
        method: 'GET',
        url: 'http://127.0.0.1:8000/messages',
      }, function(err, results) {
        expect(JSON.parse(results.body)[0].text).to.equal('A testing message');
        done();
      });
    });
  });
});