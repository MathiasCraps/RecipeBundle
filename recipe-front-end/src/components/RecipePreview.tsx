import { Box, Image, Heading } from "@chakra-ui/react";

interface RecipePreviewProps {
  title: string;
  content: string;
  image: string;
}

function RecipePreview(props: RecipePreviewProps) {
  return (<Box
    borderWidth="1px"
    cursor="pointer"
    p="0.5em"
    borderRadius="lg">
    <Heading as="h2">{props.title}</Heading>
    <Image src={props.image} maxWidth="100%" alt="" />
    <div>{props.content}</div>
  </Box>);
}

export default RecipePreview;
