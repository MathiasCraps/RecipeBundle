import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';

export const QuantityDescriptionLocalisation = new GraphQLObjectType({
    name: 'QuantityDescriptionLocalisation',
    description: 'The available quantity descriptions of quantified ingredients.',
    fields: () => ({
        nl: { type: new GraphQLNonNull(GraphQLString), description: 'Dutch translation of quantity description name.' }
    })
});

export const QuantityDescriptionGql = new GraphQLObjectType({
    name: 'baseQuantityDescription',
    description: 'Metadata of a quantity description.',
    fields: () => ({
        quantityDescriptorId: { type: new GraphQLNonNull(GraphQLFloat), description: 'The identifier of the quantity description' },
        name: { type: new GraphQLNonNull(GraphQLString), description: 'The readable name of the quantity description.' },
        translations: { type: new GraphQLNonNull(QuantityDescriptionLocalisation), description: 'Localised quantity description names.' }
    })
});