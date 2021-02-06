import { Box, Center, Heading } from "@chakra-ui/react";
import React from 'react';
import { connect } from 'react-redux';
import './App.scss';
import AccountMenu from "./components/account/AccountMenu";
import ActionsContainer from './components/common/ActionsContainer';
import MenuPlanner from "./components/menu-planner/MenuPlanner";
import { RecipeList } from "./components/recipe-displays/RecipeList";
import RecipeOverview from "./components/recipe-displays/RecipeOverview";
import AddRecipeMenu from "./components/recipe-management/AddRecipeMenu";
import { ShoppingListMain } from './components/shopping-list/ShoppingListMain';
import { Recipe } from "./interfaces/Recipe";
import { ReduxModel, ViewType } from './redux/Store';

interface AppProps {
  recipes: Recipe[];
  view: ViewType;
  activeRecipe: Recipe | undefined;
}

function mapStateToProps(props: ReduxModel): AppProps {
  return {
    recipes: props.recipes,
    view: props.view,
    activeRecipe: props.activeRecipe
  };
}

function App(props: AppProps) {
  return (<Box><header>
    <Center className="top-header">
      <Heading as="h1">👨‍🍳 Rebundle 👩🏻‍🍳</Heading>
      <Box className="headers-side-icons">
        <ActionsContainer/>
      </Box>
    </Center>
    <AccountMenu />
    {props.view === ViewType.AddRecipe && <AddRecipeMenu /> }
    {props.view === ViewType.RecipeView && <RecipeOverview /> }
    {props.view === ViewType.Overview && <RecipeList recipes={props.recipes} />}
    {props.view === ViewType.MenuPlanner && <MenuPlanner />}
    {props.view === ViewType.ShoppingList && <ShoppingListMain />}

  </header></Box>)
}

export default connect(mapStateToProps, {})(App);