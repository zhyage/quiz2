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
      this.onAddQuizToPaper = this.onAddQuizToPaper.bind(this);
      this.onDelPickedQuiz = this.onDelPickedQuiz.bind(this);
      this.onClearFilter = this.onClearFilter.bind(this);
      this.onFilter = this.onFilter.bind(this);

      this.state = {
          paperId: 0,
          allQuizList: [],
          pickedQuizList: [],
          allPaperList: []
      };
  };

  componentDidMount() {
    console.info("come into componentDidMount");
    this.onGetQuiz();
    this.onGetPaper();
  }

  onFilter(){
    console.info("come into onFilter");
    this.onGetQuiz();
  }

  onClearFilter(){
    document.getElementById('id_course_filter_paper').value="";
    document.getElementById('id_author_filter_paper').value="";
    document.getElementById('id_question_filter_paper').value="";
    this.onGetQuiz();
  }

  onPaperFilter(){
    console.info("come into onPaperFilter");
    this.onGetPaper();
  }

  onPaperClearFilter(){
    document.getElementById('id_paperName_filter').value="";
    document.getElementById('id_paperAuthor_filter').value="";
    this.onGetPaper();
  }

  onGetQuiz() {
    let courseFilter = document.getElementById('id_course_filter_paper').value;
    let authorFilter = document.getElementById('id_author_filter_paper').value;
    let questionFilter = document.getElementById('id_question_filter_paper').value;
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

  onAddQuizToPaper(id) {
    let quizList = this.state.allQuizList;
    let pickedList = this.state.pickedQuizList;
    if ((!Number.isInteger(id)) || (id < 0) || (id >= quizList.length)) {
        alert("Can't find this quiz!!!");
        return;
    }
    let quiz = quizList[id];
    pickedList.push(quiz);
    console.info("selected quiz : ", quiz);
    this.setState({
        pickedQuizList:pickedList
    });
    console.info("ccccccccccureent picketQuizList :", this.state.pickedQuizList);
  }

  onDelPickedQuiz(id) {
    console.info("delete pickedQuiz :", id);
    let pickedList = this.state.pickedQuizList;
    pickedList.splice(id ,1);
    console.info("after delete : ", pickedList);
    this.setState({
      pickedQuizList: pickedList
    });
  }


  onClear() {
    this.setState({
      pickedQuizList:[]
    });

  }

  onDelPaper(id) {
    let paperList = this.state.allPaperList;
    if ((!Number.isInteger(id)) || (id < 0) || (id >= paperList.length)) {
      alert("Can't find this paper!!!");
      return;
    }
    let res = window.confirm("did you want delete " + paperList[id].paperName);
    if(true === res){
      this.delPaperFromServer(paperList[id]._id);
      this.onGetPaper();
    }
  }

  delPaperFromServer(id) {
    fetch('/delPaper', {
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

  submitPaperToServer(submitPaper) {
    let that = this;
    fetch('/submitPaper', {
      method: "POST",
      headers: new Headers({
        'Content-Type': "application/json; charset=utf-8"
      }),
      body: JSON.stringify(submitPaper)
    })
      .then(function (res) {
        console.info("submitPaper res : ", res);
      })
      .then(function(returnData){
        console.info("submitPaper returnData : ", returnData);
        //that.onGetQuiz();
      })
  }

  checkFormInput(submitPaper){
    if(submitPaper.paperName.length === 0){
      alert("Please input Name!");
      return false;
    }
    if(submitPaper.author.length === 0){
      alert("Please input Author!");
      return false;
    }
    if(submitPaper.quizList.length === 0){
      alert("Please input some quiz!");
      return false;
    }
    return true;
  }

  onSubmit() {
    let submitPaper = {
      _id:0,
      paperName:"",
      author:"",
      quizList:[]
    };

    submitPaper.paperName = document.getElementById('id_paperName').value.trim();
    submitPaper.author = document.getElementById('id_paperAuthor').value.trim();
    submitPaper.quizList = this.state.pickedQuizList;
    submitPaper._id = this.state.paperId;

    console.log(submitPaper);
    if(this.checkFormInput(submitPaper)){
      console.log("ready to submit");
      this.submitPaperToServer(submitPaper)
    }
    this.onGetPaper();
  }

  onGetPaper() {
    let nameFilter = document.getElementById('id_paperName_filter').value;
    let authorFilter = document.getElementById('id_paperAuthor_filter').value;
    console.info("in onGetQuiz : " + nameFilter + authorFilter);
    let pattern = {
      _id:0,
      paperName:nameFilter,
      author:authorFilter,
      quizList:[]
    };
    this.getPaperFromServer(pattern);
  }

  onModifyPaper(id){
    console.info("onModifyPaper");
  }

  onAddPaperToPaper(id){
    console.info("onAddPaperToPaper");
    let paper = this.state.allPaperList[id];
    let paperId = paper._id;
    console.info("paperId : ", paperId);
    this.getQuizListByPaperId(paperId);
  }

  getQuizListByPaperId(id){
    let that = this;
    fetch('/getQuizByPaperId', {
      method: "POST",
      headers: new Headers({
        'Content-Type': "application/json; charset=utf-8"
      }),
      body: JSON.stringify({paperId:id})
    })
      .then(function (res) {
        //console.info("get quiz res json : ", res.json());
        return res.json();
      })
      .then(function(response){
        console.info("get getQuizListByPaperId response : ", (response));
        if(response.state === true){
          let getQuizList = response.data;
          console.info("get getQuizListByPaperId response : ", response.data);
          that.setState({
            pickedQuizList: getQuizList
          })
        }
      })
  }


  getPaperFromServer(pattern) {
    let that = this;
    fetch('/getPaper', {
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
          let paperList = response.data;
          console.info("get quiz response : ", response.data);
          that.setState({
            allPaperList: paperList
          })
        }
      })
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


  generateQuizListHtml() {
    let quizList = this.state.allQuizList;
    console.info("generateQuizListHtml : ", quizList);
    let generateHtml = [];
    for (let i = 0; i < quizList.length; i++) {
      let tId = "id_quiz_" + i;
      let add_button = <InputGroupButton><Button onClick={this.onAddQuizToPaper.bind(this, i)}>&#9664;</Button></InputGroupButton>
      let showValue = quizList[i].question;
      let oneQuizHtml = <FormGroup row> <InputGroup>
        {add_button}
        <Input type="textarea" id={tId} value={showValue}/>
      </InputGroup> </FormGroup>
      generateHtml.push(oneQuizHtml)
    }
    console.log(generateHtml);
    return generateHtml;

  }

  generatePicketListHtml() {
    let pickedList = this.state.pickedQuizList;
    let generateHtml = [];
    for(let i = 0; i < pickedList.length; i++){
      let tId = "id_picked_" + i;
      let del_button = <InputGroupButton><Button onClick={this.onDelPickedQuiz.bind(this, i)}>Delete</Button></InputGroupButton>
      let showValue = pickedList[i].question;
      let onePickedQuizHtml = <FormGroup row> <InputGroup>
        <Input type="textarea" id={tId} value={showValue}/>
          {del_button}
        </InputGroup> </FormGroup>
        generateHtml.push(onePickedQuizHtml)
    }
          console.log(generateHtml);
          return generateHtml;
  }

  generatePaperListHtml() {
    let paperList = this.state.allPaperList;
    console.info("generatePaperListHtml : ", paperList);
    let generateHtml = [];
    for (let i = 0; i < paperList.length; i++) {
      let tId = "id_paper_" + i;
      let modify_button = <InputGroupButton><Button onClick={this.onModifyPaper.bind(this, i)}>Modify</Button></InputGroupButton>
      let delete_button = <InputGroupButton><Button onClick={this.onDelPaper.bind(this, i)}>Delete</Button></InputGroupButton>
      let add_button = <InputGroupButton><Button onClick={this.onAddPaperToPaper.bind(this, i)}>&#9654;</Button></InputGroupButton>
      let showValue = paperList[i].paperName;
      let onePaperHtml = <FormGroup row> <InputGroup>
        <Input type="textarea" id={tId} value={showValue}/>
        {modify_button}
        {delete_button}
        {add_button}
      </InputGroup> </FormGroup>
      generateHtml.push(onePaperHtml)
    }
    console.log(generateHtml);
    return generateHtml;

  }



  render() {
    console.info("come to Paper render");
    let quizListHtml = this.generateQuizListHtml();
    let pickedQuizListHtml = this.generatePicketListHtml();
    let paperListHtml = this.generatePaperListHtml();
    return (
      <Container>
        <Row>
          <Col>
            <Row>
              <Col>
                <InputGroup>
                  <InputGroupAddon>name:</InputGroupAddon>
                  <Input type="text" id='id_paperName_filter'/>
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroupAddon>author:</InputGroupAddon>
                  <Input type="text" id='id_paperAuthor_filter'/>
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col xs='6'>
                <Button onClick={this.onPaperFilter.bind(this)}>Filter</Button>
              </Col>
              <Col xs='6'>
                <Button onClick={this.onPaperClearFilter.bind(this)}>Clear Filter</Button>
              </Col>
            </Row>
            {paperListHtml}
          </Col>
          <Col>
            <Form>
              <FormGroup row>
                <Label for="paperName" sm={2}>Name</Label>
                <Col sm={10}>
                  <Input type="text" name="paperName" id="id_paperName" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="author" sm={2}>Author</Label>
                <Col sm={10}>
                  <Input type="text" name="author" id="id_paperAuthor" />
                </Col>
              </FormGroup>
              <FormGroup>
                {pickedQuizListHtml}
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
                  <Input type="text" id='id_course_filter_paper'/>
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroupAddon>author:</InputGroupAddon>
                  <Input type="text" id='id_author_filter_paper'/>
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup>
                  <InputGroupAddon>question</InputGroupAddon>
                  <Input type="text" id='id_question_filter_paper'/>
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
