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

let getQuizListByQuizListId = function(quizIdList){
  console.info("come into getQuizListByQuizListId");
  let quizList = [];
  return new Promise(function (resolve, reject) {
    for (let i = 0; i < quizIdList.length; i++){
      quizManager.getQuizById(quizIdList[i]).then(function (quiz) {
        quizList.push(quiz);
        if(i == quizIdList.length - 1){
          resolve(quizList);
        }
      })
        .catch(function (err) {
          reject(err);
        })
    }
    });
  }

let getQuizListByPaperId = function (id) {
  return new Promise(function(resolve, reject){
    examinationPaperModel.examinationPaper.findById(id, function(err, paper){
      if(err){
        console.info("error to find paper : ", id);
        reject(err)
      }else{
        let quizIdList = paper.quizList;
        let quizList = [];

        getQuizListByQuizListId(quizIdList).then(function (quizList) {
          resolve(quizList);
        })
          .catch(function(err){
            reject(err);
          })
      }
    });
  });
};


module.exports.addNewPaper = addNewPaper;
module.exports.getPaper = getPaper;
module.exports.delPaper = delPaper;
module.exports.getQuizListByPaperId = getQuizListByPaperId;

// let addNewExamPaper = function(paperName){
//     let newPaper = new examinationPaperModel.examinationPaper({
//         paperName: paperName,
//         prepareStatus: examinationPaperModel.paperStatusEnum.PREPARING
//     });
//
//     if(!newPaper.verifyPaper()){
//         console.error("verify examination paper error");
//         return;
//     }
//
//     return newPaper.save(function(err){
//         if(err){
//             console.error("save examination paper error : " + err);
//         }
//     });
//
// };
//
// let delExamPaper = function (id) {
//     examinationPaperModel.examinationPaper.findByIdAndRemove(id, function(err) {
//         if (err) {
//             console.warn("remove error, no such examination paper");
//         }
//     });
// };
//
// let addQuizToPaper = function (id, idOfQuizPool) {
//     examinationPaperModel.examinationPaper.findById(id, function(errOfFetchPaper, findPaper) {
//         if (errOfFetchPaper || null == findPaper) {
//             console.error("no such paper exist");
//             return false;
//         }
//         quizModel.Quiz.findById(idOfQuizPool, function(errOfFetchQuiz, findQuiz){
//            if(errOfFetchQuiz || null == findQuiz){
//                console.error("no such quiz exist");
//                return false;
//            }
//            let insert = {quiz:findQuiz};
//            findPaper.quizs.push(insert);
//
//            if(!findPaper.verifyPaper()){
//                console.error("error to verify examination paper");
//                return;
//            }
//
//            return findPaper.save(function(err){
//                if(err){
//                    console.error("error to save examination paper");
//                }
//            });
//         });
//     });
// }
//
// let delQuizFromPaper = function (id, quizId) {
//     examinationPaperModel.examinationPaper.findById(id, function(errOfFetchPaper, findPaper){
//         if(errOfFetchPaper || null == findPaper){
//             console.error("no such paper exist");
//             return false;
//         }
//         quizList = findPaper.quizs;
//         let it = _.find(findPaper.quizs, (it) => it._id == quizId);
//         let index = _.indexOf(findPaper.quizs, it);
//         if (index > -1) {
//             findPaper.quizs.splice(index, 1);
//         }else{
//             console.error("delete quiz from paper fail, no such quiz");
//         }
//
//         return findPaper.save(function(err){
//             if(err){
//                 console.error("error to save examination paper");
//             }
//         });
//     })
// }
//
// let modifyPaperName = function(id, paperName){
//     examinationPaperModel.examinationPaper.findById(id, function(errOfFetchPaper, findPaper){
//         if(errOfFetchPaper || null == findPaper){
//             console.error("no such paper exist");
//             return false;
//         }
//         findPaper.paperName = paperName;
//
//         if(!findPaper.verifyPaper()){
//             console.error("error to verify examination paper");
//             return;
//         }
//
//         return findPaper.save(function(err){
//             if(err){
//                 console.error("error to save examination paper");
//             }
//         });
//     })
//
// }
//
// let setExamPaperStatus = function (id, status) {
//     examinationPaperModel.examinationPaper.findById(id, function(errOfFetchPaper, findPaper){
//         if(errOfFetchPaper || null == findPaper){
//             console.error("no such paper exist");
//             return false;
//         }
//         findPaper.prepareStatus = status;
//
//         if(!findPaper.verifyPaper()){
//             console.error("error to verify examination paper");
//             return;
//         }
//
//         return findPaper.save(function(err){
//             if(err){
//                 console.error("error to save examination paper");
//             }
//         });
//     })
// }
//
// let examPaperPreparing = function (id) {
//     setExamPaperStatus(id, examinationPaperModel.paperStatusEnum.PREPARING);
// }
//
// let examPaperReady = function(id){
//     setExamPaperStatus(id, examinationPaperModel.paperStatusEnum.READY);
// }
//
// addNewExamPaper("paper-1");
// /*delExamPaper('58984a313e49cf73e0b36eb4');*/
// addQuizToPaper('58b3d162e4d4c91f8874e6c9', '58959cc3b81be16c80838512');
// /*addQuizToPaper('58b3bdf604db7103acf1506e', '58959cc3b81be16c80838513');*/
// delQuizFromPaper('58b3d162e4d4c91f8874e6c9', '58b3d1c5dd7e3e28d0c4af81');
// modifyPaperName('58b3d162e4d4c91f8874e6c9', "new_paper_zhy");
// examPaperReady('58b3d162e4d4c91f8874e6c9');



