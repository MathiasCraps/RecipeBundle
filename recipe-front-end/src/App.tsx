import { Box, Center, Heading } from "@chakra-ui/react";
import React from 'react';
import { connect } from 'react-redux';
import './App.scss';
import AccountMenu from "./components/account/AccountMenu";
import UserMenuButton from "./components/account/UserMenuButton";
import { RecipeList } from "./components/recipe-displays/RecipeList";
import RecipeOverview from "./components/recipe-displays/RecipeOverview";
import AddRecipeMenuButton from "./components/recipe-management/AddRecipeMenuButton";
import { Recipe } from "./interfaces/Recipe";
import { ReduxModel, ViewType } from './redux/Store';
import AddRecipeMenu from "./components/recipe-management/AddRecipeMenu";
import MenuPlanner from "./components/menu-planner/MenuPlanner";
import MenuPlannerButton from "./components/menu-planner/MenuPlannerButton";

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
        <UserMenuButton />
        <MenuPlannerButton />
        <AddRecipeMenuButton />
      </Box>
    </Center>
    <AccountMenu />
    {props.view === ViewType.AddRecipe && <AddRecipeMenu /> }
    {props.view === ViewType.RecipeView && <RecipeOverview /> }
    {props.view === ViewType.Overview && <RecipeList recipes={props.recipes} />}
    {props.view === ViewType.MenuPlanner && <MenuPlanner />}

  </header></Box>)
}

export default connect(mapStateToProps, {})(App);