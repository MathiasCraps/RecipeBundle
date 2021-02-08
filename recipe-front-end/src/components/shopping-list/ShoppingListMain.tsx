import React from 'react';
import { connect } from 'react-redux';
import { Ingredient } from '../../interfaces/Recipe';
import { Localisation } from '../../localisation/AppTexts';
import { DayMenu, ReduxModel } from '../../redux/Store';
import { calculateStartOfDate, FULL_DAY_IN_MS } from '../../utils/DateUtils';
import ContentContainer from '../common/ContentContainer';
import { combineToSingleValue } from './normalization/Combiner';
import { TableSpoonToGramRule } from './normalization/rules/TableSpoonToGramRule';
import { TeaSpoonToGramRule } from './normalization/rules/TeaSpoonToGramRule';
import { RulesHandler } from './normalization/RulesHandler';
import { sortByIngredient, SortedRecipeMap } from './normalization/SortRecipeMap';

interface ReduxProps {
    menus: DayMenu[];
}

export function mapStateToProps(reduxModel: ReduxModel): ReduxProps {
    return {
        menus: reduxModel.menuPlanning
    };
}

function selectMenuFromRange(menus: DayMenu[], fromTime: Date, toTime: Date) {
    return menus.filter((menu) => menu.date >= fromTime.getTime() && menu.date < toTime.getTime());
}

function formatDate(date: Date) {
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

export function ShoppingListMain(props: ReduxProps) {
    const startTime = calculateStartOfDate(new Date());
    const endTime = new Date(startTime.getTime() + (FULL_DAY_IN_MS * 7));

    const menusToConsider = selectMenuFromRange(props.menus, startTime, endTime);
    const ingredientsFromRecipes = menusToConsider.map(e => e.recipe.ingredients).flat(1);
    const rawSorted = sortByIngredient(ingredientsFromRecipes);
    const sumsToRender = combineToSingleValue(rawSorted);

    return <ContentContainer classes="shopping-list">
        <h2>{Localisation.SHOPPING_LIST}</h2>
        <p>{Localisation.YOUR_SHOPPING_LIST_FOR_THE_PERIOD} {formatDate(startTime)} - {formatDate(endTime)}:</p>

        <div>
            <ul>
                {sumsToRender.map((ingredient, index) => {
                    if (!ingredient.quantity_number) {
                        // no point in rendering this
                        return undefined;
                    } 
                    return <li key={index}><strong>{ingredient.name}</strong> ({ingredient.quantity_number} {ingredient.quantity_description.toLowerCase()})</li>
                })}
            </ul>
        </div>
    </ContentContainer>
}

export default connect(mapStateToProps)(ShoppingListMain);