import { GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { SessionData } from '../../model/SessionData';
import { writeMenuChangeToDatabase } from './helpers/WriteMenuChangeToDatabase';
import { ModifyMenuResponse } from './ModifyMenuResponse';

export const RootMutation = new GraphQLObjectType({
    name: 'addmenu',
    fields: {
        addMenu: {
            type: ModifyMenuResponse,
            args: {
                date: { type: new GraphQLNonNull(GraphQLFloat) },
                recipeId: { type: new GraphQLNonNull(GraphQLInt) }
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
            type: ModifyMenuResponse,
            args: {
                menuId: { type: new GraphQLNonNull(GraphQLInt) }
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
        },
        updateMenu: {
            type: ModifyMenuResponse,
            args: {
                date: { type: new GraphQLNonNull(GraphQLFloat) },
                menuId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            async resolve(parentValue, args, request) {
                try {
                    const menuId = await writeMenuChangeToDatabase((request.session as SessionData).userId!, {
                        date: args.date,
                        menuId: args.menuId,
                        recipeId: 0
                    }, 'update');

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