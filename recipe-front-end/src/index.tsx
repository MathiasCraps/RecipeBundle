import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

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