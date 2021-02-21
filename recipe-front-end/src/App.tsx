import { Box, Center, Heading } from "@chakra-ui/react";
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.scss';
import AccountMenu from "./components/account/AccountMenu";
import ActionsContainer from './components/common/ActionsContainer';
import MenuPlanner from "./components/menu-planner/MenuPlanner";
import { RecipeList } from "./components/recipe-displays/RecipeList";
import RecipeOverview from "./components/recipe-displays/RecipeOverview";
import AddRecipeMenu from "./components/recipe-management/AddRecipeMenu";
import ShoppingListMain from './components/shopping-list/ShoppingListMain';
import { Recipe } from "./interfaces/Recipe";
import { ReduxModel, ViewType } from './redux/Store';

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
    <Router>
      <Switch>
        <Route path="/addrecipe"><AddRecipeMenu /></Route>
        <Route path="/recipeview"><RecipeOverview /></Route>
        <Route path="/menuplanner"><MenuPlanner /></Route>
        <Route path="/shoppinglist"><ShoppingListMain /></Route>
        <Route path="/"><RecipeList recipes={props.recipes} /></Route>
      </Switch>
    </Router>
  </header></Box>)
}

export default connect(mapStateToProps, {})(App);