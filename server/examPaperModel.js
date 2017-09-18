/**
 * Created by vdmc34 on 2017/2/4.
 */
const mongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');
const _ = require('underscore');
const mongoose = require('mongoose');
const quizModel = require('./quizModel');


let conn = mongoose.createConnection("mongodb://localhost:27017/examinationPaperPool");

conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function(){
    console.info("connect to DB success");
})

let Schema = mongoose.Schema;

let examinationPaperSchema = new Schema ({
    paperName: {type: String, required: true},
    author:{type:String, required:true},
    quizList: [  quizModel.quizSchema ],
    created_at: Date,
    updated_at: Date
});

examinationPaperSchema.methods.verifyPaper = function(){
    console.info("paperName : " + this.paperName);
    console.info("author : " + this.author);
    console.info("quizList : " + this.quizList);
    return true;
};

let examinationPaper = conn.model('examinationPaper', examinationPaperSchema);

module.exports.examinationPaper = examinationPaper;
module.exports.examinationPaperSchema = examinationPaperSchema;
