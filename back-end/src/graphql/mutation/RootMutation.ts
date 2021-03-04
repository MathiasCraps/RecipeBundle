import { GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';
import { SessionData } from '../../model/SessionData';
import { AddMenuResponseData } from './AddMenuResponseData';
import { writeMenuChangeToDatabase } from './helpers/WriteMenuChangeToDatabase';



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
                try {
                    const menuId = await writeMenuChangeToDatabase((request.session as SessionData).userId!, {
                        date: args.date,
                        menuId: 0,
                        recipeId: args.recipeId
                    }, 'add');

                    return {
                        success: true,
                        menuId
                    };
                } catch (err) {
                    return {
                        success: false,
                        error: err
                    };
                }
            }
        },
        removeMenu: {
            type: AddMenuResponseData,
            args: {
                menuId: { type: GraphQLInt }
            },
            async resolve(parentValue, args, request) {
                try {
                    const menuId = await writeMenuChangeToDatabase((request.session as SessionData).userId!, {
                        date: 0,
                        menuId: args.menuId,
                        recipeId: 0
                    }, 'remove');

                    return {
                        success: true,
                        menuId
                    };
                } catch (err) {
                    return {
                        success: false,
                        error: err
                    };
                }
            }
        }
    }
});