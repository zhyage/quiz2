import React, {Component} from 'react';
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

class Quiz extends Component {

  questionTypeEnum = {
    EMPTY : 0,
    SINGLE : 1,
    MULTIPLE : 2
  }
  constructor(props) {
    super(props);
    this.onAddOption = this.onAddOption.bind(this);
    this.onSelectQuizType = this.onSelectQuizType.bind(this);
    this.onGetQuiz = this.onGetQuiz.bind(this);
    this.getQuizFromServer = this.getQuizFromServer.bind(this);
    this.onModifyQuiz = this.onModifyQuiz.bind(this);

    this.state = {
      singleSelect: this.questionTypeEnum.SINGLE,
      optionList: [],
      allQuizList: [],
      quizId : 0
    };
  };

  onAddOption() {
    let inputOptionStr = document.getElementById('id_addoption').value;
    if (inputOptionStr.trim().length === 0) {
      alert("pleas input your option answers!");
      return;
    }
    let optList = this.state.optionList;
    optList.push(inputOptionStr);
    this.setState({
      optionList: optList
    })
    document.getElementById('id_addoption').value = '';
  }

  onSelectQuizType() {
    let quizType = document.getElementById('id_quizType').value;
    let singleType = this.questionTypeEnum.SINGLE;
    if(quizType === 'single choice'){
      singleType = this.questionTypeEnum.SINGLE;
    } else {
      singleType = this.questionTypeEnum.MULTIPLE;
    }
    this.setState({
      singleSelect: singleType
    })
    this.clearAnswer();
  }

  clearAnswer() {
    for (let i = 0 ; i < this.state.optionList.length; i++) {
      let selectButtonId = "id_select_" + i;
      let ele=document.getElementById(selectButtonId);
      ele.checked=false;
    }
  }

  onDelOption(id) {
    let optList = this.state.optionList;
    if ((!Number.isInteger(id)) || (id < 0) || (id >= optList.length)) {
      alert("Can't find this option!!!");
      return;
    }
    optList.splice(id, 1);
    console.info("del opt id : ", id);
    console.info("optList : ", optList);
    this.setState({
      optionList: optList
    })
  }

  onDelQuiz(id) {
    let quizList = this.state.allQuizList;
    if ((!Number.isInteger(id)) || (id < 0) || (id >= quizList.length)) {
      alert("Can't find this quiz!!!");
      return;
    }
    let res = window.confirm("did you want delete " + quizList[id].question);
    if(true === res){
      this.delQuizFromServer(quizList[id]._id);
      this.onGetQuiz();
    }
  }

  onModifyQuiz(id) {
    let quizList = this.state.allQuizList;
    if ((!Number.isInteger(id)) || (id < 0) || (id >= quizList.length)) {
      alert("Can't find this quiz!!!");
      return;
    }
    console.info("now to modify quiz : " + quizList[id]);
    this.onClear();
    this.setQuizArea(quizList[id]);
  }

  setQuizArea(quiz) {
    let course = document.getElementById('id_course');
    course.value = quiz.course;
    let author = document.getElementById('id_author');
    author.value = quiz.author;
    let question = document.getElementById('id_question');
    question.value = quiz.question;
    if(quiz.quizType === this.questionTypeEnum.SINGLE){
      document.getElementById("id_quizType").selectedIndex = 0;
    }else {
      document.getElementById("id_quizType").selectedIndex = 1;
    }
    this.setState({
      optionList: quiz.optionList,
      singleSelect: quiz.quizType,
      quizId: quiz._id
    })

  }

  clearQuizArea() {
    let course = document.getElementById('id_course');
    course.value = "";
    let author = document.getElementById('id_author');
    author.value = "";
    let question = document.getElementById('id_question');
    question.value = "";
    document.getElementById("id_quizType").selectedIndex = 0;
    for(let i = 0; i < this.state.optionList.length; i++){
      let selectButtonId = "id_select_" + i;
      document.getElementById(selectButtonId).checked=false;
    }
    this.setState({
      singleSelect: this.questionTypeEnum.SINGLE,
      optionList: [],
      quizId: 0
    })
  }



