import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLString, GraphQLFloat } from 'graphql';

export const AddIngredientResponse = new GraphQLObjectType({
    name: 'addIngredientResponse',
    description: 'Server reply after adding an ingredient.',
    fields: () => ({
        success: { type: GraphQLNonNull(GraphQLBoolean), description: 'Indicates if the operation was executed successfully' },
        error: { type: GraphQLString, description: 'Describes why the operation has not finished' },
        ingredientId: { type: GraphQLFloat, description: 'The identifier of the new ingredient. Empty when creation failed.'}
    })
});