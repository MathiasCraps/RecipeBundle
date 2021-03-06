import { Box, Center, Heading } from "@chakra-ui/react";
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from "react-router-dom";
import './App.scss';
import AccountMenu from "./components/account/AccountMenu";
import ActionsContainer from './components/common/ActionsContainer';
import MenuPlanner from "./components/menu-planner/MenuPlanner";
import { RecipeList } from "./components/recipe-displays/RecipeList";
import RecipeOverview from "./components/recipe-displays/RecipeOverview";
import AddRecipeMenu from "./components/recipe-management/AddRecipeMenu";
import ShoppingListMain from './components/shopping-list/ShoppingListMain';
import { Recipe } from "./interfaces/Recipe";
import { Paths } from './Paths';
import { ReduxModel } from './redux/Store';

interface AppProps {
  recipes: Recipe[];
}

function mapStateToProps(props: ReduxModel): AppProps {
  return {
    recipes: props.recipes
  };
}

function App(props: AppProps) {
  return (<Box><header>
    <Center className="top-header">
      <Heading as="h1">👨‍🍳 Rebundle 👩🏻‍🍳</Heading>
      <Box className="headers-side-icons">
        <ActionsContainer />
      </Box>
    </Center>
    <AccountMenu />
      <Switch>
        <Route path={Paths.ADD_RECIPE}><AddRecipeMenu /></Route>
        <Route path={Paths.RECIPE_OVERVIEW}><RecipeOverview /></Route>
        <Route path={Paths.PLANNER}><MenuPlanner /></Route>
        <Route path={Paths.LIST}><ShoppingListMain /></Route>
        <Route path={Paths.BASE}><RecipeList recipes={props.recipes} /></Route>
      </Switch>
  </header></Box>)
}

export default connect(mapStateToProps)(App);