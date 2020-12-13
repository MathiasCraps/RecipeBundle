import { ChakraProvider } from "@chakra-ui/react";
import React from 'react';
import { createStore } from 'redux';
import ReactDOM from 'react-dom';
import { Provider,  } from 'react-redux';
import App from "./App";
import './index.css';
import { handleState, ViewType } from './redux/Store';
import { Recipe } from "./interfaces/Recipe";

async function start() {
  const data = await fetch('http://localhost:8080/getRecipes')
  const recipes: Recipe[] = await data.json();
  const store = createStore(handleState, {
    view: ViewType.Overview,
    recipes: recipes,
    activeRecipe: undefined
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