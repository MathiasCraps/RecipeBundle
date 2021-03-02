import { GraphQLList, GraphQLObjectType } from 'graphql';
import { GraphQLFloat, GraphQLInt, GraphQLString } from 'graphql/type/scalars';

export const IngredientType = new GraphQLObjectType({
    name: 'ingredient',
    fields: () => ({
        name: { type: GraphQLString },
        quantity_number: { type: GraphQLFloat },
        quantity_description: { type: GraphQLString }
    })
});


export const RecipeType = new GraphQLObjectType({
    name: 'recipe',
    fields: () => ({
        title: { type: GraphQLString },
        ingredients: { type: new GraphQLList(IngredientType) },
        steps: { type: GraphQLString },
        image: { type: GraphQLString },
        id: { type: GraphQLInt }
    })
});
