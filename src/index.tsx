import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.less';
import 'antd/dist/antd.min.css';
import Root from './items/Root'; 

ReactDOM.render(
  <Root>
    <App />
  </Root>,
  document.getElementById('online-ide')
);
