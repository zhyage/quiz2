
const mongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');
const _ = require('underscore');
const mongoose = require('mongoose');
const quizModel = require('./quizModel');


let addNewQuiz = function(submitQuiz){
  return new Promise(function(resolve, reject){
    let newQuiz = new quizModel.Quiz({
      course:submitQuiz.course,
      author:submitQuiz.author,
      quizType: submitQuiz.quizType,
      question: submitQuiz.question,
      optionList: submitQuiz.optionList,
      answerList: submitQuiz.answerList
    });
    if(!newQuiz.verifyQuiz()){
      reject("invalide quiz!");
    }else{
      newQuiz.save(function(err){
        if(err){
          reject(err)
        }else{
          resolve();
        }
      });
    }
  });
};

let delQuiz = function(id){
  return new Promise(function(resolve, reject){
    quizModel.Quiz.findByIdAndRemove(id, function(err){
      if(err){
        console.info("error to del quiz : ", id);
        reject(err)
      }else{
        console.info("ok to del quiz : ", id);
        resolve();
      }
    });
  });
};

let modifyQuiz = function(submitQuiz){
  console.info("come into modifyQuiz : ", submitQuiz)
  return new Promise(function(resolve, reject){
    quizModel.Quiz.findById(submitQuiz._id, function(err, findQuiz){
      if(err || null == findQuiz){
        console.info("error to find quiz : ", submitQuiz._id);
        reject(err)
      }else{
        findQuiz.course = submitQuiz.course;
        findQuiz.author = submitQuiz.author;
        findQuiz.quizType =  submitQuiz.quizType;
        findQuiz.question =  submitQuiz.question;
        findQuiz.optionList =  submitQuiz.optionList;
        findQuiz.answerList =  submitQuiz.answerList;

        if(!findQuiz.verifyQuiz()){
          reject("error to verifyQuiz : ", findQuiz._id);
        }

        findQuiz.save(function(err){
          if(err){
            console.info("error to save : ", findQuiz._id);
            reject(err)
          }else{
            resolve();
          }
        })
      }
    })
  })
};


let matchQuiz = function(quiz, pattern){
  if(pattern.course.length > 0){
    if(quiz.course != pattern.course){
      console.info("match false 1");
      return false;
    }
  }

  if(pattern.author.length > 0){
    if(quiz.author != pattern.author){
      console.info("match false 2");
      return false;
    }
  }

  if(pattern.quizType != 0){
    if(pattern.quizType != quiz.quizType){
      console.info("match false 3");
      return false;
    }
  }

  if(pattern.question.length > 0){
    if(!quiz.question.includes(pattern.question)){
      console.info("match false 4");
      return false;
    }
  }
  console.info("match success");
  return true;
};

let getQuiz = function(filter) {
  console.info("come into getQuiz");
  return new Promise(function(resolve, reject){
    quizModel.Quiz.find({}, function(err, quiz){
      if(err) {
        reject(err)
      }else{
        var findList = _.filter(quiz, function(ele){
          //console.info("in filter quiz : ", ele);
          return matchQuiz(ele, filter);
        });
        console.info("findList : ", findList);
        resolve(findList);
      }
    });
  });
};

let getQuizById = function (id) {
  console.info("come into getQuizById : ", id);
  return new Promise(function (resolve, reject) {
    quizModel.Quiz.findById(id, function (err, quiz) {
      if(err){
        console.info("findById err :", err);
        reject(err);
      }else{
        console.info("findById quiz : ", quiz);
        resolve(quiz);
      }
    });
  });
};


module.exports.addNewQuiz = addNewQuiz;
module.exports.modifyQuiz = modifyQuiz;
module.exports.delQuiz = delQuiz;
module.exports.getQuiz = getQuiz;
module.exports.getQuizById = getQuizById;
