import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import './index.css';
import App from './components/app/app';
import registerServiceWorker from './registerServiceWorker';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAUjeLr055fqDTKmE70Nhx8-xzGBmKiWnc",
  authDomain: "cs-software-engineering.firebaseapp.com",
  databaseURL: "https://cs-software-engineering.firebaseio.com",
  projectId: "cs-software-engineering",
  storageBucket: "cs-software-engineering.appspot.com",
  messagingSenderId: "105875258848"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
