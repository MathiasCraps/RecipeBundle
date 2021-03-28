import { Box, Button, Heading, Input, Textarea, Tooltip, useToast } from "@chakra-ui/react";
import { faPencilAlt, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { Dispatch } from "redux";
import { Ingredient, Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { Paths } from '../../Paths';
import { addRecipe, AddRecipeReturn } from "../../redux/Actions";
import { AddRecipeAction, ReduxModel } from "../../redux/Store";
import ContentContainer from "../common/ContentContainer";
import IngredientsModal from "./IngredientsModal";

export interface IngredientInput {
    name: string;
    quantityNumber: number;
    quantityDescription: string;
    identifier: number;
    categoryId: number;
}

let index = 0;

interface ComponentProps {
    isLoggedIn: boolean;
}

interface ReduxProps {
    addRecipe: AddRecipeReturn;
}

type Props = ComponentProps & ReduxProps;


function mapStateToProps(reduxModel: ReduxModel): ComponentProps {
    return {
        isLoggedIn: reduxModel.user.loggedIn
    }
}

function mapDispatchToProps(dispatch: Dispatch<AddRecipeAction>): ReduxProps {
    return { 
        addRecipe: addRecipe(dispatch) 
    }
}

function createEmptyIngredient() {
    return {
        name: '',
        identifier: ++index,
        quantityDescription: '',
        quantityNumber: 0,
        categoryId: -1
    }
}

export function AddRecipeMenu(props: Props) {
    if (!props.isLoggedIn) {
        return <Redirect to={Paths.BASE} />
    }

    const toast = useToast();

    function close() {
        window.location.href = Paths.BASE;
    }

    function removeIngredient(requestedRemoveIngredient: IngredientInput) {
        const shallowClone = [...ingredients];
        setIngredients(shallowClone.filter((ingredient) => ingredient.identifier !== requestedRemoveIngredient.identifier));
    }

    async function postRecipe() {
        if (!canBeSubmitted) {
            return;
        }

        const transformedIngredients: Ingredient[] = ingredients
            .map((ingredient) => {
                return {
                    name: ingredient.name,
                    quantity_description: ingredient.quantityDescription,
                    quantity_number: ingredient.quantityNumber,
                    categoryId: ingredient.categoryId,
                    categoryName: ''
                };
            }
        );
        const recipeData: Recipe = {
            title,
            ingredients: transformedIngredients,
            steps,
            image: '',
            id: -1
        }

        const formData = new FormData();
        formData.append('userfile', ref.current!.files![0]);
        formData.append('recipe', JSON.stringify(recipeData))

        try {
            await props.addRecipe(recipeData, formData);

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

    return (<ContentContainer>
        <Heading as="h2">{Localisation.ADD_OWN_RECIPE}</Heading>
        <Box className="box">
            <label>
                <b>{Localisation.TITLE}</b>
                <Input placeholder={Localisation.TITLE} value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>
        </Box>

        <Box className="box"><b>{Localisation.INGREDIENTS}</b>
            <Box>{ingredients.map((ingredient: IngredientInput) => {
                const { name, quantityNumber, quantityDescription } = ingredient;
                return (<Box className="edit-ingredient-container" key={ingredient.identifier}>
                    <label>
                        <Tooltip label={Localisation.EDIT_INGREDIENT} fontSize="md">
                            <Button onClick={() => setEditingIngredient(ingredient)}><FontAwesomeIcon icon={faPencilAlt} /></Button>
                        </Tooltip>
                        <Tooltip label={Localisation.REMOVE_INGREDIENT} fontSize="md">
                            <Button onClick={() => removeIngredient(ingredient)}><FontAwesomeIcon icon={faTrash} /></Button>
                        </Tooltip>
                        <strong>{name}</strong>, {quantityNumber} {quantityDescription}
                    </label>
                </Box>)
            })}</Box>


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

            <Button onClick={() => setEditingIngredient(createEmptyIngredient())}><FontAwesomeIcon icon={faPlus} /></Button>
        </Box>

        <Box className="box">
            <label>
                <Box><b>{Localisation.STEPS}</b></Box>
                <Textarea placeholder={Localisation.STEP} onChange={(event) => setSteps(event.target.value)} />
            </label>
        </Box>

        <Box className="box">
            <label>
                <b>{Localisation.ADD_PHOTO}</b><br />
                <input ref={ref} type="file" accept="image/jpeg, image/png" onChange={(event) => setImagePath(event.target.value)} />
            </label>
        </Box>
        <Box className="box">
            <Button colorScheme="blue" disabled={!canBeSubmitted} mr={3} onClick={() => postRecipe()}>
                {Localisation.ADD_RECIPE}
            </Button>
            <Button variant="ghost" onClick={() => close()}>{Localisation.CANCEL}</Button>
        </Box>
    </ContentContainer>)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRecipeMenu);