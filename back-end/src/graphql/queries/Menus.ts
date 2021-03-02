import { GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';

export const MenuType = new GraphQLObjectType({
    name: 'menu',
    fields: () => ({
        date: { type: GraphQLFloat },
        menuId: { type: GraphQLInt },
        recipeId: { type: GraphQLInt }
    })
});