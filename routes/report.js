var express = require('express')
  , router = express.Router()
  , AWS = require("aws-sdk")
  , async = require('async')
  , fs = require('fs');


// Quick health check API
router.get('/health', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: "ok"
  });
})

// Return all items for a drillrigId
router.get('/list', function(req, res) {

  console.log("Return current user report");

  res.setHeader('Content-Type', 'application/json');

  var path = "output";


  fs.readdir(path, function(err, items) {
      var responseList = [];

      for (var i=0; i<items.length; i++) {
          var obj = {};
          obj.name = items[i];
          obj.time = fs.statSync(path+"/"+items[i]).mtime.getTime();
          responseList.push(obj);
      }
      //res.send(JSON.stringify(items));
      console.log("JSON Array is: " + JSON.stringify(responseList));
      res.send(responseList);
  });

});

router.post('/', function(req, res) {
  //console.log(JSON.stringify(db));

  console.log("Input data is: " + JSON.stringify(req.body));
  var params = {
      TableName: table,
      Item: {
                "assetId": req.body.assetId,
                "assetModelId": req.body.assetModelId,
                "assetName": req.body.assetName,
                "drillrigId": req.body.drillrigId,
                "manual": req.body.manual,
                "manufacturer": req.body.manufacturer
              }
  };

  //var rigsResponse;
  res.setHeader('Content-Type', 'application/json');

  async.series([
      function(callback) {

        //Query Database
        db.put(params, function(err, data) {
          if (err) {
              console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
          } else {
              console.log("PutAssets succeeded:", JSON.stringify(data, null, 2));
              //rigsResponse = data.Items;
              callback();
          }
        });

      }],
      function(err, results) {
        console.log("Write resposne" + JSON.stringify(results));
        res.send(JSON.stringify({"putSuccess": true}));
      });

});


module.exports = router
