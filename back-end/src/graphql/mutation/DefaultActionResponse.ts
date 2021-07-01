import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

export const DefaultActionResponse = new GraphQLObjectType({
    name: 'defaultactionresponse',
    description: 'Server reply after doing an action.',
    fields: () => ({
        success: { type: GraphQLNonNull(GraphQLBoolean), description: 'Indicates if the operation was executed successfully' },
        error: { type: GraphQLString, description: 'Describes why the operation has not finished' }
    })
});