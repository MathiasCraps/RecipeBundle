import { GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';
import { pool } from '../..';
import { DayMenu } from '../../model/RecipeData';
import { SessionData } from '../../model/SessionData';
import { modifyMenu } from '../../sql/UpdateMenu';
import { AddMenuResponseData } from './AddMenuResponseData';

export const RootMutation = new GraphQLObjectType({
    name: 'addmenu',
    fields: {
        addMenu: {
            type: AddMenuResponseData,
            args: {
                date: { type: GraphQLFloat },
                recipeId: { type: GraphQLInt }
            },
            async resolve(parentValue, args, request) {
                const userId = (request.session as SessionData).userId || 1;
                if (userId === undefined) {
                    return {
                        success: false,
                        error: 'Not logged in'
                    };
                }

                // todo: add assertions on type to ensure
                const menu: DayMenu = {
                    date: args.date,
                    menuId: 0,
                    recipeId: args.recipeId
                }

                let menuId: number;
                try {
                    menuId = await modifyMenu(pool, menu, userId, 'add');                    
                } catch(err) {
                    console.log('something went wrong adding data', err);

                    return {
                        success: false,
                        error: err
                    }
                }

                return {
                    success: true,
                    menuId
                };
            }
        }
    }
});