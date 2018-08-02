var express = require('express')
  , router = express.Router()
  , AWS = require("aws-sdk")
  , jwt = require('jsonwebtoken')
  , config = require('../config.js')
  , async = require('async')
//  , fs = require('fs');

// Quick health check API
router.get('/health', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: "ok"
  });
})

// Login authenticate against database
router.post('/', function(req, res) {
  //console.log(JSON.stringify(db));

  console.log("Input data is: " + JSON.stringify(req.body));
  var userId = req.body.userId;
  var passwd = req.body.passwd;

  res.setHeader('Content-Type', 'application/json');

  if (userId && passwd && userId === "wang123" && passwd === "superpw") {

    // if user is found and password is right
    // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
    const payload = {
      userId: userId
    };
        var token = jwt.sign(payload, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        console.log("Generated token: " + token);
        // return the information including token as JSON
        res.json({
          success: true,
          message: 'User Authenticated!',
          token: token
        });

  } else {
    res.status(401).send({ success: false, message: 'Authentication failed. Please use correct userId and password!' });
  }

});


module.exports = router
