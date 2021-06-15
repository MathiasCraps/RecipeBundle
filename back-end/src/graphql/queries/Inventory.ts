import { GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';

export const InventoryItem = new GraphQLObjectType({
    name: 'Inventory',
    description: 'A storage inventory item',
    fields: () => ({
        ingredientId: { type: new GraphQLNonNull(GraphQLInt), description: 'The ingredient id that is in the storage.' },
        quantity: { type: new GraphQLNonNull(GraphQLFloat), description: 'The quantity of the storage item.' },
        desiredQuantity: { type: GraphQLInt, description: 'The desired reserve stock the user wishes to keep after all menus have been made.'},
        quantity_description_id: { type: GraphQLFloat, description: 'The identifier of a description quantity.'}
    })
});