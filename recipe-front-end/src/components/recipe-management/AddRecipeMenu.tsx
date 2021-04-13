import React from "react";
import RecipeEditor from './RecipeEditor';

export default function AddRecipeMenu() {
   return <RecipeEditor defaultState={{
      title: '',
      ingredients: [],
      steps: '',
      image: '',
      id: -1
   }} />
}