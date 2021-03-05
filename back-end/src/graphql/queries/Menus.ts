import { GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';

export const MenuType = new GraphQLObjectType({
    name: 'menu',
    fields: () => ({
        date: { type: GraphQLFloat, description: 'The date of the planned menu. Milliseconds since Unix Epoch.' },
        menuId: { type: GraphQLInt, description: 'The unique identifier of the menu.' },
        recipeId: { type: GraphQLInt, description: 'The unique identifier of the recipe.' }
    })
});