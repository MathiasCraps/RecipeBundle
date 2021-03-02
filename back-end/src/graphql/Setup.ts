import { GraphQLSchema } from "graphql";
import { RootMutation } from './mutation/RootMutation';
import { RootQuery } from './queries/RootQuery';

export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});