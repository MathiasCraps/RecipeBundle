import { Heading } from '@chakra-ui/react';
import React from "react";
import { connect } from 'react-redux';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { Recipe } from '../../interfaces/Recipe';
import { Localisation } from '../../localisation/AppTexts';
import { Paths } from '../../Paths';
import { ReduxModel } from '../../redux/Store';
import ContentContainer from '../common/ContentContainer';
import RecipeEditor from './RecipeEditor';

interface ReduxProps {
    recipes: Recipe[];
}

function mapStateToProps(reduxModel: ReduxModel): ReduxProps {
    return {
        recipes: reduxModel.recipes
    };
}

export function EditRecipeMenu(props: ReduxProps) {
    const urlId = useRouteMatch<{ id: string | undefined }>(`${Paths.EDIT_RECIPE}/:id`)?.params.id;
    const recipe = urlId && props.recipes.filter((recipe) => Number(urlId) === recipe.id)[0];

    if (!urlId || !recipe) {
        return <Redirect to={Paths.BASE} />
    }

    return <ContentContainer>
        <Heading as="h2">{Localisation.EDIT_RECIPE}</Heading>
        <RecipeEditor defaultState={{
            ...recipe,
            ingredients: recipe.ingredients.map((ingredient) => { return { ...ingredient } })
        }} editingExisting={true} />
    </ContentContainer>
}

export default connect(mapStateToProps)(EditRecipeMenu);