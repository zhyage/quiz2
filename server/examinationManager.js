/**
 * Created by vdmc34 on 2017/2/4.
 */
const mongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');
const _ = require('underscore');
const mongoose = require('mongoose');
const examinationPaperModel = require('./examPaperModel');
const quizModel = require('./quizModel');
const quizManager = require('./quizManager');
const examinationModel = require('./examinationModel');

mongoose.Promise = Promise;

let addExamination = function(submitExamination){
  return new Promise(function(resolve, reject){
    console.info("submitExamination quizList : ", submitExamination.quizList);
    let newExamination = new examinationModel.examination({
      examinationName:submitExamination.examinationName,
      examinationAuthor:submitExamination.examinationAuthor,
      examinationState:submitExamination.examinationState,
      quizList:submitExamination.quizList,
      disorderQuizs:submitExamination.disorderQuizs,
      disorderOptions:submitExamination.disorderOptions
    });
    if(!newExamination.verifyExamination()){
      reject("invalid examination!");
    }else{
      newExamination.save(function(err){
        if(err){
          console.info("save err : ", err);
          reject(err)
        }else{
          resolve();
        }
      });
    }
  });
};

let matchExamination = function(examination, pattern){
  if(pattern.examinationName.length > 0){
    if(!examination.examinationName.includes(pattern.examinationName)){
      console.info("match false 1");
      return false;
    }
  }

  if(pattern.examinationAuthor.length > 0){
    if(examination.examinationAuthor != pattern.examinationAuthor){
      console.info("match false 2");
      return false;
    }
  }

  console.info("match success");
  return true;
}

let getExamination = function(filter) {
  console.info("come into getExamination");
  return new Promise(function(resolve, reject){
    examinationModel.examination.find({}, function(err, examination){
      if(err) {
        reject(err)
      }else{
        var findList = _.filter(examination, function(ele){
          //console.info("in filter quiz : ", ele);
          return matchExamination(ele, filter);
        });
        console.info("findExaminationList : ", findList);
        resolve(findList);
      }
    });
  });
};

let getExaminationById = function(id) {
  console.info("getExaminationById id:", id);
  return new Promise(function (resolve, reject) {
    examinationModel.examination.findById(id, function(err, findExamination){
      if(err){
        console.info("error to find examination : ", id);
        reject(err)
      }else{
        resolve(findExamination)
      }
    });
  });
};


