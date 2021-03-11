import { PopoverTrigger } from '@chakra-ui/react';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { Ingredient } from '../../interfaces/Recipe';
import { Localisation } from '../../localisation/AppTexts';
import { Paths } from '../../Paths';
import { DateRange, DayMenu, ReduxModel } from '../../redux/Store';
import { flatArray } from '../../utils/ArrayUtils';
import ContentContainer from '../common/ContentContainer';
import SimplePopover from '../common/SimplePopover';
import MultiRangePicker from '../range-picker/MultiRangePicker';
import { combineToSingleValue } from './normalization/Combiner';
import { TableSpoonToGramRule } from './normalization/rules/TableSpoonToGramRule';
import { TeaSpoonToGramRule } from './normalization/rules/TeaSpoonToGramRule';
import { RulesHandler } from './normalization/RulesHandler';
import { sortByIngredient } from './normalization/SortRecipeMap';
import { ShoppingIngredient } from './ShoppingIngredient';

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

function formatDate(date: Date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
    const ingredientsFromRecipes = flatArray<Ingredient>(menusToConsider.map(e => e.recipe.ingredients));
    const rawSorted = sortByIngredient(ingredientsFromRecipes);
    const sumsToRender = combineToSingleValue(rawSorted, rulesHandler);
    const [pickerVisible, setPickerVisible] = useState(false);
    const initialFocusRef = React.useRef(null);

    return <ContentContainer classes="shopping-list">
        <h2>{Localisation.SHOPPING_LIST}</h2>

        <SimplePopover trigger={<div>{Localisation.YOUR_SHOPPING_LIST_FOR_THE_PERIOD} : <PopoverTrigger>
            <button
                className="date-range-initiator"
                onClick={() => setPickerVisible(!pickerVisible)}>
                {`${formatDate(props.dateRange.start)} ${formatDate(props.dateRange.end)}`}
            </button></PopoverTrigger></div>}
            isOpened={pickerVisible}
            onClose={() => setPickerVisible(false)}
            title={Localisation.PICK_A_PERIOD}
            initialFocusRef={initialFocusRef}
        >
            <MultiRangePicker
                showNextMonth={true}
                isVisible={pickerVisible}
                onClosing={() => setPickerVisible(!pickerVisible)}
                initialFocusRef={initialFocusRef}
            />
        </SimplePopover>

        <div className="shopping-list-ingredients">
            <ul>
                {sumsToRender.sort((a, b) => a.name > b.name ? 1 : -1)
                    .map((ingredient, index) => <React.Fragment key={index}><ShoppingIngredient ingredient={ingredient} /></React.Fragment>)}
            </ul>
        </div>
    </ContentContainer>
}

export default connect(mapStateToProps)(ShoppingListMain);