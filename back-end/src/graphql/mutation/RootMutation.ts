import { GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';
import { pool } from '../..';
import { DayMenu } from '../../model/RecipeData';
import { SessionData } from '../../model/SessionData';
import { modifyMenu } from '../../sql/UpdateMenu';
import { MenuType } from '../queries/Menus';

const testDataToReturn = {
    date: 0,
    menuId: 0,
    recipeId: 0
};

export const RootMutation = new GraphQLObjectType({
    name: 'addmenu',
    fields: {
        addMenu: {
            type: MenuType,
            args: {
                date: { type: GraphQLFloat },
                recipeId: { type: GraphQLInt }
            },
            async resolve(parentValue, args, request) {
                const userId = (request.session as SessionData).userId || 1;
                if (userId === undefined) {
                    // todo: add status codes to indicate action was success
                    return testDataToReturn;
                }

                // todo: add assertions on type to ensure
                const menu: DayMenu = {
                    date: args.date,
                    menuId: 0,
                    recipeId: args.recipeId
                }

                try {
                    await modifyMenu(pool, menu, userId, 'add');                    
                } catch(err) {
                    console.log('something went wrong adding data', err);
                }

                return testDataToReturn;
            }
        }
    }
});