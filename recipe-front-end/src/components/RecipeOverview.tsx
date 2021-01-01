import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, CloseButton, Heading, Image, SlideFade } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Recipe } from "../interfaces/Recipe";
import { Localisation } from "../localisation/AppTexts";
import { changeActiveView, Direction, switchActiveRecipe } from "../redux/Actions";
import { ReduxModel, ViewType } from "../redux/Store";

interface RecipeOverviewProps {
    recipe: Recipe;
}

interface ReduxProps {
    changeActiveView: typeof changeActiveView;
    switchActiveRecipe: typeof switchActiveRecipe;
}

type Props = RecipeOverviewProps & ReduxProps;

function mapStateToProps(state: ReduxModel) {
    return {
        recipe: state.activeRecipe!
    };
}

function RecipeOverview(props: Props) {
    useEffect(() => {
        function handleKeyPress(keyEvent: KeyboardEvent) {
            let direction: Direction | undefined;

            if (keyEvent.code === 'Escape') {
                props.changeActiveView(ViewType.Overview, undefined);
                return;
            }
            
            switch (keyEvent.code) {
                case "ArrowLeft":
                    direction = Direction.PREVIOUS;
                    break;
                case "ArrowRight":
                    direction = Direction.NEXT;
                    break;
                default:
                    // ignore
            }
            if (direction !== undefined) {
                props.switchActiveRecipe(direction)
            }

        }

        document.body.addEventListener('keyup', handleKeyPress);
        return () => {
            document.body.removeEventListener('keyup', handleKeyPress);
        }
    })
    return (<SlideFade in={true}>
        <Box className="recipe-overview" padding="2em" maxWidth="80em" margin="auto">
            <a href="#" onClick={() => props.switchActiveRecipe(Direction.PREVIOUS)} >
                <ArrowBackIcon boxSize="2em" aria-label={Localisation.PREVIOUS_RECIPE} />
            </a>
            <a href="#" onClick={() => props.switchActiveRecipe(Direction.NEXT)}>
                <ArrowForwardIcon boxSize="2em" aria-label={Localisation.NEXT_RECIPE} />
            </a>
            <CloseButton className="close-button-recipe-overview" autoFocus={true} size="md" onClick={() => props.changeActiveView(ViewType.Overview, undefined)} />
            <Heading as="h2">{props.recipe.title}</Heading>
            <Image src={props.recipe.image} alt="" />
            <Heading as="h3">{Localisation.INGREDIENTS}</Heading>
            <ul>{props.recipe.ingredients.map((step, index) => <li key={index}>{step}</li>)}</ul>
            <Heading as="h3">{Localisation.STEPS}</Heading>
            {props.recipe.steps.map((step, index) => <p key={index}>{step}</p>)}
        </Box>
    </SlideFade>);
}

export default connect(mapStateToProps, { changeActiveView, switchActiveRecipe })(RecipeOverview);