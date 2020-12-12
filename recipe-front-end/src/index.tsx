import { ChakraProvider } from "@chakra-ui/react";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import { testData } from './redux/RecipeData';
import { store } from './redux/Store';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <App recipes={testData} />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);