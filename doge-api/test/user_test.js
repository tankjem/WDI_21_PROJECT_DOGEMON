process.env.NODE_ENV = 'test';

var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');

var app = require('../app');
var api = supertest(app);

var User = require('../models/user');
var Pc = require('../models/Pc');

describe("User tests", function() {

  beforeEach(function(done) {
    User.collection.drop();
    done();
  });

  describe("GET /api/users/:id", function() {
    it("should return a 200 response", function(done) {
      
      var pc1 = new Pc ({
        name: "New TESTES",
      });

      var user = new User({
        username: "TEST",
        email: "TEST",
        first_name: "TEST",
        last_name: "Test",
        _id: "stringystring",
        created_pc: [pc1]
      });

      user.save(function(err, user) {
        api.get('/api/users/' + user.id)
          .set('Accept', 'application/json')
          .expect(200, done);
      });
    });
  });
});