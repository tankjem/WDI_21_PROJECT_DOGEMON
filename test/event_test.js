process.env.NODE_ENV = 'test';

var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');

var app = require('../app');
var api = supertest(app);

var Event = require('../models/event');

describe("Event tests", function() {

  beforeEach(function(done) {
    Event.collection.drop();
    done();
  });

  describe("GET /api/events/:id", function() {
    it("should return a 200 response", function(done) {
      var event = new Event({
        name: "Test",
        description: "Testy test",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReFeJV-fy_bkvPODsyqcnDMHqdUTrQNuID0DME3PRra0LdxdUx2g",
        event_type: "red_zone_encounter",
        choices: ["Fight", "Flight"]
      });

      event.save(function(err, event) {
        api.get('/api/events/' + event.id)
          .set('Accept', 'application/json')
          .expect(200, done);
      });
    });
  });
});