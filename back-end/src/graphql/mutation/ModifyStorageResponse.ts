import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

export const ModifyStorage = new GraphQLObjectType({
    name: 'modifyStorage',
    description: 'Server reply after modifying a recipe.',
    fields: () => ({
        success: { type: GraphQLNonNull(GraphQLBoolean), description: 'Indicates if the operation was executed successfully' },
        error: { type: GraphQLString, description: 'Describes why the operation has not finished' }
    })
});