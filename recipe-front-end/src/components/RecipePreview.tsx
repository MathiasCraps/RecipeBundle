interface RecipePreviewProps  {
  title: string;
  content: string;
}

function RecipePreview(props: RecipePreviewProps) {
  return (<article>
      <h2>{props.title}</h2>
      <div>{props.content}</div>                             
    </article>);
}

export default RecipePreview;
