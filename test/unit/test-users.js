'use strict';
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var request = require('supertest');
var expect = require('chai').expect;

var Bluebird        = require('bluebird');
var httpStub = sinon.stub();

describe('GET /users', function(){

  beforeEach(function(){
    httpStub = sinon.stub();
    request = proxyquire('lib/users', {
      'request' : {
        get : httpStub
      }
    });
  });

    it('call should return a list of users', function(){

        httpStub.yields(null, {
          count : 2,
          list : [{},{}]
        });

        request.get('/users')
        .expect(200)
        .end(function(err, res){
          expect(err).to.not.exist;
          expect(res.body.list).to.have.length(2);
        })

    });



});
