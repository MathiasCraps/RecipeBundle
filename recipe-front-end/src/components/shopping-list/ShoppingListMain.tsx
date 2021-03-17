import { Button, PopoverTrigger } from '@chakra-ui/react';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { Dispatch } from 'redux';
import { Ingredient } from '../../interfaces/Recipe';
import { Localisation } from '../../localisation/AppTexts';
import { Paths } from '../../Paths';
import { toggleMenuIngredientsBought, toggleMenuIngredientsBoughtReturn } from '../../redux/Actions';
import { DateRange, DayMenu, ReduxModel, ToggleMenuIngredientsBoughtAction } from '../../redux/Store';
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

interface ReduxActions {
    toggleMenuIngredientsBought: toggleMenuIngredientsBoughtReturn;
}

function mapDispatchToProps(dispatch: Dispatch<ToggleMenuIngredientsBoughtAction>): ReduxActions {
    return { 
        toggleMenuIngredientsBought: toggleMenuIngredientsBought(dispatch) 
    }
}

function selectMenuFromRange(menus: DayMenu[], fromTime: Date, toTime: Date) {
    return menus.filter((menu) => !menu.ingredientsBought && menu.date >= fromTime.getTime() && menu.date < toTime.getTime());
}

function formatDate(date: Date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

const rulesHandler = new RulesHandler([
    new TableSpoonToGramRule(),
    new TeaSpoonToGramRule()
]);

type Props = ReduxProps & ReduxActions;

export function ShoppingListMain(props: Props) {
    if (!props.loggedIn) {
        return <Redirect to={Paths.BASE} />
    }

    const menusToConsider = selectMenuFromRange(props.menus, props.dateRange.start, props.dateRange.end);
    const hasMenus = Boolean(menusToConsider.length)
    const ingredientsFromRecipes = flatArray<Ingredient>(menusToConsider.map(e => e.recipe.ingredients));
    const rawSorted = sortByIngredient(ingredientsFromRecipes);
    const sumsToRender = combineToSingleValue(rawSorted, rulesHandler);
    const [pickerVisible, setPickerVisible] = useState(false);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const initialFocusRef = React.useRef(null);

    function handleClosingPicker() {
        setPickerVisible(false)
        triggerRef.current?.focus();
        
    }

    return <ContentContainer classes="shopping-list">
        <h2>{Localisation.SHOPPING_LIST}</h2>

        <SimplePopover trigger={<div>{Localisation.YOUR_SHOPPING_LIST_FOR_THE_PERIOD} : <PopoverTrigger>
            <button ref={triggerRef}
                className="date-range-initiator"
                onClick={() => setPickerVisible(!pickerVisible)}>
                {`${formatDate(props.dateRange.start)} ${formatDate(props.dateRange.end)}`}
            </button></PopoverTrigger></div>}
            isOpened={pickerVisible}
            onClose={handleClosingPicker}
            title={Localisation.PICK_A_PERIOD}
            initialFocusRef={initialFocusRef}
        >
            <MultiRangePicker
                showNextMonth={true}
                isVisible={pickerVisible}
                onClosing={handleClosingPicker}
                initialFocusRef={initialFocusRef}
            />
        </SimplePopover>

        {!hasMenus && <p>{Localisation.YOU_ALREADY_BOUGHT_EVERYTHING}</p>}
        {hasMenus && <div className="shopping-list-ingredients">
            <ul>
                {sumsToRender.sort((a, b) => a.name > b.name ? 1 : -1)
                    .map((ingredient, index) => <React.Fragment key={index}><ShoppingIngredient ingredient={ingredient} /></React.Fragment>)}
            </ul>
            <Button onClick={() => props.toggleMenuIngredientsBought(menusToConsider, true)}>
                {Localisation.MARK_LIST_AS_PURCHASED}
            </Button>
        </div>}
    </ContentContainer>
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingListMain);