import './App.css';
import RecipePreview from './components/RecipePreview';
import { Recipe } from './interfaces/Recipe';

interface AppProps {
    recipes: Recipe[];
}

function App(props: AppProps) {
  return <div>{props.recipes.map((data, index) => (<RecipePreview {...data} key={index}></RecipePreview>))}</div>;
}

export default App;
