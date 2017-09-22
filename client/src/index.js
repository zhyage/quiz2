// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// //import App from './App';
//
// import { render } from 'react-dom';
// import { Router, Route, hashHistory } from 'react-router';
// import MyNav from './MyNav';
// import registerServiceWorker from './registerServiceWorker';
//
//  ReactDOM.render(<MyNav />, document.getElementById('root'));
//
// registerServiceWorker();


import React from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Switch, Route} from 'react-router-dom'
import MyNav from './MyNav'
import RQCode from './RQCode'
import PerformExamination from './PerformExamination'


ReactDOM.render((
  <BrowserRouter>
    {/*<MyNav />*/}
    <Switch>
      <Route exact path='/' component={MyNav}/>
      <Route path='/RQCode/:examinationId' component={RQCode}/>
      <Route path="/examination/:examinationId" component={PerformExamination}/>
      {/*/!* both /roster and /roster/:number begin with /roster *!/*/}
      {/*<Route path='/roster' component={Roster}/>*/}
      {/*<Route path='/schedule' component={Schedule}/>*/}
    </Switch>
  </BrowserRouter>
), document.getElementById('root'))