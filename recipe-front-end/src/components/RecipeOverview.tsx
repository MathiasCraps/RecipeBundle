import { Box, Heading, Image, SlideFade, CloseButton } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons"
import React from "react";
import { connect } from "react-redux";
import { Recipe } from "../interfaces/Recipe";
import { changeActiveView } from "../redux/Actions";
import { ReduxModel, ViewType } from "../redux/Store";

interface OriginalProps {
    recipe: Recipe;
}

interface props {
    changeActiveView: typeof changeActiveView;
}

type Props = OriginalProps & props;

function mapStateToProps(state: ReduxModel) {
    return {
        recipe: state.activeRecipe!
    };
}

function RecipeOverview(props: Props) {
    return (<SlideFade in={true}>
        <Box padding="2em" maxWidth="80em" margin="auto">
            <a href="#"><ArrowBackIcon aria-label="Naar vorig recept" /></a>
            <a href="#"><ArrowForwardIcon aria-label="Naar volgend recept" /></a>
            <CloseButton className="close-button-recipe-overview" autoFocus={true} size="sm" onClick={() => props.changeActiveView(ViewType.Overview, undefined)} />
            <Heading as="h2">{props.recipe.title}</Heading>
            <Image src={props.recipe.image} alt="" />
            <Heading as="h3">Ingrediënten</Heading>
            {props.recipe.steps.map((step, index) => <p key={index}>{step}</p>)}
            <Heading as="h3">Instructies</Heading>
            {props.recipe.steps.map((step, index) => <p key={index}>{step}</p>)}
        </Box>
    </SlideFade>);
}

export default connect(mapStateToProps, { changeActiveView })(RecipeOverview);