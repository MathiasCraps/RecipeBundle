import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { pool } from '../..';
import { SessionData } from '../../model/SessionData';
import { getIngredientCategories } from '../../sql/GetIngredientCategories';
import { getMenus } from '../../sql/GetMenu';
import { getAllRecipes } from '../../sql/GetRecipes';
import { Category } from './Category';
import { MenuType } from './Menus';
import { RecipeType } from './Recipes';

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
        }
    }
});