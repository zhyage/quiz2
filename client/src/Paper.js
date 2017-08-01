import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
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

class Paper extends Component {

  questionTypeEnum = {
    EMPTY : 0,
    SINGLE : 1,
    MULTIPLE : 2
  };

  constructor(props) {
    super(props);
    

    this.state = {
      allQuizList: []
    };
  };

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

  onGetQuiz() {
    var courseFilter = document.getElementById('id_course_filter').value;
    var authorFilter = document.getElementById('id_author_filter').value;
    var questionFilter = document.getElementById('id_question_filter').value;
    console.info("in onGetQuiz : " + courseFilter + authorFilter + questionFilter);
    var pattern = {
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

  onAddQuizToPaper(id) {
    console.info("add quiz to Paper : ", id);
  }

  getQuizFromServer(pattern) {
    var that = this;
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
        var quizList = response.data;
        console.info("get quiz response : ", response.data);
        that.setState({
          allQuizList: quizList
        })
      }
    })
  }

  generateQuizListHtml() {
    var quizList = this.state.allQuizList;
    console.info("generateQuizListHtml : ", quizList);
    var generateHtml = [];
    for (var i = 0; i < quizList.length; i++) {
      var tId = "id_quiz_" + i;
      var add_button = <InputGroupButton><Button onClick={this.onAddQuizToPaper.bind(this, i)}>&#9664;</Button></InputGroupButton>
      var showValue = quizList[i].question;
      var oneQuizHtml = <FormGroup row> <InputGroup>
        {add_button}
        <Input type="textarea" id={tId} value={showValue}/>
      </InputGroup> </FormGroup>
      generateHtml.push(oneQuizHtml)
    }
    console.log(generateHtml);
    return generateHtml;

  }

  render() {
    console.info("come to Paper render");
    var quizListHtml = this.generateQuizListHtml();
    return (
      <Container>
        <Row>
          <Col>
            <p >hello1</p>
          </Col>
          <Col>
            <p >hello2</p>
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

export default Paper;
