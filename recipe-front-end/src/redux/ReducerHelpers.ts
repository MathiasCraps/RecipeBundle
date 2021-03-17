import { DayMenu } from './Store';

export function toggleIngredientsBoughtForMenus(allMenus: DayMenu[], impactedMenus: DayMenu[], ingredientsBought: boolean) {
    return allMenus.map((menu) => {
        // ignore the non-impacted menus
        if (impactedMenus.indexOf(menu) === -1) {
            return {... menu};
        }

        // modify the rest
        return {
            ...menu,
            ingredientsBought
        }
    });
}