import { GraphQLSchema } from "graphql";
import { RootQuery } from './queries/RootQuery';

export const schema = new GraphQLSchema({
    query: RootQuery
})