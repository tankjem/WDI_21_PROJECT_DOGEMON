process.env.NODE_ENV = 'test';

var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');

var app = require('../app');
var api = supertest(app);

var Item = require('../models/item');

describe("Item tests", function() {

  beforeEach(function(done) {
    Item.collection.drop();
    done();
  });

  describe("GET /api/items/:id", function() {
    it("should return a 200 response", function(done) {
      var item = new Item({
        name: "Plank",
        description: "Test",
        image_url: "https://lexilife95.files.wordpress.com/2015/05/elbow-plank.jpg",
        item_type: "Weapon",
        item_attacl: 5,
        item_defense: 0,
        item_heal: 0
      });

      item.save(function(err, item) {
        api.get('/api/items/' + item.id)
          .set('Accept', 'application/json')
          .expect(200, done);
      });
    });
  });
});