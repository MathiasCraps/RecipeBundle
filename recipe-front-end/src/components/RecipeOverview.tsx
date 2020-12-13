import { Drawer, Box, Heading, Image, DrawerContent, DrawerCloseButton } from "@chakra-ui/react";
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
    return (<Drawer
        isOpen={Boolean(props.recipe)}
        size="full"
        closeOnEsc={true}
        isFullHeight={true}
        motionPreset="slideInBottom"
        onClose={() => props.changeActiveView(ViewType.Overview, undefined)}>
        <DrawerContent>
            <Box maxWidth="80em" marginLeft="auto" marginRight="auto">
                <DrawerCloseButton size="sm" onClick={() => props.changeActiveView(ViewType.Overview, undefined)} />
                <Heading as="h2">{props.recipe.title}</Heading>
                <Image src={props.recipe.image} alt="" />
                <p>{props.recipe.content}</p>
            </Box>
        </DrawerContent>
    </Drawer>);
}



export default connect(mapStateToProps, { changeActiveView })(RecipeOverview);