var express = require('express');
var router = express.Router();
var quizManager = require('../server/quizManager');


var buildRes = function(state, msg, data){
  var response = {
    state:state,
    msg:msg,
    data:data
  }
  return JSON.stringify(response);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/submitQuiz', function(req, res, next){
  console.info("submitQuiz req.body : ", req.body);
  var submitQuiz = req.body;
  if(0 == submitQuiz._id){
  quizManager.addNewQuiz(submitQuiz).then(function(){
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(true, "", ""));
  })
  .catch(function(err){
    console.info("come into submitQuiz error catch");
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(false, "error to submit quiz", ""));
  })
}else{
  quizManager.modifyQuiz(submitQuiz).then(function(){
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(true, "", ""));
  })
  .catch(function(err){
    console.info("come into submitQuiz error catch : ", err);
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(false, "error to submit quiz", ""));
  })
}
});

router.post('/getQuiz', function(req, res, next){
  console.info("getQuiz req.body: ", req.body);
  var filter = req.body;
  quizManager.getQuiz(filter).then(function(returnData){
    console.info("return data : ", returnData);
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(true, "", returnData));
  })
  .catch(function(err){
    console.info("come into getQuiz error catch");
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(false, "error to get quiz", ""));
  })
});

router.post('/delQuiz', function(req, res, next){
  console.info("delQuiz req.body: ", req.body);
  var deleteId = req.body;
  console.info("deleteId : ", deleteId.deleteId);
  quizManager.delQuiz(deleteId.deleteId).then(function(){
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(true, "", ""));
  })
  .catch(function(err){
    console.info("come into del error catch");
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(false, "error to delete quiz", ""));
  })
})

module.exports = router;
