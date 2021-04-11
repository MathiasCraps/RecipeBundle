import { GraphQLBoolean, GraphQLString, GraphQLObjectType, GraphQLNonNull } from 'graphql';

export const RemoveRecipeResponse = new GraphQLObjectType({
    name: 'removeRecipeResponse',
    description: 'Server reply after removing a recipe.',
    fields: () => ({
        success: { type: GraphQLNonNull(GraphQLBoolean), description: 'Indicates if the operation was executed successfully' },
        error: { type: GraphQLString, description: 'Describes why the operation has not finished' }
    })
});