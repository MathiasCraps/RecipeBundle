import React from "react";
import { connect } from 'react-redux';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { Recipe } from '../../interfaces/Recipe';
import { Paths } from '../../Paths';
import { ReduxModel } from '../../redux/Store';
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
    if (!urlId) {
        return <Redirect to={Paths.BASE}/>
    }

    const recipe = props.recipes[Number(urlId)];
    return <RecipeEditor defaultState={Object.assign({}, recipe)} editingExisting={true} />
}

export default connect(mapStateToProps)(EditRecipeMenu);