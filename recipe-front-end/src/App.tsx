import { Box, Center, Heading } from "@chakra-ui/react";
import { faUserAlt, faUserNinja } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import AccountMenu from "./components/AccountMenu";
import { RecipeList } from "./components/RecipeList";
import RecipeOverview from "./components/RecipeOverview";
import { Recipe } from "./interfaces/Recipe";
import { toggleLoginForm } from './redux/Actions';
import { ReduxModel, ViewType } from './redux/Store';

interface AppProps {
  recipes: Recipe[];
  view: ViewType;
  activeRecipe: Recipe | undefined;
  loggedIn: boolean;
}

interface ReduxActionProps {
  toggleLoginForm: typeof toggleLoginForm;
}

type Props = AppProps & ReduxActionProps;

function mapStateToProps(props: ReduxModel): AppProps {
  return {
    recipes: props.recipes,
    view: props.view,
    activeRecipe: props.activeRecipe,
    loggedIn: props.loggedIn
  };
}

function App(props: Props) {
  return props.activeRecipe ? <RecipeOverview /> : (<Box>
    <header>
      <Center bgColor="gray.100" p="0.5em">
        <Heading as="h1">👨‍🍳 Rebundle 👩🏻‍🍳</Heading>
        <a href="#" onClick={() => props.toggleLoginForm()} className="user-account-button" aria-label="Account beheren"><FontAwesomeIcon icon={props.loggedIn ? faUserAlt : faUserNinja} /></a>
      </Center>
    </header>
    <AccountMenu />
    <RecipeList recipes={props.recipes}></RecipeList>
  </Box >)
}

export default connect(mapStateToProps, { toggleLoginForm })(App);