import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

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