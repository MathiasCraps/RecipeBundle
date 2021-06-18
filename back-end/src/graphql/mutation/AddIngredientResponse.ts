import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLString } from 'graphql';

export const AddIngredientResponse = new GraphQLObjectType({
    name: 'addIngredientResponse',
    description: 'Server reply after adding an ingredient.',
    fields: () => ({
        success: { type: GraphQLNonNull(GraphQLBoolean), description: 'Indicates if the operation was executed successfully' },
        error: { type: GraphQLString, description: 'Describes why the operation has not finished' }
    })
});