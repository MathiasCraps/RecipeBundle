import { Box, Button, CloseButton, Heading, Input, SlideFade, Textarea, useToast } from "@chakra-ui/react";
import { faPencilAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { AddRecipeResponse } from "../../interfaces/AddRecipeResponse";
import { Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { changeActiveView, updateRecipes } from "../../redux/Actions";
import { ReduxModel, ViewType } from "../../redux/Store";
import { IngredientsModal } from "./IngredientsModal";

export interface IngredientInput {
    name: string;
    quantityNumber: number;
    quantityDescription: string;
    identifier: number;
}

let index = 0;

interface ComponentProps {
    isOpened: boolean;
}

interface ReduxProps {
    changeActiveView: typeof changeActiveView;
    updateRecipes: typeof updateRecipes;
}

type Props = ComponentProps & ReduxProps;


function mapStateToProps(reduxModel: ReduxModel): ComponentProps {
    return {
        isOpened: reduxModel.view === ViewType.AddRecipe
    }
}

function createEmptyIngredient() {
    return {
        name: '',
        identifier: ++index,
        quantityDescription: '',
        quantityNumber: 0
    }
}

export function AddRecipeMenu(props: Props) {
    const toast = useToast();

    function close() {
        props.changeActiveView(ViewType.Overview, undefined);
    }

    async function postRecipe() {
        if (!canBeSubmitted) {
            return;
        }

        const transformedIngredients = ingredients.slice(0, ingredients.length - 1).map((ingredient) => {
            return {
                name: ingredient.name,
                quantity: `${ingredient.quantityNumber} ${ingredient.quantityDescription}`
            };
        });
        const recipeData: Recipe = {
            title,
            ingredients: transformedIngredients,
            steps,
            image: ''
        }

        const formData = new FormData()
        formData.append('userfile', ref.current!.files![0]);
        formData.append('recipe', JSON.stringify(recipeData))

        try {
            const response = await fetch('/addRecipe', {
                method: 'POST',
                body: formData
            });
            const responseData = await response.json() as AddRecipeResponse;

            if (responseData.error) {
                throw new Error(responseData.error);
            }

            try {
                const updatedDataResponse = await fetch('/getRecipes');
                const updatedData = await updatedDataResponse.json() as Recipe[];

                props.updateRecipes(updatedData)
            } catch (err) {
                console.error(err);
            }

            toast({
                description: Localisation.ADDING_WAS_SUCCESS,
                status: 'success'
            });
        } catch (err) {
            toast({
                description: Localisation.ADDING_FAILED,
                status: 'error'
            })
        }

        setIngredients([]);
        setTitle('');
        setSteps('');
        setImagePath('');
        setEditingIngredient(undefined);
        close();
    }

    const [ingredients, setIngredients] = useState<IngredientInput[]>([]);
    const [title, setTitle] = useState('');
    const [steps, setSteps] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [editingIngredient, setEditingIngredient] = useState<IngredientInput>();
    const ref = useRef<HTMLInputElement>(null)

    const canBeSubmitted = Boolean(ingredients.length && title && steps && imagePath);

    return (<Box>
        <CloseButton className="close-button-top-left" autoFocus={true} size="md" onClick={() => props.changeActiveView(ViewType.Overview, undefined)} />
        <SlideFade in={true}><Box className="add-recipe-box" padding="2em" maxWidth="80em">
            <Heading as="h2">{Localisation.ADD_OWN_RECIPE}</Heading>
            <Input placeholder={Localisation.TITLE} value={title} onChange={(event) => setTitle(event.target.value)} />
            <br /><br />
            <h2>{Localisation.INGREDIENTS}</h2>
            {ingredients.map((ingredient: IngredientInput, index: number) => {
                const {name, quantityNumber, quantityDescription} = ingredient;
                return (<Box className="edit-ingredient-container" key={index}>
                    <label>
                        <Button onClick={() => setEditingIngredient(ingredient)}><FontAwesomeIcon icon={faPencilAlt}/></Button>
                        <strong>{name}</strong>, {quantityNumber} {quantityDescription}
                    </label>
                </Box>)
            })}

            
            {editingIngredient && <IngredientsModal 
                onConfirm={(ingredientInput: IngredientInput) => {
                    const identifier = ingredientInput.identifier;
                    const shallowCopy = [...ingredients];
                    const entryToReplace = shallowCopy.filter((ingredient) => ingredient.identifier === identifier);
                    const indexOfEntryToReplace = shallowCopy.indexOf(entryToReplace[0]);

                    if (indexOfEntryToReplace !== -1) {
                        shallowCopy[indexOfEntryToReplace] = ingredientInput;
                    } else {
                        shallowCopy.push(ingredientInput);
                    }

                    setEditingIngredient(undefined);
                    setIngredients(shallowCopy);
                }}
                onCancel={() => {
                    setEditingIngredient(undefined)
                }}
            ingredientInputs={editingIngredient} />}
            

            <Button onClick={() =>setEditingIngredient(createEmptyIngredient())}><FontAwesomeIcon icon={faPlus}/></Button>
            <br /><br /><br />
            <Textarea placeholder={Localisation.STEP} onChange={(event) => setSteps(event.target.value)} />
            <input ref={ref} type="file" accept="image/jpeg, image/png" onChange={(event) => setImagePath(event.target.value)} />

            <Button colorScheme="blue" disabled={!canBeSubmitted} mr={3} onClick={() => postRecipe()}>
                {Localisation.ADD_RECIPE}
            </Button>
            <Button variant="ghost" onClick={() => close()}>{Localisation.CANCEL}</Button>
        </Box></SlideFade></Box>)
}

export default connect(mapStateToProps, { changeActiveView, updateRecipes })(AddRecipeMenu);