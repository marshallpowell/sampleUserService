var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var Promise = require('bluebird');
var db = Promise.promisify(require('fh-mbaas-api').db);
var log = require('fh-bunyan').getLogger(__filename);




function usersRoute() {
  var users = new express.Router();
  users.use(cors());
  users.use(bodyParser());


  // GET REST endpoint - query params may or may not be populated
  users.get('/', function(req, res, next) {
    console.log('In users route GET / req.query=');
    var world = req.query && req.query.users ? req.query.users : 'World';


    var options = {
      "act" : "list",
      "type" : "users",
      "eq" : req.query
    }

    db(options)
    .then(function(data){
      console.log('returned data: ' + JSON.stringify(data));
        res.json(data);
    })
    .catch(function(err){
        console.log('error getting users: ' + JSON.stringify(err));
        res.json(err);
    });


  });

  // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // This can also be added in application.js
  // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  users.post('/', function(req, res, next) {
    //console.log(new Date(), 'In users route POST / req.body=', req.body);
    console.log('entered post with: ' + req.body.first);
    var user = req.body;

    var options = {
      "act" : "create",
      "type" : "users",
      "fields" : user
    }

    db(options)
    .then(function(data){
      console.log('created user: ' + JSON.stringify(data));
      res.json(data);
    })
    .catch(function(err){
      console.log('error getting users: ' + JSON.stringify(err));
      res.json(err);
    })

  });

  users.put('/:id', function updateUser (req, res, next) {
    console.log('update user %s with data', req.params.id, req.body);
    db({
      act: 'update',
      type: 'users',
      fields: req.body,
      guid: req.params.id
    })
      .then(function (data) {
      //  log.info('created a user with data', req.body);
        res.json(data);
      })
      .catch(next);
  });

  users.delete('/:id', function updateUser (req, res, next) {
    //log.info('delete user %s', req.params.id);

    db({
      act: 'delete',
      type: 'users',
      guid: req.params.id
    })
      .then(function (data) {
        res.json(data);
      })
      .catch(next);
  });

  return users;
}

module.exports = usersRoute;
