import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphQLFloat, GraphQLInt, GraphQLString } from 'graphql/type/scalars';

export const IngredientType = new GraphQLObjectType({
    name: 'ingredient',
    description: 'Metadata of an ingredient. Part of a recipe.',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString), description: 'The readable name of the ingredient.' },
        quantity_number: { type: new GraphQLList(GraphQLFloat), description: 'The quantitative number of the needed amount.' },
        quantity_description: { type: new GraphQLNonNull(GraphQLString), description: 'The readable name of the quantity' }
    })
});


export const RecipeType = new GraphQLObjectType({
    name: 'recipe',
    description: 'Describes a recipe.',
    fields: () => ({
        title: { type: new GraphQLNonNull(GraphQLString), description: 'The full title of the recipe.' },
        ingredients: { type: new GraphQLList(IngredientType), description: 'The ingredients needed for the recipe.' },
        steps: { type: new GraphQLNonNull(GraphQLString), description: 'The instructions to transform the ingredients to amazing food.' },
        image: { type: new GraphQLNonNull(GraphQLString), description: 'An image of the recipe.' },
        id: { type: new GraphQLNonNull(GraphQLInt), description: 'A unique identifier of the recipe.' }
    })
});
