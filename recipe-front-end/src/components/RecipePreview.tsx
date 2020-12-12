import { Box, Image, Heading, propNames } from "@chakra-ui/react";
import { changeActiveView } from "../redux/Actions";
import { ReduxModel, ViewType } from "../redux/Store";
import { connect } from 'react-redux';

interface RecipePreviewProps {
  title: string;
  content: string;
  image: string;
}

interface props {
  changeActiveView: typeof changeActiveView;
}

type RecipedPreviewUnion = RecipePreviewProps & props;

function mapStateToProps(state: ReduxModel, ownProps: RecipePreviewProps) {
  console.log(arguments);
  return ownProps;
}

function RecipePreview(props: RecipedPreviewUnion) {
  return (<Box
    borderWidth="1px"
    cursor="pointer"
    p="0.5em"
    borderRadius="lg"
    onClick={() => props.changeActiveView(ViewType.RecipeView)}
  >
    <Heading as="h2">{props.title}</Heading>
    <Image src={props.image} maxWidth="100%" alt="" />
    <div>{props.content}</div>
  </Box>);
}

export default connect(mapStateToProps, { changeActiveView })(RecipePreview);