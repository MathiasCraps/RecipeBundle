import { ChakraProvider } from "@chakra-ui/react";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from "./App";
import { Recipe } from "./interfaces/Recipe";
import { UserData } from "./interfaces/UserData";
import { defaultState, handleState } from './redux/Store';
import { parseGetParams } from "./utils/UrlUtils";

async function start() {
  const getParams = parseGetParams(window.location.search);
  const codeQuery = getParams.code ? `?code=${getParams.code}` : '';
  const apiKey = await fetch(`/getSessionData${codeQuery}`);
  const userData: UserData = await apiKey.json();

  const data = await fetch('/getRecipes')
  const recipes: Recipe[] = await data.json();

  let replicatedSet: Recipe[] = [];
  for (let i = 0; i < 5; i++) {
    replicatedSet = replicatedSet.concat(JSON.parse(JSON.stringify(recipes)));
  }

  const store = createStore(handleState, {
    ...defaultState,
    recipes: replicatedSet,
    loggedIn: userData.loggedIn,
    userName: userData.userName
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