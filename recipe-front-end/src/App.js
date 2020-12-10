import './App.css';
import Recipe from './components/Recipe';

function App(props) {
  return props.recipes.map((data, index) => (<Recipe {...data} key={index}></Recipe>));
}

export default App;
