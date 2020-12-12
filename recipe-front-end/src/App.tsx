import { Box, Center, Heading, SimpleGrid } from "@chakra-ui/react";
import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import RecipePreview from './components/RecipePreview';
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
  return (
    <Box>
      <header>
        <Center bgColor="gray.100" p="0.5em">
          <Heading as="h1">Rebundle</Heading>
        </Center>
      </header>
      <SimpleGrid paddingTop="2em"
        margin="auto"
        maxWidth="60em"
        columns={[1, 2, 3, 4]}
        spacing="1em">
        {props.recipes.map((data, index) => (<RecipePreview {...data} key={index}></RecipePreview>))}
      </SimpleGrid>
    </Box>);
}

export default connect(mapStateToProps, {})(App);