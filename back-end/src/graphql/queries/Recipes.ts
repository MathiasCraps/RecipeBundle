import { GraphQLList, GraphQLObjectType } from 'graphql';
import { GraphQLFloat, GraphQLInt, GraphQLString } from 'graphql/type/scalars';

export const IngredientType = new GraphQLObjectType({
    name: 'ingredient',
    fields: () => ({
        name: { type: GraphQLString, description: 'The readable name of the ingredient.' },
        quantity_number: { type: GraphQLFloat, description: 'The quantitative number of the needed amount.' },
        quantity_description: { type: GraphQLString, description: 'The readable name of the quantity' }
    })
});


export const RecipeType = new GraphQLObjectType({
    name: 'recipe',
    fields: () => ({
        title: { type: GraphQLString, description: 'The full title of the recipe.' },
        ingredients: { type: new GraphQLList(IngredientType), description: 'The ingredients needed for the recipe.' },
        steps: { type: GraphQLString, description: 'The instructions to transform the ingredients to amazing food.' },
        image: { type: GraphQLString, description: 'An image of the recipe.' },
        id: { type: GraphQLInt, description: 'A unique identifier of the recipe.' }
    })
});