  checkFormInput(submitQuiz) {
    if(submitQuiz.course.length === 0){
      alert("Please input Question!");
      return false;
    }
    if(submitQuiz.author.length === 0){
      alert("Please input Author!");
      return false;
    }
    if(submitQuiz.question.length === 0){
      alert("Please input question!");
      return false;
    }
    if(submitQuiz.optionList.length === 0){
      alert("Please input options!");
      return false;
    }
    if(submitQuiz.answerList.length === 0){
      alert("please select correct answer!");
      return false;
    }
    return true;
  }

  getAnswerList() {
    let answerList = [];
    for(let i = 0; i < this.state.optionList.length; i++) {
      let eleId = "id_select_" + i;
      if(this.state.singleSelect === this.questionTypeEnum.SINGLE){
        if(document.getElementById(eleId).checked){
          answerList.push(this.state.optionList[i]);
          break;
        }
      }else{
        if(document.getElementById(eleId).checked){
          answerList.push(this.state.optionList[i]);
        }
      }
    }
    return answerList;
  }

  submitQuizToServer(submitQuiz) {
    let that = this;
    fetch('/submitQuiz', {
      method: "POST",
      headers: new Headers({
        'Content-Type': "application/json; charset=utf-8"
      }),
      body: JSON.stringify(submitQuiz)
    })
    .then(function (res) {
      //console.info("submit res : ", res);
      return res.json();
    })
    .then(function(response){
      console.info("get submit quiz response : ", response);
      alert(response.msg);
      if(response.state === true){
        that.onClear();
      }
      that.onGetQuiz();
    })
  }


  delQuizFromServer(id) {
    fetch('/delQuiz', {
      method: "POST",
      headers: new Headers({
        'Content-Type': "application/json; charset=utf-8"
      }),
      body: JSON.stringify({deleteId:id})
    })
    .then(function (res) {
      console.info("del res : ", res);
    })
    .then(function(returnData){
      console.info("del returnData : ", returnData)
    })
  }

  onSubmit() {

    let submitQuiz = {
      _id:0,
      course:"",
      author:"",
      quizType:this.questionTypeEnum.SINGLE,
      question:"",
      optionList:[],
      answerList:[]
    };

    submitQuiz.course = document.getElementById('id_course').value.trim();
    submitQuiz.author = document.getElementById('id_author').value.trim();
    submitQuiz.quizType = this.state.singleSelect;
    submitQuiz.question = document.getElementById('id_question').value.trim();
    submitQuiz.optionList = this.state.optionList;
    submitQuiz.answerList = this.getAnswerList();
    submitQuiz._id = this.state.quizId;

    console.log(submitQuiz);
    if(this.checkFormInput(submitQuiz)){
      console.log("ready to submit");
      this.submitQuizToServer(submitQuiz)
    }
  }

  getQuizFromServer(pattern) {
    let that = this;
    fetch('/getQuiz', {
      method: "POST",
      headers: new Headers({
        'Content-Type': "application/json; charset=utf-8"
      }),
      body: JSON.stringify(pattern)
    })
    .then(function (res) {
      //console.info("get quiz res json : ", res.json());
      return res.json();
    })
    .then(function(response){
      console.info("get quiz response : ", (response));
      if(response.state === true){
        let quizList = response.data;
        console.info("get quiz response : ", response.data);
        that.setState({
          allQuizList: quizList
        })
      }
    })
  }

  onGetQuiz() {
    let courseFilter = document.getElementById('id_course_filter').value;
    let authorFilter = document.getElementById('id_author_filter').value;
    let questionFilter = document.getElementById('id_question_filter').value;
    console.info("in onGetQuiz : " + courseFilter + authorFilter + questionFilter);
    let pattern = {
      _id:0,
      course:courseFilter,
      author:authorFilter,
      quizType:this.questionTypeEnum.EMPTY,
      question:questionFilter,
      optionList:[],
      answerList:[]
    };
    this.getQuizFromServer(pattern);
  }

  onClear() {
    console.info("onClear");
    this.clearQuizArea()
  }

  componentDidMount() {
    console.info("come into componentDidMount");
    this.onGetQuiz();
  }

  onFilter(){
    this.onGetQuiz();
  }

  onClearFilter(){
    document.getElementById('id_course_filter').value="";
    document.getElementById('id_author_filter').value="";
    document.getElementById('id_question_filter').value="";
    this.onGetQuiz();
  }

