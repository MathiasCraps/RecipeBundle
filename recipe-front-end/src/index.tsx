import { ChakraProvider } from "@chakra-ui/react";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import App from "./App";
import { ApplicationData, RawDayMenu, Recipe } from "./interfaces/Recipe";
import { BackEndUserData } from "./interfaces/UserData";
import { DayMenu, defaultState, handleState, ReduxModel } from './redux/Store';
import { filterUndefined } from "./utils/ArrayUtils";
import { parseGetParams } from "./utils/UrlUtils";

function findMenu(menu: RawDayMenu, recipes: Recipe[]): DayMenu | undefined {
  const entry = recipes.filter((recipe) => recipe.id === menu.recipeId)[0];

  if (!entry) {
    return undefined;
  }

  return {
    ...menu,
    recipe: entry
  };
}

(async function start() {
  const getParams = parseGetParams(window.location.search);
  const codeQuery = getParams.code ? `?code=${getParams.code}` : '';
  const apiKey = await fetch(`/getSessionData${codeQuery}`);
  const userData: BackEndUserData = await apiKey.json();

  if (codeQuery && userData.loggedIn) {
    window.location.href = '/';
    return;
  }

  const data = await fetch('/getRecipes')
  const applicationData: ApplicationData = await data.json();
  const linkedMenu: DayMenu[] = applicationData.menus
    .map((menu) => findMenu(menu, applicationData.recipes))
    .filter(filterUndefined) as DayMenu[];

  const store = createStore(handleState, {
    ...defaultState,
    user: {
      loggedIn: userData.loggedIn,
      name: userData.userName
    },
    recipes: applicationData.recipes,
    menuPlanning: linkedMenu
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
})();