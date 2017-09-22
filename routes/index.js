var express = require('express');
var router = express.Router();
var quizManager = require('../server/quizManager');
var examPaper = require('../server/examPaper');
var examinationManager = require('../server/examinationManager');


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
    res.send(buildRes(true, "add new quiz success!", ""));
  })
  .catch(function(err){
    console.info("come into submitQuiz error catch");
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(false, "error to submit quiz", ""));
  })
}else{
  quizManager.modifyQuiz(submitQuiz).then(function(){
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(true, "modify quiz success", ""));
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
});

/*********************************************************/

router.post('/submitPaper', function(req, res, next){
  console.info("submitPaper req.body : ", req.body);
  var submitPaper = req.body;
  if(0 == submitPaper._id){
    console.info("add new paper");
    examPaper.addNewPaper(submitPaper).then(function(){
      res.setHeader('Content-Type', 'application/json');
      res.send(buildRes(true, "add new paper success", ""));
    })
      .catch(function(err){
        console.info("come into submitPaper error catch");
        res.setHeader('Content-Type', 'application/json');
        res.send(buildRes(false, "error to submit paper", ""));
      });
  }else{
    console.info("modify a paper");
    examPaper.modifyPaper(submitPaper).then(function(){
      res.setHeader('Content-Type', 'application/json');
      res.send(buildRes(true, "modify paper success", ""));
    })
      .catch(function(err){
        console.info("come into submitPaper error catch : ", err);
        res.setHeader('Content-Type', 'application/json');
        res.send(buildRes(false, "error to submit paper", ""));
      })
  }
});

router.post('/getPaper', function(req, res, next){
  console.info("getPaper req.body: ", req.body);
  var filter = req.body;
  examPaper.getPaper(filter).then(function(returnData){
    console.info("return data : ", returnData);
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(true, "", returnData));
  })
    .catch(function(err){
      console.info("come into getPaper error catch");
      res.setHeader('Content-Type', 'application/json');
      res.send(buildRes(false, "error to get paper", ""));
    })
});

router.post('/delPaper', function(req, res, next){
  console.info("delQuiz req.body: ", req.body);
  var deleteId = req.body;
  console.info("deleteId : ", deleteId.deleteId);
  examPaper.delPaper(deleteId.deleteId).then(function(){
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(true, "", ""));
  })
    .catch(function(err){
      console.info("come into del error catch");
      res.setHeader('Content-Type', 'application/json');
      res.send(buildRes(false, "error to delete Paper", ""));
    })
});

router.post('/getQuizByPaperId', function(req, res, next){
  console.info("getQuizByPaperId req.body: ", req.body);
  var paperId = req.body;

  examPaper.getQuizListByPaperId(paperId.paperId).then(function (returnData) {
    console.info("return data : ", returnData);
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(true, "", returnData));
  })
    .catch(function (err) {
      console.info("come into getPaper error catch");
      res.setHeader('Content-Type', 'application/json');
      res.send(buildRes(false, "error to get getQuizByPaperId", ""));
    })
});

/*************************************************************/
router.post('/submitExamination', function(req, res, next){
  console.info("submitExamination req.body : ", req.body);
  var submitExamination = req.body;
  if(0 == submitExamination._id){
    console.info("add new examination");
    examinationManager.addExamination(submitExamination).then(function(){
      res.setHeader('Content-Type', 'application/json');
      res.send(buildRes(true, "add new examination success", ""));
    })
      .catch(function(err){
        console.info("come into submitExamination error catch");
        res.setHeader('Content-Type', 'application/json');
        res.send(buildRes(false, "error to submit examination", ""));
      });
  }else{
    // console.info("modify a examination");
    // examPaper.modifyPaper(submitPaper).then(function(){
    //   res.setHeader('Content-Type', 'application/json');
    //   res.send(buildRes(true, "modify paper success", ""));
    // })
    //   .catch(function(err){
    //     console.info("come into submitPaper error catch : ", err);
    //     res.setHeader('Content-Type', 'application/json');
    //     res.send(buildRes(false, "error to submit paper", ""));
    //   })
  }
});

router.post('/getExamination', function(req, res, next){
  console.info("getExamination req.body: ", req.body);
  var filter = req.body;
  examinationManager.getExamination(filter).then(function(returnData){
    console.info("return data : ", returnData);
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(true, "", returnData));
  })
    .catch(function(err){
      console.info("come into getExamination error catch");
      res.setHeader('Content-Type', 'application/json');
      res.send(buildRes(false, "error to get getExamination", ""));
    })
});

router.post('/triggerExamination', function(req, res, next){
  console.info("triggerExamination req.body: ", req.body);
  var info = req.body;
  examinationManager.triggerExamination(info).then(function(returnData){
    console.info("return data : ", returnData);
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(true, "", returnData));
  })
    .catch(function(err){
      console.info("come into triggerExamination error catch");
      res.setHeader('Content-Type', 'application/json');
      res.send(buildRes(false, "error to triggerExamination", ""));
    })
});

router.post('/delExamination', function(req, res, next){
  console.info("delExamination req.body: ", req.body);
  var deleteId = req.body;
  console.info("deleteId : ", deleteId.deleteId);
  examinationManager.delExamination(deleteId.deleteId).then(function(){
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(true, "", ""));
  })
    .catch(function(err){
      console.info("come into del error catch");
      res.setHeader('Content-Type', 'application/json');
      res.send(buildRes(false, "error to delete examination", ""));
    })
});

router.post('/getExaminationDetailByExaminationId', function(req, res, next){
  console.info("getExaminationDetailByExaminationId req.body: ", req.body);
  var examinationId = req.body;
  examinationManager.getExaminationById(examinationId.examinationId).then(function(returnData){
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(true, "", returnData));
  })
    .catch(function (err) {
      console.info("come into getExaminationDetailByExaminationId error catch");
      res.setHeader('Content-Type', 'application/json');
      res.send(buildRes(false, "error to getExaminationDetailByExaminationId", ""));
    })
});

/*******************************************************************************************/
router.post('/joinExamination', function(req, res, next) {
  console.info("joinExamination req.body: ", req.body);
  var userInfo = req.body;
  examinationManager.addUserIntoExamination(userInfo).then(function(returnData){
    res.setHeader('Content-Type', 'application/json');
    res.send(buildRes(true, "", returnData));
  })
    .catch(function (err) {
      console.info("come into joinExamination error catch");
      res.setHeader('Content-Type', 'application/json');
      res.send(buildRes(false, "error to joinExamination", ""));
    })
});


module.exports = router;
