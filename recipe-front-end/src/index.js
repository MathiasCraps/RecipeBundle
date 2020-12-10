import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

var recipes = [
  {
    title: 'Recept 1',
    content: 'Lorem ipsum fanta.'
  }, {
    title: 'Recept 2',
    content: 'Lorem ipsum soda.'
  }, {
    title: 'Recept 1',
    content: 'Lorem ipsum cola.'
  }, {
    title: 'Recept 1',
    content: 'Lorem ipsum pretzel.'
  }
]

ReactDOM.render(
  <React.StrictMode>
    <App recipes={recipes} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
