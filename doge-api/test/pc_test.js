process.env.NODE_ENV = 'test';

var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');

var app = require('../app');
var api = supertest(app);

var Pc = require('../models/pc');

describe("Pc tests", function() {

  beforeEach(function(done) {
    Pc.collection.drop();
    done();
  });

  describe("GET /api/pcs", function() {

    beforeEach(function(done) {
      api.post('/api/pcs')
        .set('Accept', 'application/json')
        .send({
          image_url: "https://i.ytimg.com/vi/hEJnMQG9ev8/maxresdefault.jpg",
          health: 100,
          inventory: []
        }).end(done);
    });

    it("should return a 200 response", function(done) {
      api.get('/api/pcs')
        .set('Accept', 'application/json')
        .expect(200, done);
    });

    it("should return an array", function(done) {
      api.get('/api/pcs')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it("should return an array of objects that contain a 'brand' property", function(done) {
      api.get('/api/pcs')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(res.body[0]).to.have.property('brand');
          done();
        });
    });
  });

  describe("POST /api/pcs", function() {
    it("should return a 201 response", function(done) {
      api.post('/api/pcs')
        .set('Accept', 'application/json')
        .send({
          brand: "Nike",
          color: "Black",
          laced: true,
          material: "leather",
          price: 49.99
        }).expect(201, done);
    });
  });

  describe("GET /api/pcs/:id", function() {
    it("should return a 200 response", function(done) {
      var pc = new Pc({
        brand: "Nike",
        color: "Black",
        laced: true,
        material: "leather",
        price: 49.99
      });

      pc.save(function(err, pc) {
        api.get('/api/pcs/' + pc.id)
          .set('Accept', 'application/json')
          .expect(200, done);
      });
    });
  });

  describe("DELETE /api/pcs/:id", function() {
    it("should return a 204 response", function(done) {
      var pc = new Pc({
        brand: "Nike",
        color: "Black",
        laced: true,
        material: "leather",
        price: 49.99
      });

      pc.save(function(err, pc) {
        api.delete('/api/pcs/' + pc.id)
          .set('Accept', 'application/json')
          .expect(204, done);
      });
    });
  });

});