import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';

export const updateIngredientsPurchasedResponse = new GraphQLObjectType({
    name: 'updateIngredientsPurchasedResponse',
    description: 'Server reply after updating ingredients purchase status of a menu.',
    fields: () => ({
        success: { type: GraphQLNonNull(GraphQLBoolean), description: 'Indicates if the operation was executed successfully' }
    })
});