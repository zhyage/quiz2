import React, {Component} from 'react';
import createReactClass from 'create-react-class';
import Popup from 'react-popup';
import QRCode from 'qrcode.react';
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

class Examination extends Component {

  examinationStateEnum = {
    READY : 1,
    ONGOING : 2,
    FINISHED :3
};


  constructor(props) {
  super(props);


  this.state = {
    examinationId: 0,
    // disorderQuizs: false,
    // disorderOptions: false,
    pickedQuizList: [],
    allPaperList: [],
    allExaminationList:[],
    showExaminationDetail: {examinationId: -1, action:false}
  };

  this.examinationDetail = {};

};

  componentDidMount() {
    console.info("come into componentDidMount");
    this.onGetPaper();
    this.onGetExamination();
  }

  onAddPaperToExamination(id){
    console.info("onAddPaperToExamination");
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
          let selectQuizList = that.state.pickedQuizList.concat(getQuizList);
          that.setState({
            pickedQuizList: selectQuizList
          })
        }
      })
  }

  getExaminationDetailByExaminationId(id){
    console.info("getExaminationDetailByExaminationId id : ", id);
    let that = this;
    fetch('/getExaminationDetailByExaminationId', {
      method: "POST",
      headers: new Headers({
        'Content-Type': "application/json; charset=utf-8"
      }),
      body: JSON.stringify({examinationId:id})
    })
      .then(function (res) {
        return res.json();
      })
      .then(function(response){
        console.info("get getExaminationDetailByExaminationId response : ", (response));
        if(response.state === true){
          console.info("get getExaminationDetailByExaminationId response : ", response.data);
          let examinatinDetail = response.data;
          console.info("examinatinDetail : ", examinatinDetail);
          that.examinationDetail = examinatinDetail;
        }
      })
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
    document.getElementById('id_examinationName').value = "";
    document.getElementById('id_examinationAuthor').value = "";
    document.getElementById('id_disorderQuizs').checked = false;
    document.getElementById('id_disorderOptions').checked = false;

    this.setState({
      pickedQuizList:[],
      paperId:0
    });

  }

  onSubmit() {
    let submitExamination = {
      _id:0,
      examinationName:"",
      examinationAuthor:"",
      examinationState:"",
      disorderQuizs:false,
      disorderOptions:false,
      quizList:[]
    }

    submitExamination.examinationName = document.getElementById('id_examinationName').value.trim();
    submitExamination.examinationAuthor = document.getElementById('id_examinationAuthor').value.trim();
    submitExamination.examinationState = this.examinationStateEnum.READY;
    submitExamination.disorderQuizs = document.getElementById('id_disorderQuizs').checked;
    submitExamination.disorderOptions = document.getElementById('id_disorderOptions').checked;
    submitExamination.quizList = this.state.pickedQuizList;

    console.log(submitExamination);
    if(this.checkFormInput(submitExamination)){
      console.log("ready to submit");
      this.submitExaminaitonToServer(submitExamination)
    }

  }

  onExaminationFilter(){
    console.info("come into onExaminationFilter");
    this.onGetExamination();
  }

  onExaminationClearFilter(){
    document.getElementById('id_examinationName_filter').value="";
    document.getElementById('id_examinationAuthor_filter').value="";
    this.onGetExamination();
  }

  onGetExamination() {
    let nameFilter = document.getElementById('id_examinationName_filter').value;
    let authorFilter = document.getElementById('id_examinationAuthor_filter').value;
    console.info("in onGetExamination : " + nameFilter + authorFilter);
    let pattern = {
      _id:0,
      examinationName:nameFilter,
      examinationAuthor:authorFilter,
    };
    this.getExaminationFromServer(pattern);
  }

  onStartExamination(id) {
    let examinationId = this.state.allExaminationList[id]._id;
    let info = {
      id:examinationId,
      action:'start'
    };
    this.triggerExaminationFromServer(info);
    //this.onGetExamination();
  }

  onStopExamination(id) {
    let examinationId = this.state.allExaminationList[id]._id;
    let info = {
      id:examinationId,
      action:'stop'
    };
    this.triggerExaminationFromServer(info);
    //this.onGetExamination();
  }

  onDelExamination(id) {
    let examinationList = this.state.allExaminationList;
    if ((!Number.isInteger(id)) || (id < 0) || (id >= examinationList.length)) {
      alert("Can't find this examination!!!");
      return;
    }
    let res = window.confirm("did you want delete " + examinationList[id].examinationName);
    if(true === res){
      this.delExaminationFromServer(examinationList[id]._id);
      this.onGetExamination();
    }
  }


  onGetExaminationDetail2(id) {
    console.info("come into onGetExaminationDetail, id : ", id);
    let examinationList = this.state.allExaminationList;
    if ((!Number.isInteger(id)) || (id < 0) || (id >= examinationList.length)) {
      alert("Can't find this examination!!!");
      return;
    }
    var path='/RQCode/' +  examinationList[id]._id;
    window.open(path);
  }

  onGetExaminationDetail(id) {
    console.info("come into onGetExaminationDetail2, id : ", id);
    let examinationList = this.state.allExaminationList;
    if ((!Number.isInteger(id)) || (id < 0) || (id >= examinationList.length)) {
      alert("Can't find this examination!!!");
      return;
    }
    this.setState({
      showExaminationDetail:{examinationId: examinationList[id]._id, action:true}
    });

  }

  onCloseExaminationDetail(){
    this.setState({
      showExaminationDetail:{examinationId: -1, action:false}
    });
  }

  delExaminationFromServer(id) {
    fetch('/delExamination', {
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

  triggerExaminationFromServer(info) {
    let that = this;
    fetch('/triggerExamination', {
      method: "POST",
      headers: new Headers({
        'Content-Type': "application/json; charset=utf-8"
      }),
      body: JSON.stringify(info)
    })
      .then(function (res) {
        //console.info("get quiz res json : ", res.json());
        return res.json();
      })
      .then(function(response){
        console.info("trigger examination response : ", (response));
        if(response.state === true){
          that.onGetExamination()
        }
      })
  }

  getExaminationFromServer(pattern) {
    let that = this;
    fetch('/getExamination', {
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
        console.info("get examination response : ", (response));
        if(response.state === true){
          let examinationList = response.data;
          console.info("get examination response : ", response.data);
          that.setState({
            allExaminationList: examinationList
          })
        }
      })
  }

  checkFormInput(submitExamination){
    if(submitExamination.examinationName.length === 0){
      alert("Please input Name !");
      return false;
    }
    if(submitExamination.examinationAuthor.length === 0){
      alert("Please input author !");
      return false;
    }
    if(submitExamination.quizList.length === 0){
      alert("Please select paper !");
      return false;
    }
    return true;
  }

  submitExaminaitonToServer(submitExamination) {
    let that = this;
    fetch('/submitExamination', {
      method: "POST",
      headers: new Headers({
        'Content-Type': "application/json; charset=utf-8"
      }),
      body: JSON.stringify(submitExamination)
    })
      .then(function (res) {
        return res.json();
      })
      .then(function(response){
        console.info("get submitExamination response : ", response);
        alert(response.msg);
        if(response.state === true){
          that.onClear();
        }
        that.onGetExamination();
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

  generatePaperListHtml() {
    let paperList = this.state.allPaperList;
    console.info("generatePaperListHtml : ", paperList);
    let generateHtml = [];
    for (let i = 0; i < paperList.length; i++) {
      let tId = "id_paper_" + i;
      let add_button = <InputGroupButton><Button onClick={this.onAddPaperToExamination.bind(this, i)}>&#9654;</Button></InputGroupButton>
      let showValue = paperList[i].paperName;
      let onePaperHtml = <FormGroup row> <InputGroup>
        <Input type="textarea" id={tId} value={showValue}/>
        {add_button}
      </InputGroup> </FormGroup>
      generateHtml.push(onePaperHtml)
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


  generateExaminationListHtml() {
    let examinationList = this.state.allExaminationList;
    console.info("generateExaminationListHtml : ", examinationList);
    let generateHtml = [];
    let examinationStateHtml = "";
    let startExaminationButtonHtml = "";
    for (let i = 0; i < examinationList.length; i++) {
      let tId = "id_examination_" + i;
      let delete_button = <InputGroupButton><Button onClick={this.onDelExamination.bind(this, i)}>Delete</Button></InputGroupButton>
      let get_detail_button = <InputGroupButton><Button onClick={this.onGetExaminationDetail.bind(this, i)}>Get detail</Button></InputGroupButton>
      let get_detail_button2 =  <InputGroupButton><Button onClick={this.onGetExaminationDetail2.bind(this, i)}>Get detail2</Button></InputGroupButton>

      if (examinationList[i].examinationState === this.examinationStateEnum.READY){
        examinationStateHtml = <InputGroupButton color="warning">ready</InputGroupButton>
        startExaminationButtonHtml =  <InputGroupButton><Button onClick={this.onStartExamination.bind(this, i)}>Start</Button></InputGroupButton>
      } else if(examinationList[i].examinationState === this.examinationStateEnum.ONGOING){
        examinationStateHtml = <InputGroupButton color="success">ongoing</InputGroupButton>
        startExaminationButtonHtml = <InputGroupButton><Button onClick={this.onStopExamination.bind(this, i)}>Stop</Button></InputGroupButton>
      }else {
        examinationStateHtml = <InputGroupButton color="danger">finished</InputGroupButton>
      }
      let showValue = examinationList[i].examinationName;
      let oneExaminationHtml = <FormGroup row> <InputGroup>
        <Input type="textarea" id={tId} value={showValue}/>
        {examinationStateHtml}
        {delete_button}

        {startExaminationButtonHtml}

        {get_detail_button}
        {get_detail_button2}

        {/*{modify_button}*/}
        {/*{delete_button}*/}
        {/*{add_button}*/}
      </InputGroup> </FormGroup>
      generateHtml.push(oneExaminationHtml)
    }
    console.log(generateHtml);
    return generateHtml;

  }

  generateExaminationDetailHtml(){
    console.info("this.examinationDetail : ", this.examinationDetail);
    if(this.examinationDetail.examinationState == this.examinationStateEnum.READY){
      return <h1>Examination State : Ready</h1>
    }else if (this.examinationDetail.examinationState == this.examinationStateEnum.ONGOING){
      return <h1>Examination State : Ongoing</h1>
    }else {
      return <h1>Examination State : Finished</h1>
    }
  }


  render() {
    if(this.state.showExaminationDetail.action) {
      console.info("come into showExaminationDetail render");
      this.getExaminationDetailByExaminationId(this.state.showExaminationDetail.examinationId);
      return (
        <Container>
          <Row>
            {this.generateExaminationDetailHtml()}
          </Row>
          <Row>
            <Button onClick={this.onCloseExaminationDetail.bind(this)}>Close</Button>
          </Row>

        </Container>
      );

    }else {
      console.info("come to examination render");
      let paperListHtml = this.generatePaperListHtml();
      let pickedQuizListHtml = this.generatePicketListHtml();
      let examinationListHtml = this.generateExaminationListHtml();
      return (
        <Container>
          <Row>
            <Col>
              <Row>
                Examination paper list
              </Row>
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
                  <Label for="examinationName" sm={2}>Name</Label>
                  <Col sm={10}>
                    <Input type="text" name="examinationName" id="id_examinationName"/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="author" sm={2}>Author</Label>
                  <Col sm={10}>
                    <Input type="text" name="author" id="id_examinationAuthor"/>
                  </Col>
                </FormGroup>
                <FormGroup>
                  {pickedQuizListHtml}
                </FormGroup>
                <InputGroup>
                  <InputGroupAddon>
                    <Input addon type="checkbox" name="disorderQuizs"
                           id="id_disorderQuizs" /*onclick={this.onDisorderQuizs.bind(this)}*//>
                  </InputGroupAddon>
                  <Input placeholder="Disorder questions"/>
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon>
                    <Input addon type="checkbox" name="disorderOptions"
                           id="id_disorderOptions" /*onclick={this.onDisorderOptions.bind(this)}*//>
                  </InputGroupAddon>
                  <Input placeholder="Disorder options"/>
                </InputGroup>
                <FormGroup check row>
                  <Col sm={{size: 10, offset: 2}}>
                    <Button onClick={this.onSubmit.bind(this)}>Submit</Button>
                    {/*<Button onClick={this.onClear.bind(this)}>Clear</Button>*/}
                  </Col>
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Row>
                Examination List
              </Row>
              <Row>
                <Col>
                  <InputGroup>
                    <InputGroupAddon>name:</InputGroupAddon>
                    <Input type="text" id='id_examinationName_filter'/>
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup>
                    <InputGroupAddon>author:</InputGroupAddon>
                    <Input type="text" id='id_examinationAuthor_filter'/>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col xs='6'>
                  <Button onClick={this.onExaminationFilter.bind(this)}>Filter</Button>
                </Col>
                <Col xs='6'>
                  <Button onClick={this.onExaminationFilter.bind(this)}>Clear Filter</Button>
                </Col>
                {examinationListHtml}
              </Row>
              {/*show state*/}
              {/*</Row>*/}
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default Examination;