let triggerExamination = function(info) {
  console.info("come into triggerExamination");
  return new Promise(function(resolve, reject){
    examinationModel.examination.findById(info.id, function(err, findExamination){
      if(err || null == findExamination) {
        console.info("error to find examination : ", info.id);
        retject(err);
      }else{
        if(info.action == 'start'){
          findExamination.examinationState = examinationModel.examinationStateEnum.ONGOING;
        }
        if(info.action == 'stop'){
          findExamination.examinationState = examinationModel.examinationStateEnum.FINISHED;
        }
        findExamination.save(function(err){
          if(err){
            console.info("save err : ", err);
            reject(err)
          }else{
            resolve();
          }
        });

      }
    })
  })
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

let findThisQuizByQuizId = function(targetExamination, id){
  for(let i = 0; i < targetExamination.quizList.length; i++){
    if (id == targetExamination.quizList[i]._id){
      console.info("find quiz id : ", id);
      return targetExamination.quizList[i];
    }
  }
  return undefined;
}

let generateExaminationPaper = function(targetExamination, attenderRenderQuiz){
  let examinationPaper = [];
  for(let i = 0; i< attenderRenderQuiz.length; i++){
    let findQuiz = findThisQuizByQuizId(targetExamination, attenderRenderQuiz[i].quizId);
    if(findQuiz){
      let oneQuiz = {quizId:"", quizString:"", quizType:0, options:[]};
      oneQuiz.quizId = attenderRenderQuiz[i].quizId;
      oneQuiz.quizString = findQuiz.question;
      oneQuiz.quizType = findQuiz.quizType;
      console.info("oneQuiz.id ", oneQuiz.quizId);
      console.info("oneQuiz.String ", oneQuiz.quizString);
      console.info("oneQuiz.type ", oneQuiz.quizType);
      let optionsTemp = [];
      for(let k = 0; k < attenderRenderQuiz[i].options.length; k++){
        let oneOption = {optionId:-1, optionString:""};
        oneOption.optionId = attenderRenderQuiz[i].options[k];
        oneOption.optionString = findQuiz.optionList[oneOption.optionId];
        console.info("oneOption.optionId : ", oneOption.optionId);
        console.info("oneOption.optionString : ", oneOption.optionString);
        optionsTemp.push(oneOption);
        oneQuiz.options = optionsTemp;
      }
      examinationPaper.push(oneQuiz);
      console.info("-------------------------------------");
      console.info("oneQuiz : ", oneQuiz);
      console.info("+++++++++++++++++++++++++++++++++++++++");
    }

  }
  console.info("render examinationPaper : ", examinationPaper);
  return examinationPaper;
}

let generateCorrectAnswer = function(targetExamination, quizId, optionsIdList){

  let correctAnswerList = [];
  let findQuiz = findThisQuizByQuizId(targetExamination, quizId);

  if(findQuiz){
    let optionsStringList = [];

    console.info("optionsIdList : ", optionsIdList);
    for(let i = 0; i < optionsIdList.length; i++){
      optionsStringList.push(findQuiz.optionList[optionsIdList[i]]);
      correctAnswerList.push(false);
    }
    _.each(findQuiz.answerList, function (oneAnswer) {
      for(let j = 0; j < optionsStringList.length; j++){
        if(oneAnswer == optionsStringList[j]){
          correctAnswerList[j]=true;
        }
      }
    })

  }
  console.info("correctAnswerList : ", correctAnswerList);
  return correctAnswerList;
}

let generateRenderQuiz = function(targetExamination){
  let renderQuizList = [];
  _.each(targetExamination.quizList, function(quiz){
    let renderQuiz = {quizId:"", options:[], correctAnswers:[], commitAnswers:[]};
    renderQuiz.quizId = quiz._id;
    for(let i = 0 ; i < quiz.optionList.length; i++){
      renderQuiz.options.push(i);
      renderQuiz.commitAnswers.push(false);
    }
    if(targetExamination.disorderOptions) {
      renderQuiz.options = shuffle(renderQuiz.options);
    }
    //renderQuiz.correctAnswers.push(false);
    //renderQuiz.commitAnswers.push(false);
    renderQuiz.correctAnswers = generateCorrectAnswer(targetExamination, renderQuiz.quizId, renderQuiz.options);
    renderQuizList.push(renderQuiz);
    if(targetExamination.disorderQuizs){
      renderQuizList = shuffle(renderQuizList);
    }
  })
  console.info("generateRenderQuiz : ", renderQuizList);
  return renderQuizList;
}

let addUserIntoExamination = function(userInfo) {
  console.info("come into addUserIntoExamination");
  console.info(userInfo);
  return new Promise(function(resolve, reject){
    examinationModel.examination.findById(userInfo.examinationId, function(err, findExamination) {
      if (err || null == findExamination) {
        console.info("error to find examination : ", userInfo.examinationId);
        retject(err);
      } else {
        let attendersList = findExamination.attends;
        let existAttender = _.find(attendersList, function (attender) {
          console.info(attender);
          return (attender.userName === userInfo.userName && attender.userId === userInfo.userId);
        })
        console.info("existAttender : ", existAttender);
        if (existAttender) {
          console.info("user already exist");
          resolve(generateExaminationPaper(findExamination, existAttender.renderQuiz));
        } else {
          let newAttender = new examinationModel.attenders({
            userName:userInfo.userName,
            userId:userInfo.userId,
            renderQuiz:generateRenderQuiz(findExamination)
          });
          //generateCorrectAnswer(findExamination, newAttender.renderQuiz);
          findExamination.attends.push(newAttender);
          findExamination.save(function(err){
            if(err){
              console.info("save err : ", err);
              reject(err)
            }else{
              resolve(generateExaminationPaper(findExamination, newAttender.renderQuiz));
            }
          });
        }
      }
    });
  });
}

let delExamination = function(id){
  return new Promise(function(resolve, reject){
    examinationModel.examination.findByIdAndRemove(id, function(err){
      if(err){
        console.info("error to del examination : ", id);
        reject(err)
      }else{
        console.info("ok to del examination : ", id);
        resolve();
      }
    });
  });
};


let commitAnswer = function(commitData){
  console.info("come into commitAnswer");
  console.info(commitData);
  return new Promise(function(resolve, reject){
    examinationModel.examination.findById(commitData.examinationId, function(err, findExamination) {
      if (err || null == findExamination) {
        console.info("error to find examination : ", commitData.examinationId);
        retject(err);
      } else {
        let findUser = false;

        for (let i = 0; i < findExamination.attends.length; i++) {
          if (findExamination.attends[i].userName === commitData.userName
            && findExamination.attends[i].userId === commitData.userId) {
            findUser = true;
            findExamination.attends[i].renderQuiz[commitData.pageAnswer.pageId].commitAnswers
              = commitData.pageAnswer.answer.selectedAnswer;
          }
        }
        if (findUser) {
          findExamination.save(function (err) {
            if (err) {
              console.info("save err : ", err);
              reject(err)
            } else {
              resolve();
            }
          });
        } else {
          reject("user didn't register yet, please refresh");

        }
      }
    });
  });
}



module.exports.addExamination = addExamination;
module.exports.getExamination = getExamination;
module.exports.triggerExamination = triggerExamination;
module.exports.delExamination = delExamination;
module.exports.getExaminationById = getExaminationById;
module.exports.addUserIntoExamination = addUserIntoExamination;
module.exports.commitAnswer = commitAnswer;




