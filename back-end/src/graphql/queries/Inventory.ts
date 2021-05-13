import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

export const InventoryItem = new GraphQLObjectType({
    name: 'Inventory',
    description: 'A storage inventory item',
    fields: () => ({
        ingredient_id: { type: new GraphQLNonNull(GraphQLInt), description: 'The ingredient id that is in the storage.' },
        quantity: { type: new GraphQLNonNull(GraphQLString), description: 'The quantity of the storage item.' }
    })
});