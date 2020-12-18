import { SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { Recipe } from "../interfaces/Recipe";
import RecipePreview from "./RecipePreview";

interface Props {
  recipes: Recipe[];
}

var options = {
  paddingTop: "2em",
  margin: "auto",
  maxWidth: "80em",
  padding: "1em",
  columns: [1, 1, 2, 2, 3],
  spacing: "1em"
}

export function RecipeList(props: Props) {
  return (<SimpleGrid {...options}>
    {props.recipes.map((recipe, index) => (<RecipePreview recipe={recipe} key={index}></RecipePreview>))}
  </SimpleGrid>);
}