import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';

export const MenuType = new GraphQLObjectType({
    name: 'menu',
    description: 'A menu describes when a recipe is planned in the menu planner.',
    fields: () => ({
        date: { type: new GraphQLNonNull(GraphQLFloat), description: 'The date of the planned menu. Milliseconds since Unix Epoch.' },
        menuId: { type: new GraphQLNonNull(GraphQLInt), description: 'The unique identifier of the menu.' },
        recipeId: { type: new GraphQLNonNull(GraphQLInt), description: 'The unique identifier of the recipe.' },
        ingredientsBought: {type: new GraphQLNonNull(GraphQLBoolean), description: 'Boolean indicating whether all the menu have been bought. If this is the case, the menu does no longer count for the shopping list totals.'}
    })
});