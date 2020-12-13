import { SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { Recipe } from "../interfaces/Recipe";
import RecipePreview from "./RecipePreview";

interface Props {
    recipes: Recipe[];
}

export function RecipeList(props: Props) {
    return (<SimpleGrid paddingTop="2em"
    margin="auto"
    maxWidth="60em"
    columns={[1, 2, 3, 4]}
    spacing="1em">
    {props.recipes.map((recipe, index) => (<RecipePreview recipe={recipe} key={index}></RecipePreview>))}
  </SimpleGrid>);
}