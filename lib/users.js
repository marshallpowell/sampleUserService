var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var Promise = require('bluebird');
var fh = Promise.promisifyAll(require('fh-mbaas-api'));




function usersRoute() {
  var users = new express.Router();
  users.use(cors());
  users.use(bodyParser());


  // GET REST endpoint - query params may or may not be populated
  users.get('/', function(req, res) {
    console.log(new Date(), 'In users route GET / req.query=', req.query);
    var world = req.query && req.query.users ? req.query.users : 'World';


    var options = {
      "act" : "list",
      "type" : "users",
      "eq" : req.query
    }

    fh.dbAsync(options)
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
  users.post('/', function(req, res) {
    //console.log(new Date(), 'In users route POST / req.body=', req.body);
    console.log('entered post with: ' + req.body.first);
    var user = req.body;

    var options = {
      "act" : "create",
      "type" : "users",
      "fields" : user
    }

    fh.dbAsync(options)
    .then(function(data){
      console.log('created user: ' + JSON.stringify(data));
      res.json(data);
    })
    .catch(function(err){
      console.log('error getting users: ' + JSON.stringify(err));
      res.json(err);
    })

  });

  return users;
}

module.exports = usersRoute;
