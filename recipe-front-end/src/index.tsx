import { ChakraProvider } from "@chakra-ui/react";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from "./App";
import { Recipe } from "./interfaces/Recipe";
import { defaultState, handleState } from './redux/Store';

async function start() {
  const data = await fetch('http://localhost:8080/getRecipes')
  const recipes: Recipe[] = await data.json();

  let replicatedSet: Recipe[] = [];
  for (let i = 0; i < 5; i++) {
    replicatedSet = replicatedSet.concat(JSON.parse(JSON.stringify(recipes)));
  }

  const store = createStore(handleState, {
    ...defaultState,
    recipes: replicatedSet,
  });
  
  ReactDOM.render(
    <React.StrictMode>
      <ChakraProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

start();