import { Box, Center, Heading } from "@chakra-ui/react";
import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import { RecipeList } from "./components/RecipeList";
import { Recipe } from "./interfaces/Recipe";
import { ReduxModel, ViewType } from './redux/Store';

interface AppProps {
  recipes: Recipe[];
  view: ViewType;
}

function mapStateToProps(props: ReduxModel) {
  return {
    recipes: props.recipes,
    view: props.view
  };
}

function App(props: AppProps) {
  return (<Box>
    <header>
      <Center bgColor="gray.100" p="0.5em">
        <Heading as="h1">Rebundle</Heading>
      </Center>
    </header>
    <RecipeList recipes={props.recipes}></RecipeList>
  </Box>);
}

export default connect(mapStateToProps, {})(App);