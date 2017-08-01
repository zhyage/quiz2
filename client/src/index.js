import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import MyNav from './MyNav';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<MyNav />, document.getElementById('root'));
registerServiceWorker();
