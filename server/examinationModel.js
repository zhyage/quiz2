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

let examinationSchema = new Schema ({
  examinationName: {type: String, required: true},
  examinationAuthor: {type: String, required: true},
  examinationState: {type: Number, required: true},
  quizList: [ quizModel.quizSchema ],
  disorderQuizs: {type: Boolean, required: true, default: false},
  disorderOptions: {type: Boolean, required: true, default: false},
  attends: [],
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

module.exports.examination = examination;
module.exports.examinationSchema = examinationSchema;
module.exports.examinationStateEnum = examinationStateEnum;
// module.exports.disorderStatusEnum = disorderStatusEnum;