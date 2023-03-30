# React 中的 Shadow DOM 事件测试

## React 18

```
npm i 
npm start
```

## React 16

```
npm i react@16 react-dom@16 --save
```

更改 `src/index.js`，支持 React 16 

``` javascript
// // React 18.x 语法
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';


// const $app = document.getElementById('app');
// const $root = $app.shadowRoot.getElementById('root');
// const root = ReactDOM.createRoot($root);

// root.render(
//   // <React.StrictMode>
//     <App />
//   // </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


// React 16.x 语法
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const $app = document.getElementById('app');
const $root = $app.shadowRoot.getElementById('root');
ReactDOM.render(<App />, $root);
```
