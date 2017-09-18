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

mongoose.Promise = Promise;

let addNewPaper = function(submitPaper){
  return new Promise(function(resolve, reject){
    console.info("submitPaper quizList : ", submitPaper.quizList);
    let newPaper = new examinationPaperModel.examinationPaper({
      paperName:submitPaper.paperName,
      author:submitPaper.author,
      quizList:submitPaper.quizList
    });
    if(!newPaper.verifyPaper()){
      reject("invalide Paper!");
    }else{
      newPaper.save(function(err){
        if(err){
          reject(err)
        }else{
          resolve();
        }
      });
    }
  });
};

let modifyPaper = function(submitPaper){
  console.info("come into modifyPaper : ", submitPaper)
  return new Promise(function(resolve, reject){
    examinationPaperModel.examinationPaper.findById(submitPaper._id, function(err, findPaper){
      if(err || null == findPaper){
        console.info("error to find paper : ", submitPaper._id);
        reject(err)
      }else{
        findPaper.paperName = submitPaper.paperName;
        findPaper.author = submitPaper.author;
        findPaper.quizList = submitPaper.quizList;


        if(!findPaper.verifyPaper()){
          reject("error to verifyPaper : ", findPaper._id);
        }

        findPaper.save(function(err){
          if(err){
            console.info("error to save : ", findPaper._id);
            reject(err)
          }else{
            resolve();
          }
        })
      }
    })
  })
};

let matchPaper = function(paper, pattern){
  if(pattern.paperName.length > 0){
    if(!paper.paperName.includes(pattern.paperName)){
      console.info("match false 1");
      return false;
    }
  }

  if(pattern.author.length > 0){
    if(paper.author != pattern.author){
      console.info("match false 2");
      return false;
    }
  }

  console.info("match success");
  return true;
}

let getPaper = function(filter) {
  console.info("come into getPaper");
  return new Promise(function(resolve, reject){
    examinationPaperModel.examinationPaper.find({}, function(err, paper){
      if(err) {
        reject(err)
      }else{
        var findList = _.filter(paper, function(ele){
          //console.info("in filter quiz : ", ele);
          return matchPaper(ele, filter);
        });
        console.info("findPaperList : ", findList);
        resolve(findList);
      }
    });
  });
};

let delPaper = function(id){
  return new Promise(function(resolve, reject){
    examinationPaperModel.examinationPaper.findByIdAndRemove(id, function(err){
      if(err){
        console.info("error to del paper : ", id);
        reject(err)
      }else{
        console.info("ok to del paper : ", id);
        resolve();
      }
    });
  });
};

let getQuizListByPaperId = function (id) {
  return new Promise(function(resolve, reject){
    examinationPaperModel.examinationPaper.findById(id, function(err, paper){
      if(err){
        console.info("error to find paper : ", id);
        reject(err)
      }else{
        let quizList = paper.quizList;
        resolve(quizList);
      }
    });
  });
};


module.exports.addNewPaper = addNewPaper;
module.exports.getPaper = getPaper;
module.exports.delPaper = delPaper;
module.exports.modifyPaper = modifyPaper;
module.exports.getQuizListByPaperId = getQuizListByPaperId;



