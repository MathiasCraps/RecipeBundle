import { GraphQLList, GraphQLObjectType } from 'graphql';
import { SessionData } from '../../model/SessionData';
import { getMenus } from '../../sql/GetMenu';
import { getAllRecipes } from '../../sql/GetRecipes';
import { MenuType } from './Menus';
import { RecipeType } from './Recipes';

export const RootQuery = new GraphQLObjectType({
    name: 'recipes',
    fields: {
        recipes: {
            type: new GraphQLList(RecipeType),
            description: 'Request all the available recipes.',
            async resolve() {
                return await getAllRecipes();
            }
        },
        menus: {
            type: new GraphQLList(MenuType),
            description: 'Request all the planned menus for the current user.',
            async resolve(parentValue, args, request) {
                const requestWithType = request.session as SessionData;
                if (!(requestWithType?.loggedIn)) {
                    return [];
                }
                return await getMenus(requestWithType.userId);
            }
        }
    }
});