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
    let examinationId = this.props.match.params.examinationId;
    let currentHost = window.location.host;
    //alert(currentHost);
    //var qrValue = "http://127.0.0.1:3000/examination/" + examinationId;
    let qrValue = "http://" + currentHost + "/examination/" + examinationId;
    let qrSize = 512
    let qrCode = <QRCode
                    value={qrValue}
                    size={qrSize}
                    fgColor="#000000"
                />
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