import { ChakraProvider } from "@chakra-ui/react";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import App from "./App";
import { Recipe } from "./interfaces/Recipe";
import { BackEndUserData } from "./interfaces/UserData";
import { defaultState, handleState } from './redux/Store';
import { parseGetParams } from "./utils/UrlUtils";


async function start() {
  const getParams = parseGetParams(window.location.search);
  const codeQuery = getParams.code ? `?code=${getParams.code}` : '';
  const apiKey = await fetch(`/getSessionData${codeQuery}`);
  const userData: BackEndUserData = await apiKey.json();

  if (codeQuery && userData.loggedIn) {
    window.location.href = '/';
    return;
  }

  const data = await fetch('/getRecipes')
  const recipes: Recipe[] = await data.json();

  let replicatedSet: Recipe[] = [];
  for (let i = 0; i < 5; i++) {
    replicatedSet = replicatedSet.concat(JSON.parse(JSON.stringify(recipes)));
  }

  const store = createStore(handleState, {
    ...defaultState,
    recipes: replicatedSet,
    user: {
      loggedIn: userData.loggedIn,
      name: userData.userName
    }
  }, applyMiddleware(thunk));
  
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