import { AspectRatio, Box, Image } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { Recipe } from "../../interfaces/Recipe";
import { Paths } from '../../Paths';
import './RecipePreview.scss';

interface OwnProps {
  recipe: Recipe;
}

export default function RecipePreview(props: OwnProps) {
  return (<Box
    className="recipeBox"
    cursor="pointer"
    borderRadius="lg"
  ><Link to={`${Paths.RECIPE_OVERVIEW}/${props.recipe.id}`}>
      <strong className="recipe-preview-size">{props.recipe.title}</strong>
      <AspectRatio ratio={1}>
        <div style={{
          backgroundImage: `url(${props.recipe.image})`,
          backgroundSize: 'cover',
          width: "100%",
          height: "100%"
          
        }}></div>
      </AspectRatio>
    </Link>
  </Box>);
}
