import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

export const Category = new GraphQLObjectType({
    name: 'category',
    description: 'The categories of the ingredients.',
    fields: () => ({
        categoryId: { type: new GraphQLNonNull(GraphQLInt), description: 'The unique identifier of the category.' },
        categoryName: { type: new GraphQLNonNull(GraphQLString), description: 'The category name'}
    })
});