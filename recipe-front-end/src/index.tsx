import { ChakraProvider } from "@chakra-ui/react";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import App from "./App";
import { ApplicationData, BaseIngredient, Category, Ingredient, RawDayMenu, RawInventoryItem, RawRecipe, Recipe } from "./interfaces/Recipe";
import { BackEndUserData } from "./interfaces/UserData";
import { Paths } from './Paths';
import { LOCAL_STORAGE_RANGE_NAME } from './redux/Actions';
import { DayMenu, defaultState, handleState, InventoryItem } from './redux/Store';
import { convertArrayToLinkedMap } from './utils/ArrayUtils';
import { calculateStartOfDate, parseDateRange } from "./utils/DateUtils";
import fetchGraphQL from './utils/FetchGraphQL';
import { parseGetParams } from "./utils/UrlUtils";

function linkCategories(recipes: RawRecipe[], categories: Category[]): Recipe[] {
  const linkedMap = convertArrayToLinkedMap(categories, 'categoryId');

  return recipes.map((recipe) => {
    return {
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) => {
        return {
          ...ingredient,
          category: linkedMap[ingredient.categoryId]
        } as Ingredient;
      })
    };
  });
}

function linkInventory(rawInventory: RawInventoryItem[], ingredients: BaseIngredient[]): InventoryItem[] {
  const linkedMap = convertArrayToLinkedMap(ingredients, 'id');
  return rawInventory.map((inventoryItem) => {
    return {
      ingredient: linkedMap[inventoryItem.ingredientId],
      quantity: inventoryItem.quantity
    }
  });
}

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
    window.location.href = Paths.BASE;
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
        id
        quantity_number
        quantity_description
        categoryId
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
      translations {
        nl
      }
    }
    ingredients {
      id
      name
      categoryId
      categoryName
    }
    inventories {
      ingredientId
      quantity
    }
  }`);

  const linkedRecipes = linkCategories(applicationData.recipes, applicationData.categories);
  const inventory = linkInventory(applicationData.inventories, applicationData.ingredients);

  const linkedMenu: DayMenu[] = applicationData.menus
    .map((menu) => findMenu(menu, linkedRecipes))
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
    recipes: linkedRecipes,
    categories: applicationData.categories,
    menuPlanning: linkedMenu,
    ingredients: applicationData.ingredients,
    inventory: inventory
  }, applyMiddleware(thunk));

  ReactDOM.render(
    <React.StrictMode>
      <ChakraProvider>
        <Provider store={store}>
          <HashRouter>
            <App />
          </HashRouter>
        </Provider>
      </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
})();