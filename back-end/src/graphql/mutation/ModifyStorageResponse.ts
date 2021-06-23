import { GraphQLBoolean, GraphQLString, GraphQLObjectType, GraphQLNonNull, GraphQLFloat } from 'graphql';

export const ModifyStorage = new GraphQLObjectType({
    name: 'modifyStorage',
    description: 'Server reply after modifying a recipe.',
    fields: () => ({
        success: { type: GraphQLNonNull(GraphQLBoolean), description: 'Indicates if the operation was executed successfully' },
        error: { type: GraphQLString, description: 'Describes why the operation has not finished' },
        ingredientId: { type: GraphQLFloat, description: 'The identifier of the new ingredient. Empty when creation failed.'}
    })
});