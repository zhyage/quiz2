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



module.exports.addExamination = addExamination;
module.exports.getExamination = getExamination;
module.exports.triggerExamination = triggerExamination;
module.exports.delExamination = delExamination;
module.exports.getExaminationById = getExaminationById;




