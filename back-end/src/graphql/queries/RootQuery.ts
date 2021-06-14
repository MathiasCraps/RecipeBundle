import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { pool } from '../..';
import { SessionData } from '../../model/SessionData';
import { getIngredientCategories } from '../../sql/ingredient/GetIngredientCategories';
import { getAllIngredients } from '../../sql/ingredient/GetIngredients';
import { getQuantityDescription } from '../../sql/ingredient/GetQuantityDescriptions';
import { getInventoryOfUser } from '../../sql/inventory/GetInventoryOfUser';
import { getMenus } from '../../sql/menu/GetMenu';
import { getAllRecipes } from '../../sql/recipe/GetRecipes';
import { Category } from './Category';
import { InventoryItem } from './Inventory';
import { MenuType } from './Menus';
import { QuantityDescriptionGql } from './QuantityDescription';
import { QuantityLessIngredient, RecipeType } from './Recipes';

export const RootQuery = new GraphQLObjectType({
    name: 'recipes',
    fields: {
        recipes: {
            type: new GraphQLNonNull(new GraphQLList(RecipeType)),
            description: 'Request all the available recipes.',
            async resolve() {
                return await getAllRecipes();
            }
        },
        menus: {
            type: new GraphQLNonNull(new GraphQLList(MenuType)),
            description: 'Request all the planned menus for the current user.',
            async resolve(parentValue, args, request) {
                const requestWithType = request.session as SessionData;
                if (!(requestWithType?.loggedIn)) {
                    return [];
                }
                return await getMenus(requestWithType.userId);
            }
        },
        categories: {
            type: new GraphQLNonNull(new GraphQLList(Category)),
            description: 'All the categories of the ingredients.',
            async resolve() {
                return await getIngredientCategories(pool);
            }
        },
        ingredients: {
            type: new GraphQLNonNull(new GraphQLList(QuantityLessIngredient)),
            description: 'All the currently existing ingredients', 
            async resolve() {
                return await getAllIngredients(pool);
            }
        },
        quantityDescriptions: {
            type: new GraphQLNonNull(new GraphQLList(QuantityDescriptionGql)),
            description: 'All the currently existing quantity descriptions.', 
            async resolve() {
                return await getQuantityDescription(pool);
            }
        },
        inventories: {
            type: new GraphQLNonNull(new GraphQLList(InventoryItem)),
            description: 'All the inventory items for current user.',
            async resolve(parentValue, args, request) {
                const session = request.session as SessionData;
                if (!session.userId) {
                    return [];
                }
                return await getInventoryOfUser(pool, session.userId);
            }
        }
    }
});