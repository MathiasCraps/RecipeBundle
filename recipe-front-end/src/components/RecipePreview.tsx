import { Box, Image, Heading, propNames } from "@chakra-ui/react";
import { changeActiveView } from "../redux/Actions";
import { ReduxModel, ViewType } from "../redux/Store";
import { connect } from 'react-redux';
import { Recipe } from "../interfaces/Recipe";

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
    p="0.5em"
    borderRadius="lg"
    onClick={() => props.changeActiveView(ViewType.RecipeView, props.recipe)}
  >
    <strong className="recipe-preview-size">{props.recipe.title}</strong>
    <Image src={props.recipe.image} maxWidth="100%" alt="" />
  </Box>);
}

export default connect(mapStateToProps, { changeActiveView })(RecipePreview);