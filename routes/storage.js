var express = require('express')
  , router = express.Router()
  , AWS = require("aws-sdk")
  , async = require('async')
  , multer = require('multer')
  , exec = require('child_process').execFile
  , fs = require('fs');  // file system

const _ = require('lodash');
//  , fs = require('fs');

//File Upload directory
var storage = multer.diskStorage({ // https://github.com/expressjs/multer
  destination: 'public/uploads/',
  limits : { fileSize:100000000 },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });

//Need this trick to set the AWS endpoint
AWS.config.update({
  region: "cn-north-1",
  //s3BucketEndpoint: true, // can't set this parameter, it will confuse AWS S3 client to ignore the Bucket
  endpoint: "https://s3.cn-north-1.amazonaws.com.cn"
});
// Create S3 service object
var s3 = new AWS.S3({apiVersion: '2006-03-01'});
var bucketName = "alpharigdata";

// Quick health check API
router.get('/health', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: "ok"
  });
});

//Upload file
router.post('/historical', upload.single('inputfile'), function(req, res) {
  //Copy the file to another folder
  const child = exec('cp', [req.file.path, '/tmp/reports'], (error, stdout, stderr) => {
    if (error) {
        console.error('stderr', stderr);
        throw error;
    }
    console.log('stdout', stdout);
  });

  res.send("Files successfully uploaded: " + JSON.stringify(req.file));
  //console.dir(req.files);
});

//Stream the images and user manual
router.get('/file', function(req, res, next) {

  // Get file anme
  var filename = req.query.filename;
  console.log("Fetch file: " + filename);

  //Read from local OS
  // logic here to determine what file, etc
  var rstream = fs.createReadStream('/tmp/reports/' + filename);
  rstream.pipe(res);

  // Read from S3
  //console.log("S3 ojbect is: " + JSON.stringify(s3));
  //s3.getObject({Bucket: bucketName, Key: filename}).forwardToExpress(res, next);
  //s3.getObject({Bucket: bucketName, Key: filename})
  //  .createReadStream()
  //  .on('error', next)
  //  .pipe(res);

});

module.exports = router
