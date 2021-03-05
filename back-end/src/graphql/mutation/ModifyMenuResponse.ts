import { GraphQLBoolean, GraphQLString, GraphQLInt, GraphQLObjectType, GraphQLNonNull } from 'graphql';

export const ModifyMenuResponse = new GraphQLObjectType({
    name: 'modifyMenuResponse',
    description: 'Server reply after adding, modifying or deleting a planned menu.',
    fields: () => ({
        success: { type: GraphQLNonNull(GraphQLBoolean), description: 'Indicates if the operation was executed successfully' },
        menuId: { type: GraphQLInt, description: 'Id of the menu, if applicable.' },
        error: { type: GraphQLString, description: 'Describes why the operation has not finished' }
    })
});