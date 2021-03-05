import { GraphQLBoolean, GraphQLString, GraphQLInt, GraphQLObjectType, GraphQLNonNull } from 'graphql';

export const ModifyMenuResponse = new GraphQLObjectType({
    name: 'modifyMenuResponse',
    fields: () => ({
        success: { type: GraphQLNonNull(GraphQLBoolean) },
        menuId: { type: GraphQLInt },
        error: { type: GraphQLString }
    })
});