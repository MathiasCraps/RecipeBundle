import {
    GraphQLFloat,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} from "graphql";
import { getAllRecipes } from '../sql/GetRecipes';

const MenuType = new GraphQLObjectType({
    name: 'menu',
    fields: () => ({
        date: { type: GraphQLFloat },
        menuId: { type: GraphQLInt },
        recipeId: { type: GraphQLInt }
    })
});

const IngredientType = new GraphQLObjectType({
    name: 'ingredient',
    fields: () => ({
        name: { type: GraphQLString },
        quantity_number: { type: GraphQLFloat },
        quantity_description: { type: GraphQLString }
    })
});


const RecipeType = new GraphQLObjectType({
    name: 'recipe',
    fields: () => ({
        title: { type: GraphQLString },
        ingredients: { type: new GraphQLList(IngredientType) },
        steps: { type: GraphQLString },
        image: { type: GraphQLString },
        id: { type: GraphQLInt }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'recipes',
    fields: {
        recipes: {
            type: new GraphQLList(RecipeType),
            async resolve() {
                return (await getAllRecipes()).recipes;
            }
        },
        menus: {
            type: new GraphQLList(MenuType),
            async resolve() {
                return (await getAllRecipes()).menus;
            }
        }

    }
});

export const schema = new GraphQLSchema({
    query: RootQuery
})