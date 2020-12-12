import { Box, Image } from "@chakra-ui/react";

interface RecipePreviewProps {
  title: string;
  content: string;
  image: string;
}

function RecipePreview(props: RecipePreviewProps) {
  return (<Box borderWidth="1px" cursor="pointer">
      <h2>{props.title}</h2>
      <Image src={props.image} maxWidth="100%" alt="" />
      <div>{props.content}</div>
  </Box>);
}

export default RecipePreview;
