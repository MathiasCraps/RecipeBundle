import React from 'react';
import './App.css';
import RecipePreview from './components/RecipePreview';
import { Recipe } from './interfaces/Recipe';
import { Box, SimpleGrid, Heading, Center } from "@chakra-ui/react";

interface AppProps {
  recipes: Recipe[];
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

export default App;
