import React, {Component} from 'react';
import createReactClass from 'create-react-class';
import Popup from 'react-popup';
import QRCode from 'qrcode.react';
import 'bootstrap/dist/css/bootstrap.css';
import MathJax from 'react-mathjax';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupButton
} from 'reactstrap';

class PerformExamination extends Component {

  questionTypeEnum = {
    EMPTY : 0,
    SINGLE : 1,
    MULTIPLE : 2
  }

  constructor(props) {
    super(props);


    this.state = {
      examinationId: this.props.match.params.examinationId,
      attender: {userName: "", userId:-1},
      attenderRegistered:false,
      renderQuizs:[],
      currentPage:-1,
      currentAnswer:[]
    };

  };

  onSubmitUserInfo() {

    let userInfo = {
      examinationId:this.state.examinationId,
      userName:document.getElementById('id_userName').value.trim(),
      userId:document.getElementById('id_userId').value.trim()
    };

    if(this.checkAttenderInfo(userInfo)){
      this.joinExamination(userInfo)
    }
  }

  onPreviousQuiz(){
    if(this.state.attenderRegistered && this.state.currentPage > 0){
      let currentPage = this.state.currentPage;
      this.setState({
        currentPage:currentPage - 1
      })
    }
  }

  onNextQuiz(){
    if(this.state.attenderRegistered && this.state.currentPage < this.state.renderQuizs.length - 1){
      let currentPage = this.state.currentPage;
      this.setState({
        currentPage:currentPage + 1
      })
    }
  }

  onSelectAnswer(){
    let currentQuiz = this.state.renderQuizs[this.state.currentPage];
    let updatedAnserList = [];
    for(let i = 0; i < currentQuiz.options.length; i++) {
      let selectId = "id_select_" + i;

      let selected = false;
      if (document.getElementById(selectId).checked) {
        selected = true;
      }
      updatedAnserList = this.setAnswerList(this.state.currentPage, currentQuiz.quizId, currentQuiz.quizType, i, selected);
    }
    this.setState({
      currentAnswer:updatedAnserList
    })
    this.onSubmitAnswer();
  }

  setAnswerList(pageId, quizId, quizType, index, selected){
    let answerList = this.state.currentAnswer;
    // for(let i = 0; i < answerList.length; i++){
    //   if(answerList[i].quizId == quizId){
    //     answerList[i].selectedAnswer[index] = selected;
    //   }
    // }
    answerList[pageId].selectedAnswer[index] = selected;
    console.info("answerList : ", answerList);
    return answerList;
  }

  getAnswerByPageId(pageId){
    let answerList = this.state.currentAnswer;
    // for(let i = 0; i < answerList.length; i++){
    //   if(answerList[i].quizId == quizId){
    //     return answerList[i];
    //   }
    // }
    return answerList[pageId];
  }

  onSubmitAnswer(){
    let commitData = {examinationId:"", userName:"", userId:-1, pageAnswer:{pageId:-1, answer:{}}};
    commitData.examinationId = this.state.examinationId;
    commitData.userName = this.state.attender.userName;
    commitData.userId = this.state.attender.userId;
    commitData.pageAnswer.pageId = this.state.currentPage;
    commitData.pageAnswer.answer = this.state.currentAnswer[this.state.currentPage];

    console.info("commitData : ", commitData);

    this.submitAnswer(commitData);

  }

  submitAnswer(commitAnswer){

    fetch('/commitPageAnswer', {
      method: "POST",
      headers: new Headers({
        'Content-Type': "application/json; charset=utf-8"
      }),
      body: JSON.stringify(commitAnswer)
    })
      .then(function (res) {
        return res.json();
      })
      .then(function(response){
        console.info("commitPageAnswer response : ", (response));
        if(response.state === true){
          console.info("commitPageAnswer ok");
        }
      })
  }


  joinExamination(userInfo) {
    let that = this;
    fetch('/joinExamination', {
      method: "POST",
      headers: new Headers({
        'Content-Type': "application/json; charset=utf-8"
      }),
      body: JSON.stringify(userInfo)
    })
      .then(function (res) {
        return res.json();
      })
      .then(function(response){
        console.info("joinExamination examination response : ", (response));
        let renderQuizs = response.data;
        let answerList = [];
        for(let i = 0; i < renderQuizs.length; i++){
          let oneAnswer = {quizId:"", selectedAnswer:[]};

          let quizIndex=renderQuizs[i].quizId;
          for(let j = 0; j < renderQuizs[i].options.length; j++){
            oneAnswer.selectedAnswer.push(false);
          }
          oneAnswer.quizId=quizIndex;
          answerList.push(oneAnswer);
        }
        if(response.state === true){
          that.setState({
            attenderRegistered: true,
            attender: {userName: userInfo.userName, userId:userInfo.userId},
            renderQuizs:response.data,
            currentPage:0,
            currentAnswer:answerList
          })
        }
      })
  }

