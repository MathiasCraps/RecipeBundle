import { GraphQLBoolean, GraphQLString, GraphQLInt, GraphQLObjectType } from 'graphql';

export const AddMenuResponseData = new GraphQLObjectType({
    name: 'addMenuResponse',
    fields: () => ({
        success: { type: GraphQLBoolean },
        menuId: { type: GraphQLInt },
        error: { type: GraphQLString }
    })
});