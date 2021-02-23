import React from 'react';
import { connect } from 'react-redux';
import { Localisation } from '../../localisation/AppTexts';
import { Paths } from '../../Paths';
import { DateRange, DayMenu, ReduxModel } from '../../redux/Store';
import ContentContainer from '../common/ContentContainer';
import { combineToSingleValue } from './normalization/Combiner';
import { TableSpoonToGramRule } from './normalization/rules/TableSpoonToGramRule';
import { TeaSpoonToGramRule } from './normalization/rules/TeaSpoonToGramRule';
import { RulesHandler } from './normalization/RulesHandler';
import { sortByIngredient } from './normalization/SortRecipeMap';
import RangePicker from './range-picker/RangePicker';
import { ShoppingIngredient } from './ShoppingIngredient';
import { Redirect } from "react-router-dom";

interface ReduxProps {
    menus: DayMenu[];
    dateRange: DateRange;
    loggedIn: boolean
}

function mapStateToProps(reduxModel: ReduxModel): ReduxProps {
    return {
        menus: reduxModel.menuPlanning,
        dateRange: reduxModel.shoppingDateRange,
        loggedIn: reduxModel.user.loggedIn
    };
}

function selectMenuFromRange(menus: DayMenu[], fromTime: Date, toTime: Date) {
    return menus.filter((menu) => menu.date >= fromTime.getTime() && menu.date < toTime.getTime());
}

const rulesHandler = new RulesHandler([
    new TableSpoonToGramRule(), 
    new TeaSpoonToGramRule()
]);

export function ShoppingListMain(props: ReduxProps) {
    if (!props.loggedIn) {
        return <Redirect to={Paths.BASE} />
    }

    const menusToConsider = selectMenuFromRange(props.menus, props.dateRange.start, props.dateRange.end);
    const ingredientsFromRecipes = menusToConsider.map(e => e.recipe.ingredients).flat(1);
    const rawSorted = sortByIngredient(ingredientsFromRecipes);
    const sumsToRender = combineToSingleValue(rawSorted, rulesHandler);

    return <ContentContainer classes="shopping-list">
        <h2>{Localisation.SHOPPING_LIST}</h2>
        <RangePicker/>

        <div>
            <ul>
                {sumsToRender.sort((a, b) => a.name > b.name ? 1 : -1)
                .map((ingredient, index) => <React.Fragment key={index}><ShoppingIngredient ingredient={ingredient} /></React.Fragment>)}
            </ul>
        </div>
    </ContentContainer>
}

export default connect(mapStateToProps)(ShoppingListMain);