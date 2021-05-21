import fs from 'fs';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { BASE_FILE_UPLOAD_DIRECTORY, pool } from '../..';
import { SessionData } from '../../model/SessionData';
import { addInventoryItem } from '../../sql/inventory/AddInventoryItem';
import { removeInventoryItem } from '../../sql/inventory/RemoveInventoryItem';
import { updateInventoryItem } from '../../sql/inventory/UpdateInventoryItem';
import { updatePurchaseState } from '../../sql/menu/UpdatePurchaseState';
import { removeRecipe } from '../../sql/recipe/RemoveRecipe';
import { writeMenuChangeToDatabase } from './helpers/WriteMenuChangeToDatabase';
import { ModifyMenuResponse } from './ModifyMenuResponse';
import { ModifyStorage } from './ModifyStorageResponse';
import { RemoveRecipeResponse } from './RemoveRecipeResponse';
import { updateIngredientsPurchasedResponse } from './UpdateIngredientsPurchasedResponse';

export const RootMutation = new GraphQLObjectType({
    name: 'menuManagement',
    fields: {
        addMenu: {
            type: ModifyMenuResponse,
            description: 'Plan a recipe as a new menu item',
            args: {
                date: { type: new GraphQLNonNull(GraphQLFloat), description: 'The date to plan the menu on. Unix Epoch in milliseconds.' },
                recipeId: { type: new GraphQLNonNull(GraphQLInt), description: 'The identifier of the menu to add.' }
            },
            async resolve(parentValue, args, request) {
                try {
                    const menuId = await writeMenuChangeToDatabase((request.session as SessionData).userId!, {
                        date: args.date,
                        menuId: 0,
                        recipeId: args.recipeId,
                        ingredientsBought: false
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
            description: 'Remove a recipe as a planned menu item',
            args: {
                menuId: { type: new GraphQLNonNull(GraphQLInt), description: 'The identifier of the menu to remove.' }
            },
            async resolve(parentValue, args, request) {
                try {
                    const menuId = await writeMenuChangeToDatabase((request.session as SessionData).userId!, {
                        date: 0,
                        menuId: args.menuId,
                        recipeId: 0,
                        ingredientsBought: false
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
            description: 'Move a planned menu to another date.',
            args: {
                date: { type: new GraphQLNonNull(GraphQLFloat), description: 'The date to move the menu to. Unix Epoch in milliseconds.' },
                menuId: { type: new GraphQLNonNull(GraphQLInt), description: 'The identifier of the menu to move.' }
            },
            async resolve(parentValue, args, request) {
                try {
                    const menuId = await writeMenuChangeToDatabase((request.session as SessionData).userId!, {
                        date: args.date,
                        menuId: args.menuId,
                        recipeId: 0,
                        ingredientsBought: false
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
        },
        updateMenuIngredientsBought: {
            type: updateIngredientsPurchasedResponse,
            description: 'Mark the ingredients of a menu as bought.',
            args: {
                menuIds: { type: new GraphQLNonNull(new GraphQLList(GraphQLInt)), description: 'The identifier of the menus to update.' },
                isBought: { type: new GraphQLNonNull(GraphQLBoolean), description: 'Boolean indicating if all ingredients have been bought.' },
            },
            async resolve(parentValue, args, request) {
                const success = await updatePurchaseState(pool, args.menuIds, args.isBought, (request.session as SessionData).userId!);
                return { success };
            }
        },
        removeRecipe: {
            type: RemoveRecipeResponse,
            description: 'Remove the recipe',
            args: {
                recipeId: { type: new GraphQLNonNull(GraphQLInt), description: 'Identifier of the recipe to remove' }
            },
            async resolve(parentValue, args, request) {
                try {
                    const session: SessionData = request.session;
                    if (!session.loggedIn) {
                        throw new Error('Not logged in');
                    }

                    const imagePath = await removeRecipe(pool, args.recipeId);

                    fs.unlinkSync(`${BASE_FILE_UPLOAD_DIRECTORY.replace('uploads/', '')}${imagePath}`);

                    return {
                        success: true
                    };
                } catch (err) {
                    return {
                        success: false,
                        error: err
                    }
                }
            }
        },
        updateInventory: {
            type: ModifyStorage,
            description: 'Add, remove or delete an inventory item',
            args: {
                type: { type: new GraphQLNonNull(GraphQLString), description: 'The type of action. Accepted values: "add", "update" and "remove".' },
                ingredientId: { type: new GraphQLNonNull(GraphQLInt), description: 'Identifier of the ingredient' },
                quantity: { type: GraphQLInt, description: 'Quantity of storage. Only needed for add and update actions.' },
                desiredQuantity: { type: GraphQLInt, description: 'Desired reserve stock when selected menu items have been made.'}
            }, async resolve(parentValue, args, request) {
                try {
                    const session: SessionData = request.session;
                    if (!session.loggedIn || typeof session.userId !== 'number') {
                        throw new Error('Not logged in');
                    }

                    const inventoryItem = {
                        ingredientId: args.ingredientId,
                        quantity: args.quantity,
                        desiredQuantity: args.desiredQuantity
                    };

                    // todo: make stricter with desiredQuantity
                    if (typeof inventoryItem.ingredientId !== 'number' || typeof inventoryItem.quantity !== 'number') {
                        throw new Error('Not a valid inventory item');
                    }

                    if (args.type === 'add') {
                        await addInventoryItem(pool, inventoryItem, session.userId);
                    } else if (args.type === 'remove') {
                        await removeInventoryItem(pool, inventoryItem.ingredientId, session.userId);
                    } else if (args.type === 'update') {
                        await updateInventoryItem(pool, inventoryItem, session.userId);

                    } else {
                        throw new Error('Not yet implemented');
                    }

                    return {
                        success: true
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