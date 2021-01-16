import React from "react";
import { Box, Image } from "@chakra-ui/react";
import { connect } from 'react-redux';
import { Recipe } from "../../interfaces/Recipe";
import { changeActiveView } from "../../redux/Actions";
import { ReduxModel, ViewType } from "../../redux/Store";

interface OriginalProps {
  recipe: Recipe;
}

interface props {
  changeActiveView: typeof changeActiveView;
}

type Props = OriginalProps & props;

function mapStateToProps(state: ReduxModel, ownProps: OriginalProps) {
  return ownProps;
}

function RecipePreview(props: Props) {
  return (<Box
    className="recipeBox"
    cursor="pointer"
    borderRadius="lg"
    onClick={() => props.changeActiveView(ViewType.RecipeView, props.recipe)}
  ><a href="#">
    <strong className="recipe-preview-size">{props.recipe.title}</strong>
    <Image src={props.recipe.image} width="100%" alt="" />
    </a>
  </Box>);
}

export default connect(mapStateToProps, { changeActiveView })(RecipePreview);