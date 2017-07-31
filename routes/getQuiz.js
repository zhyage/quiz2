var express = require('express');
var router = express.Router();
// var mongoClient = require('mongodb').MongoClient;
// var Promise = require('bluebird');
// var _ = require('underscore');
// var mongoose = require('mongoose');
var quizManager = require('../server/quizManager');

/* GET home page. */
router.post('/', function(req, res, next) {
  console.info("getQuiz req.body single: ", req.body);
  var filter = req.body;
  quizManager.getQuiz(filter).then(function(returnData){
    console.info("return data : ", returnData);
    res.send(returnData);
  });
});


// router.post('/',function(req,res) {
//     function username() {
//         console.log("agyaaa");
//         return new Promise(function(resolve,reject) {
//             User.findOne({"username":req.body.username}, function(err,user) {
//                 if (err) {
//                     reject(err)
//                 } else {
//                     console.log("yaha b agyaaa");
//                     var errorsArr = [];
//                     errorsArr.push({"msg":"Username already been taken."});
//                     resolve(errorsArr);
//                 }
//
//             });
//         });
//     }
//     username().then(function(data) {
//         console.log(data);
//     });
// });

module.exports = router;
