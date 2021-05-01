import { SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Recipe } from "../../interfaces/Recipe";
import { Localisation } from '../../localisation/AppTexts';
import { Paths } from '../../Paths';
import { ReduxModel } from '../../redux/Store';
import { NotLoggedIn } from '../account/NotLoggedInText';
import ContentContainer from '../common/ContentContainer';
import RecipePreview from "./RecipePreview";

interface ReduxProps {
  recipes: Recipe[];
  isLoggedIn: boolean;
}

const options = {
  paddingTop: "2em",
  margin: "auto",
  maxWidth: "80em",
  padding: "1em",
  columns: [1, 1, 2, 2, 3],
  spacing: "1em"
}

function mapsStateToProps(reduxState: ReduxModel): ReduxProps {
    return {
      recipes: reduxState.recipes,
      isLoggedIn: reduxState.user.loggedIn
    }
}

function RecipeList(props: ReduxProps): React.ReactElement {
  if (!props.recipes.length) {
    const content = props.isLoggedIn ? <Link to={Paths.ADD_RECIPE}>{Localisation.ADD_OWN_RECIPE}</Link> : <NotLoggedIn extraText="" />
    return <ContentContainer>
       <h2>{Localisation.NO_RECIPES_FOUND}</h2>
       {content}
    </ContentContainer>
 }

  return (<SimpleGrid {...options}>
    {props.recipes.map((recipe, index) => (<RecipePreview recipe={recipe} key={index}></RecipePreview>))}
  </SimpleGrid>);
}

export default connect(mapsStateToProps)(RecipeList);