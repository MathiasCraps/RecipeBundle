import { GraphQLBoolean, GraphQLString, GraphQLInt, GraphQLObjectType } from 'graphql';

export const ModifyMenuResponse = new GraphQLObjectType({
    name: 'modifyMenuResponse',
    fields: () => ({
        success: { type: GraphQLBoolean },
        menuId: { type: GraphQLInt },
        error: { type: GraphQLString }
    })
});