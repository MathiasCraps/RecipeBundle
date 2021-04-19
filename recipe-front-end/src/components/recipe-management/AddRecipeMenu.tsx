import { Heading } from '@chakra-ui/react';
import React from "react";
import { Localisation } from '../../localisation/AppTexts';
import ContentContainer from '../common/ContentContainer';
import RecipeEditor from './RecipeEditor';

export default function AddRecipeMenu() {
   return <ContentContainer>
      <Heading as="h2">{Localisation.ADD_OWN_RECIPE}</Heading>
      <RecipeEditor defaultState={{
         title: '',
         ingredients: [],
         steps: '',
         image: '',
         id: -1
      }} editingExisting={false} />
   </ContentContainer>
}