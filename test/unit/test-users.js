'use strict';
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();
var supertest = require('supertest');
var expect = require('chai').expect;


var Bluebird        = require('bluebird');
var dbStub = sinon.stub();

describe('GET /users', function(){
  var request, app, usersRoute;
  beforeEach(function(){

    dbStub = sinon.stub();
    app = require('express')();
    usersRoute = proxyquire('lib/users', {
      'fh-mbaas-api' : {
        db : dbStub
      }
    });


    app.use('/users',usersRoute());
    request = supertest(app)
  });

    it('call should return a list of users', function(done){

        dbStub.yields(null, {
          count : 2,
          list : [{},{}]
        });

        console.log('getting ready to make request');
        request.get('/users')
        .expect(200)
        .end(function(err, res){
          console.log('body list: ' + JSON.stringify(res.body));
          console.log(dbStub.called);
          expect(err).to.not.exist;
          expect(res.body.list).to.have.length(2);
          done();

        });

    });



});
