const mongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');
const _ = require('underscore');
const mongoose = require('mongoose');
const quizModel = require('./quizModel');
const examPaperModel = require('./examPaperModel');

const examinationStateEnum = {
  READY : 1,
  ONGOING : 2,
  FINISHED :3
};

// const disorderStatusEnum = {
//   ORDER: 1,
//   DISORDER: 2
// };

let conn = mongoose.createConnection("mongodb://localhost:27017/examinationPool");

conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function(){
  console.info("connect to DB success");
})

let Schema = mongoose.Schema;

let answerSchema = new Schema ({
  questionId:{type: Number},
  answerId:[{type: Number}]
}, { _id: false });

let attendersSchema = new Schema ({
  userName:{type:String, required:true},
  userId:{type:String, required:true},
  answerList:[answerSchema]
  // answerList:[{questionId:number, answer:[{answerId:number}]}]
}, { _id: false });

let examinationSchema = new Schema ({
  examinationName: {type: String, required: true},
  examinationAuthor: {type: String, required: true},
  examinationState: {type: Number, required: true},
  quizList: [ quizModel.quizSchema ],
  disorderQuizs: {type: Boolean, required: true, default: false},
  disorderOptions: {type: Boolean, required: true, default: false},
  attends: [attendersSchema],
  created_at: Date,
  updated_at: Date
});

examinationSchema.methods.verifyExamination = function(){
  console.info("examinationName : " + this.examinationName);
  console.info("examinationAuthor : " + this.examinationAuthor);
  console.info("examinationState : " + this.examinationState);
  console.info("disorderQuizs : " + this.disorderQuizs);
  console.info("disorderOptions : " + this.disorderOptions);
  console.info("quizList : " + this.quizList);
  return true;
};

let examination = conn.model('examination', examinationSchema);
let attenders = conn.model('attenders', attendersSchema);
let answer = conn.model('answer', answerSchema);

module.exports.examination = examination;
module.exports.examinationSchema = examinationSchema;
module.exports.examinationStateEnum = examinationStateEnum;
module.exports.attendersSchema = attendersSchema;
module.exports.answerSchema = answerSchema;
module.exports.attenders = attenders;
module.exports.answer = answer;
// module.exports.disorderStatusEnum = disorderStatusEnum;