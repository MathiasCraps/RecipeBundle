import { ChakraProvider } from "@chakra-ui/react";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import App from "./App";
import { ApplicationData, RawDayMenu, Recipe } from "./interfaces/Recipe";
import { BackEndUserData } from "./interfaces/UserData";
import { DayMenu, defaultState, handleState } from './redux/Store';
import { calculateStartOfDate, parseDateRange } from "./utils/DateUtils";
import { parseGetParams } from "./utils/UrlUtils";
import { BrowserRouter as Router } from 'react-router-dom';
import fetchGraphQL from './utils/FetchGraphQL';
import { LOCAL_STORAGE_RANGE_NAME } from './redux/Actions';

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

  const applicationData = await fetchGraphQL<ApplicationData>(`{ 
    recipes {
      id
      title
      steps
      image
      ingredients {
        name
        quantity_number
        quantity_description
        categoryId
        categoryName
      }
    }
    menus {
      date
      menuId
      recipeId
      ingredientsBought
    }
    categories {
      categoryId
      categoryName
    }
  }`);

  const linkedMenu: DayMenu[] = applicationData.menus
    .map((menu) => findMenu(menu, applicationData.recipes))
    .filter((value) => value !== undefined) as DayMenu[];


  const shoppingRangeFromStorage = localStorage.getItem(LOCAL_STORAGE_RANGE_NAME);
  const shoppingDateRange = parseDateRange(shoppingRangeFromStorage, Number(new Date()))
    || defaultState.shoppingDateRange;

  const store = createStore(handleState, {
    ...defaultState,
    ...{ shoppingDateRange },
    user: {
      loggedIn: userData.loggedIn,
      name: userData.userName
    },
    activeDay: calculateStartOfDate(new Date()).getTime(), // use today as starting date
    recipes: applicationData.recipes,
    categories: applicationData.categories,
    menuPlanning: linkedMenu
  }, applyMiddleware(thunk));

  ReactDOM.render(
    <React.StrictMode>
      <ChakraProvider>
        <Provider store={store}>
          <Router>
            <App />
          </Router>
        </Provider>
      </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
})();