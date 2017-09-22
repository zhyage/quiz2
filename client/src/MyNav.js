import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Quiz from './Quiz';
import Paper from './Paper';
import Examination from './Examination';

export default class MyNav extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  render() {
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              quiz manager
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              examination paper manager
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              examination manager
            </NavLink>
          </NavItem>
          {/*<NavItem>*/}
            {/*<NavLink*/}
              {/*className={classnames({ active: this.state.activeTab === '4' })}*/}
              {/*onClick={() => { this.toggle('4'); }}*/}
            {/*>*/}
              {/*examination details*/}
            {/*</NavLink>*/}
          {/*</NavItem>*/}
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Quiz quiz />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <Paper paper />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <Examination examination />
              </Col>
            </Row>
          </TabPane>
          {/*<TabPane tabId="4">*/}
            {/*<Row>*/}
              {/*<Col sm="12">*/}
                {/*<Examination examination />*/}
              {/*</Col>*/}
            {/*</Row>*/}
          {/*</TabPane>*/}
        </TabContent>
      </div>
    );
  }
}
