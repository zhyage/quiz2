
const mongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');
const _ = require('underscore');
const mongoose = require('mongoose');


let options = { promiseLibrary: require('bluebird')};
let conn = mongoose.createConnection("mongodb://localhost:27017/quizPool", options);

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function(){
  console.info("connect to DB success");
})

let Schema = mongoose.Schema;

let quizSchema = new Schema ({
  course:{type:String, required:true},
  author:{type:String, required:true},
  quizType: {type: Number, required: true},
  question: {type: String, required: true},
  optionList: [{type: String}],
  answerList: [{type: String}],
  created_at: Date,
  updated_at: Date
});

quizSchema.methods.verifyQuiz = function(){
  console.info("course : " + this.course);
  console.info("author : " + this.author);
  console.info("quizType : " + this.quizType);
  console.info("question : " + this.question);
  console.info("optionList : " + this.optionList);
  console.info("answerList : " + this.answerList);
  console.info("length of optionList : " + this.optionList.length);
  console.info("length of answerList : " + this.answerList.length);
  return true;
};

let Quiz = conn.model('Quiz', quizSchema);

module.exports.Quiz = Quiz;
module.exports.quizSchema = quizSchema;
