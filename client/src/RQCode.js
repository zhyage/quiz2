import React, {Component} from 'react';
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

class RQCode extends Component {

  generateQrcodeHtml(){
    var examinationId = this.props.match.params.examinationId;
    var qrValue = "http://127.0.0.1:3000/examination/" + examinationId;
    var qrCode = <QRCode value={qrValue} />
    return qrCode
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            hello RQCode !!!!
            {/*alert({this.props.params})*/}
            {this.props.match.params.examinationId}
            {this.generateQrcodeHtml()}
          </Col>
        </Row>
      </Container>
    );
  }

}

export default RQCode;