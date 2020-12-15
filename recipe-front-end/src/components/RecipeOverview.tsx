import { Box, Heading, Image, SlideFade, CloseButton } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons"
import React from "react";
import { connect } from "react-redux";
import { Recipe } from "../interfaces/Recipe";
import { changeActiveView, Direction, switchActiveRecipe } from "../redux/Actions";
import { ReduxModel, ViewType } from "../redux/Store";
import { Localisation } from "../localisation/AppTexts";

interface OriginalProps {
    recipe: Recipe;
}

interface props {
    changeActiveView: typeof changeActiveView;
    switchActiveRecipe: typeof switchActiveRecipe;
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
            <a href="#" onClick={() => props.switchActiveRecipe(props.recipe, Direction.PREVIOUS)} >
                <ArrowBackIcon boxSize="2em" aria-label={Localisation.PREVIOUS_RECIPE}/>
            </a>
            <a href="#" onClick={() => props.switchActiveRecipe(props.recipe, Direction.NEXT)}>
                <ArrowForwardIcon boxSize="2em" aria-label={Localisation.NEXT_RECIPE}/>
            </a>
            <CloseButton className="close-button-recipe-overview" autoFocus={true} size="sm" onClick={() => props.changeActiveView(ViewType.Overview, undefined)} />
            <Heading as="h2">{props.recipe.title}</Heading>
            <Image src={props.recipe.image} alt="" />
            <Heading as="h3">{Localisation.INGREDIENTS}</Heading>
            {props.recipe.steps.map((step, index) => <p key={index}>{step}</p>)}
            <Heading as="h3">{Localisation.STEPS}</Heading>
            {props.recipe.steps.map((step, index) => <p key={index}>{step}</p>)}
        </Box>
    </SlideFade>);
}

export default connect(mapStateToProps, { changeActiveView, switchActiveRecipe })(RecipeOverview);