import React from 'react';
import './App.css';
import RecipePreview from './components/RecipePreview';
import { Recipe } from './interfaces/Recipe';
import { SimpleGrid } from "@chakra-ui/react";

interface AppProps {
    recipes: Recipe[];
}

function App(props: AppProps) {
  return (<SimpleGrid
    margin="auto"
    maxWidth="60em"
    columns={[1, 2, 3, 4]}
    spacing="1em">
    {props.recipes.map((data, index) => (<RecipePreview {...data} key={index}></RecipePreview>))}
  </SimpleGrid>);
}

export default App;
