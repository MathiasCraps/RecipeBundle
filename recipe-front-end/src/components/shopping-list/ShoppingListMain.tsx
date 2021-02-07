import React from 'react';
import { connect } from 'react-redux';
import { Ingredient } from '../../interfaces/Recipe';
import { Localisation } from '../../localisation/AppTexts';
import { DayMenu, ReduxModel } from '../../redux/Store';
import { calculateStartOfDate, FULL_DAY_IN_MS } from '../../utils/DateUtils';
import ContentContainer from '../common/ContentContainer';
import { TableSpoonToGramRule } from './normalization/rules/TableSpoonToGramRule';
import { TeaSpoonToGramRule } from './normalization/rules/TeaSpoonToGramRule';
import { RulesHandler } from './normalization/RulesHandler';

interface ReduxProps {
    menus: DayMenu[];
}

export function mapStateToProps(reduxModel: ReduxModel): ReduxProps {
    return {
        menus: reduxModel.menuPlanning
    };
}

type SortedRecipeMap = { [key: string]: Ingredient[] };
function sortByIngredient(menus: DayMenu[]): SortedRecipeMap {
    const recipeMap: SortedRecipeMap = {};

    for (const dayMenu of menus) {
        for (const ingredient of dayMenu.recipe.ingredients) {
            if (!recipeMap[ingredient.name]) {
                recipeMap[ingredient.name] = [];
            }

            recipeMap[ingredient.name].push(ingredient);
        }
    }

    return recipeMap;
}

const rulesHandler = new RulesHandler([
    new TableSpoonToGramRule(), 
    new TeaSpoonToGramRule()
]);

function combineToSingleValue(sortedRecipeMap: SortedRecipeMap): Ingredient[] {
    const keys = Object.keys(sortedRecipeMap);
    return keys.map((key) => {
        const recipeMap: Ingredient[] = sortedRecipeMap[key];
        const ingredients = rulesHandler.normalize(recipeMap);
        return {
            name: key,
            quantity_number: ingredients.reduce((previous, current) => {
                return previous + current.quantity_number!;
            }, 0),
            quantity_description: ingredients[0].quantity_description
        }
    })
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
    const rawSorted = sortByIngredient(menusToConsider);
    const sumsToRender = combineToSingleValue(rawSorted);

    return <ContentContainer classes="shopping-list">
        <h2>{Localisation.SHOPPING_LIST}</h2>
        <p>{Localisation.YOUR_SHOPPING_LIST_FOR_THE_PERIOD} {formatDate(startTime)} - {formatDate(endTime)}:</p>

        <div>
            <ul>
                {sumsToRender.map((ingredient, index) => {
                    return <li key={index}><strong>{ingredient.name}</strong> ({ingredient.quantity_number} {ingredient.quantity_description.toLowerCase()})</li>
                })}
            </ul>
        </div>
    </ContentContainer>
}

export default connect(mapStateToProps)(ShoppingListMain);