  generateOptHtml() {
    let optList = this.state.optionList;
    console.info("generateOptHtml : ", optList);
    let singleType = this.state.singleSelect;
    let generateHtml = [];
    for (let i = 0 ; i < optList.length; i++) {
      let tId = "id_options_" + i;
      let selectButtonId = "id_select_" + i;
      let selectButton = null;
      if (singleType === this.questionTypeEnum.SINGLE){
        selectButton = <InputGroupAddon> <Input addon type="radio"  name="correctAnswer" id={selectButtonId} /> </InputGroupAddon>
      } else {
        selectButton =<InputGroupAddon> <Input addon type="checkbox" name="correctAnswer" id={selectButtonId}/> </InputGroupAddon>
      }

      let oneOptHtml =<FormGroup row> <InputGroup>
        {selectButton}
        <Input type="textarea" id={tId} value={optList[i]}/>
        <InputGroupButton><Button onClick={this.onDelOption.bind(this, i)}>Delete</Button></InputGroupButton>
      </InputGroup> </FormGroup>
      generateHtml.push(oneOptHtml)
    }
    return generateHtml;
  }

  generateQuizListHtml() {
    let quizList = this.state.allQuizList;
    console.info("generateQuizListHtml : ", quizList);
    let generateHtml = [];
    for (let i = 0; i < quizList.length; i++) {
      let tId = "id_quiz_" + i;
      let modify_button = <InputGroupButton><Button onClick={this.onModifyQuiz.bind(this, i)}>Modify</Button></InputGroupButton>
      let delete_button = <InputGroupButton><Button onClick={this.onDelQuiz.bind(this, i)}>Delete</Button></InputGroupButton>
      let showValue = quizList[i].question;
      let oneQuizHtml = <FormGroup row> <InputGroup>
        {/*<Input type="textarea" id={tId} value={showValue}/>*/}
        <MathJax.Context><MathJax.Node>{showValue}</MathJax.Node></MathJax.Context>
        {modify_button}
        {delete_button}
      </InputGroup> </FormGroup>
      generateHtml.push(oneQuizHtml)
    }
    console.log(generateHtml);
    return generateHtml;

  }

  render() {
    console.info("come to render");
    let optListHtml = this.generateOptHtml();
    let quizListHtml = this.generateQuizListHtml();

    return (
      <Container>
        <Row>
          <Col>
            <Form>
              <FormGroup row>
                <Label for="Course" sm={2}>Course</Label>
                <Col sm={10}>
                  <Input type="text" name="course" id="id_course" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="Author" sm={2}>Author</Label>
                <Col sm={10}>
                  <Input type="text" name="author" id="id_author" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="QuizType" sm={2}>Select</Label>
                <Col sm={10}>
                  <Input type="select" name="quizType" id="id_quizType" onChange={this.onSelectQuizType.bind(this)}>
                    <option>single choice</option>
                    <option>multiple choice</option>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="Question" sm={2}>Question</Label>
                <Col sm={10}>
                  <Input type="textarea" name="question" id="id_question" />
                </Col>
              </FormGroup>
              {optListHtml}
              <FormGroup row>
                <InputGroup>
                  <Input type="textarea" name="addoption" id="id_addoption" />
                  <InputGroupButton><Button onClick={this.onAddOption.bind(this)} >Add options</Button></InputGroupButton>
                </InputGroup>
              </FormGroup>
              <FormGroup check row>
                <Col sm={{ size: 10, offset: 2 }}>
                  <Button onClick={this.onSubmit.bind(this)}>Submit</Button>
                  <Button onClick={this.onClear.bind(this)}>Clear</Button>
                </Col>
              </FormGroup>
            </Form>
          </Col>
          <Col>

            <Row>
              <Col>
                <InputGroup>
                  <InputGroupAddon>course:</InputGroupAddon>
                  <Input type="text" id='id_course_filter'/>
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroupAddon>author:</InputGroupAddon>
                  <Input type="text" id='id_author_filter'/>
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup>
                  <InputGroupAddon>question</InputGroupAddon>
                  <Input type="text" id='id_question_filter'/>
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col xs='6'>
                <Button onClick={this.onFilter.bind(this)}>Filter</Button>
              </Col>
              <Col xs='6'>
                <Button onClick={this.onClearFilter.bind(this)}>Clear Filter</Button>
              </Col>
            </Row>
            {quizListHtml}

          </Col>
        </Row>
      </Container>
    );
  }
}

export default Quiz;
