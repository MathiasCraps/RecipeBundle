import { Button, PopoverTrigger } from '@chakra-ui/react';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { Dispatch } from 'redux';
import { QuantifiedIngredient } from '../../interfaces/Recipe';
import { Localisation } from '../../localisation/AppTexts';
import { Paths } from '../../Paths';
import { toggleMenuIngredientsBought, toggleMenuIngredientsBoughtReturn } from '../../redux/Actions';
import { DateRange, DayMenu, InventoryItem, ReduxModel, ToggleMenuIngredientsBoughtAction } from '../../redux/Store';
import { convertArrayToLinkedMapWithPredicate, flatArray, LinkedMap } from '../../utils/ArrayUtils';
import ContentContainer from '../common/ContentContainer';
import SimplePopover from '../common/SimplePopover';
import MultiRangePicker from '../range-picker/MultiRangePicker';
import { applyInventory } from './normalization/ApplyInventory';
import { combineToSingleValue } from './normalization/Combiner';
import { groupByCategory } from './normalization/GroupByCategory';
import { TableSpoonToGramRule } from './normalization/rules/TableSpoonToGramRule';
import { TeaSpoonToGramRule } from './normalization/rules/TeaSpoonToGramRule';
import { RulesHandler } from './normalization/RulesHandler';
import { sortByIngredient } from './normalization/SortRecipeMap';
import { ShoppingCategory } from './ShoppingCategory';
import './ShoppingListMain.scss';

interface ReduxProps {
    menus: DayMenu[];
    dateRange: DateRange;
    loggedIn: boolean;
    inventoryMap: LinkedMap<InventoryItem>;
}

function mapStateToProps(reduxModel: ReduxModel): ReduxProps {
    return {
        menus: reduxModel.menuPlanning,
        dateRange: reduxModel.shoppingDateRange,
        loggedIn: reduxModel.user.loggedIn,
        inventoryMap: convertArrayToLinkedMapWithPredicate<InventoryItem>(reduxModel.inventory, 
            (inventoryItem) => String(inventoryItem.ingredient.id)
        )
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
    const ingredientsFromRecipes = flatArray<QuantifiedIngredient>(menusToConsider.map(e => e.recipe.ingredients));
    const rawSorted = sortByIngredient(ingredientsFromRecipes);
    const sumsToRender = combineToSingleValue(rawSorted, rulesHandler);
    const storageApplied = applyInventory(sumsToRender, props.inventoryMap);
    const hasMenus = Boolean(storageApplied.length)
    const sumsInGroups = groupByCategory(storageApplied);
    const sortedCategoryKeys = Object.keys(sumsInGroups)
    const [pickerVisible, setPickerVisible] = useState(false);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const initialFocusRef = React.useRef(null);

    function handleClosingPicker() {
        setPickerVisible(false)
        triggerRef.current?.focus();

    }

    return <ContentContainer classes="shopping-list">
        <h2>{Localisation.SHOPPING_LIST}</h2>

        <SimplePopover className="float-left" trigger={<div>{Localisation.YOUR_SHOPPING_LIST_FOR_THE_PERIOD}: <PopoverTrigger>
            <button ref={triggerRef}
                className="date-range-initiator"
                onClick={() => setPickerVisible(!pickerVisible)}>
                {`${formatDate(props.dateRange.start)} - ${formatDate(props.dateRange.end)}`}
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
            {sortedCategoryKeys.map((category, index) => {
                return <ShoppingCategory ingredients={sumsInGroups[category]} key={index} />
            })}
            <div className="clearer">
                <Button onClick={() => props.toggleMenuIngredientsBought(menusToConsider, true)}>
                    {Localisation.MARK_LIST_AS_PURCHASED}
                </Button>
            </div>
        </div>}
    </ContentContainer>
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingListMain);