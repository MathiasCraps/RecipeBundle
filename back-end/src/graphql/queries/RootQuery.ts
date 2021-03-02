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
            async resolve() {
                return await getAllRecipes();
            }
        },
        menus: {
            type: new GraphQLList(MenuType),
            async resolve(parentValue, args, request) {
                const requestWithType = request.session as SessionData;
                return await getMenus(requestWithType.userId);
            }
        }
    }
});