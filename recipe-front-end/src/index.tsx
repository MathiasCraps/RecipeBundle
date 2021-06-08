import { ChakraProvider } from "@chakra-ui/react";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import App from "./App";
import { ApplicationData, BaseIngredient, Category, QuantifiedIngredient, QuantityDescription, RawDayMenu, RawInventoryItem, RawRecipe, Recipe } from "./interfaces/Recipe";
import { BackEndUserData } from "./interfaces/UserData";
import { Paths } from './Paths';
import { LOCAL_STORAGE_RANGE_NAME } from './redux/Actions';
import { DayMenu, defaultState, handleState, InventoryItem } from './redux/Store';
import { convertArrayToLinkedMap } from './utils/ArrayUtils';
import { calculateStartOfDate, parseDateRange } from "./utils/DateUtils";
import fetchGraphQL from './utils/FetchGraphQL';
import { parseGetParams } from "./utils/UrlUtils";

function linkRecipeData(recipes: RawRecipe[], categories: Category[], quantityDescriptions: QuantityDescription[]): Recipe[] {
  const linkedMapCategories = convertArrayToLinkedMap(categories, 'categoryId');
  const linkedMapQuantityDescription = convertArrayToLinkedMap(quantityDescriptions, 'quantityDescriptorId');

  return recipes.map((recipe) => {
    return {
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) => {
        return {
          ...ingredient,
          category: linkedMapCategories[ingredient.categoryId],
          quantityDescription: linkedMapQuantityDescription[ingredient.quantity_description_id]
        } as QuantifiedIngredient;
      })
    };
  });
}

function linkInventory(rawInventory: RawInventoryItem[], ingredients: BaseIngredient[], quantityDescriptions: QuantityDescription[]): InventoryItem[] {
  const linkedMap = convertArrayToLinkedMap(ingredients, 'id');
  const linkedMapQuantityDescription = convertArrayToLinkedMap(quantityDescriptions, 'quantityDescriptorId');
  return rawInventory.map((inventoryItem) => {
    return {
      ...inventoryItem,
      ingredient: linkedMap[inventoryItem.ingredientId],
      quantityDescription: linkedMapQuantityDescription[inventoryItem.quantity_description_id]
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
        categoryId
        quantity_description_id
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
      desiredQuantity
    }
    quantityDescriptions {
      quantityDescriptorId
      name
      translations {
        nl
      }
    }
  }`);

  const linkedRecipes = linkRecipeData(applicationData.recipes, applicationData.categories, applicationData.quantityDescriptions);
  const inventory = linkInventory(applicationData.inventories, applicationData.ingredients, applicationData.quantityDescriptions);

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
    quantityDescriptions: applicationData.quantityDescriptions,
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