  checkAttenderInfo(userInfo) {
    if(userInfo.examinationId.length === 0){
      alert("no examinationId, ghost!!!!");
      return false;
    }
    if(userInfo.userName.length === 0){
      alert("please input your name!");
      return false;
    }
    if(userInfo.userId.length === 0){
      alert("please input your id!");
      return false;
    }

    return true;
  }

  generateRenderQuizHtml(){
    let quizList = this.state.renderQuizs;
    console.info("generateRenderQuizHtml : ", quizList);

    let quizString = quizList[this.state.currentPage].quizString;
    let optionsList = quizList[this.state.currentPage].options;
    let quizType = quizList[this.state.currentPage].quizType;
    let currentPageAnswer = this.getAnswerByPageId(this.state.currentPage);
    let tId = "id_quiz_" + this.state.currentPage;
    let generateHtml = [];
    let questionHtml = <FormGroup row> <InputGroup>
           {/*<Input type="textarea" id={tId} value={quizString}/>*/}
           <MathJax.Context><MathJax.Node>{quizString}</MathJax.Node></MathJax.Context>
         </InputGroup> </FormGroup>
    generateHtml.push(questionHtml);
    for (let i = 0 ; i < optionsList.length; i++) {
      let tId = "id_options_" + i;
      let selectButtonId = "id_select_" + i;
      let selectButton = null;

      if (quizType === this.questionTypeEnum.SINGLE){
        if(currentPageAnswer.selectedAnswer[i] == true){
          selectButton = <InputGroupAddon> <Input addon type="radio"  name="correctAnswer" id={selectButtonId}  onChange={this.onSelectAnswer.bind(this)} checked/> </InputGroupAddon>
        }else{
          selectButton = <InputGroupAddon> <Input addon type="radio"  name="correctAnswer" id={selectButtonId}  onChange={this.onSelectAnswer.bind(this)} /> </InputGroupAddon>
        }
      } else {
        if(currentPageAnswer.selectedAnswer[i] == true){
          selectButton =<InputGroupAddon> <Input addon type="checkbox" name="correctAnswer" id={selectButtonId} onChange={this.onSelectAnswer.bind(this)} checked /> </InputGroupAddon>
        }else{
          selectButton =<InputGroupAddon> <Input addon type="checkbox" name="correctAnswer" id={selectButtonId} onChange={this.onSelectAnswer.bind(this)} /> </InputGroupAddon>
        }

      }

      let oneOptHtml =<FormGroup row> <InputGroup>
        {selectButton}
        {/*<Input type="textarea" id={tId} value={optionsList[i].optionString}/>*/}
        <MathJax.Context><MathJax.Node>{optionsList[i].optionString}</MathJax.Node></MathJax.Context>
      </InputGroup> </FormGroup>
      generateHtml.push(oneOptHtml)
    }


    console.log(generateHtml);
    return generateHtml;
  }

  generatePageHtml(){
    let totalPage = this.state.renderQuizs.length;
    let current = this.state.currentPage + 1;
    let generateHtml = <b>{current}/{totalPage}</b>
    return generateHtml;
  }

  render() {
    if(!this.state.attenderRegistered) {
      return (
        <Container>
          <Row>
            <Col>
              <InputGroup>
                <InputGroupAddon>name:</InputGroupAddon>
                <Input type="text" id='id_userName'/>
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <InputGroupAddon>id:</InputGroupAddon>
                <Input type="text" id='id_userId'/>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col xs='6'>
              <Button onClick={this.onSubmitUserInfo.bind(this)}>submit</Button>
            </Col>
          </Row>
        </Container>
      );

    }else{
      let quizListHtml = this.generateRenderQuizHtml();
      let pageHtml = this.generatePageHtml();
      return (
        <Container>
          <Row>
            <Col>
              now you are in examination
              {this.props.match.params.examinationId}
              {quizListHtml}
            </Col>
          </Row>
          <Row>
            <Col>
              <Button onClick={this.onPreviousQuiz.bind(this)}>previous</Button>
            </Col>
            <Col>
              {pageHtml}
            </Col>
            <Col>
              <Button onClick={this.onNextQuiz.bind(this)}>next</Button>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default PerformExamination;