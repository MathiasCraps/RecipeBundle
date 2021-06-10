import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphQLFloat, GraphQLInt, GraphQLString } from 'graphql/type/scalars';

export const QuantityLessIngredient = new GraphQLObjectType({
    name: 'baseIngredient',
    description: 'Metadata of an ingredient.',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLFloat), description: 'The identifier of the ingredient' },
        name: { type: new GraphQLNonNull(GraphQLString), description: 'The readable name of the ingredient.' },
        categoryId: { type: new GraphQLNonNull(GraphQLInt), description: 'The unique identifier of the ingredient category'},
        categoryName: { type: new GraphQLNonNull(GraphQLString), description: 'The category of the ingredient.'}
    })
});

export const IngredientType = new GraphQLObjectType({
    name: 'quantifiedIngredient',
    description: 'Metadata of an ingredient. Part of a recipe.',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLFloat), description: 'The identifier of the ingredient' },
        name: { type: new GraphQLNonNull(GraphQLString), description: 'The readable name of the ingredient.' },
        quantity_number: { type: new GraphQLNonNull(GraphQLFloat), description: 'The quantitative number of the needed amount.' },
        quantity_description_id: { type: new GraphQLNonNull(GraphQLFloat), description: 'The identifier of the quantity.' },
        categoryId: { type: new GraphQLNonNull(GraphQLInt), description: 'The unique identifier of the ingredient category'},
        categoryName: { type: new GraphQLNonNull(GraphQLString), description: 'The category of the ingredient.'}
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
