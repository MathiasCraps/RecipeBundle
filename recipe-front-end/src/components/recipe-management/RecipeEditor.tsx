import { Box, Button, Input, Textarea, Tooltip, useToast } from "@chakra-ui/react";
import { faPencilAlt, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { Dispatch } from "redux";
import { Ingredient, QuantifiedIngredient, Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { Paths } from '../../Paths';
import { addRecipe, AddRecipeReturn, editRecipe, EditRecipeReturn } from "../../redux/Actions";
import { AddRecipeAction, EditRecipeAction, ReduxModel } from "../../redux/Store";
import IngredientsModal, { quantityDescriptions } from "./IngredientsModal";

let index = -10e8;

interface OwnProps {
    defaultState: Recipe;
    editingExisting: boolean;
}

interface ComponentProps {
    isLoggedIn: boolean;
}

interface ReduxProps {
    addRecipe: AddRecipeReturn;
    editRecipe: EditRecipeReturn;
}

type Props = OwnProps & ComponentProps & ReduxProps;

function mapStateToProps(reduxModel: ReduxModel): ComponentProps {
    return {
        isLoggedIn: reduxModel.user.loggedIn
    }
}

function mapDispatchToProps(dispatch: Dispatch<AddRecipeAction | EditRecipeAction>): ReduxProps {
    return {
        addRecipe: addRecipe(dispatch),
        editRecipe: editRecipe(dispatch)
    };
}

export function createEmptyIngredient(): QuantifiedIngredient {
    return {
        name: '',
        id: ++index,
        quantity_number: 0,
        quantity_description: quantityDescriptions[0],
        categoryId: 1, // todo: make categories available via graphql so we can use the first value without hardcoding
    };
}

interface IngredientModificationKind {
    action: 'add' | 'edit';
    ingredient: QuantifiedIngredient;
}

export function RecipeEditor(props: Props) {
    if (!props.isLoggedIn) {
        return <Redirect to={Paths.BASE} />
    }

    const toast = useToast();

    function close() {
        window.location.hash = Paths.BASE;
    }

    function removeIngredient(requestedRemoveIngredient: QuantifiedIngredient) {
        const shallowClone = [...ingredients];
        setIngredients(shallowClone.filter((ingredient) => ingredient.id !== requestedRemoveIngredient.id));
    }

    async function postRecipe() {
        if (!canBeSubmitted) {
            return;
        }

        const recipeData: Recipe = {
            title,
            ingredients: ingredients as unknown as Ingredient[],
            steps,
            image: props.defaultState.image,
            id: props.defaultState.id || -1
        };

        const formData = new FormData();
        formData.append('userfile', ref.current!.files![0]);
        formData.append('recipe', JSON.stringify(recipeData))

        try {
            if (!props.editingExisting) {
                await props.addRecipe(recipeData, formData);
            } else {
                await props.editRecipe(recipeData, formData);
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

        setIngredients(props.defaultState.ingredients);
        setTitle(props.defaultState.title);
        setSteps(props.defaultState.steps);
        setImagePath(props.defaultState.image);
        setEditingType(undefined);
        close();
    }

    const defaultState = props.defaultState;

    const [ingredients, setIngredients] = useState<QuantifiedIngredient[]>(defaultState.ingredients);
    const [title, setTitle] = useState(defaultState.title);
    const [steps, setSteps] = useState(defaultState.steps);
    const [imagePath, setImagePath] = useState(defaultState.image);
    const [editingIngredient, setEditingIngredient] = useState<QuantifiedIngredient>()
    const [editingType, setEditingType] = useState<IngredientModificationKind>();
    const ref = useRef<HTMLInputElement>(null);

    const baseFilled = Boolean(ingredients.length && title && steps)
    const canBeSubmitted = props.editingExisting ? baseFilled : baseFilled && imagePath;

    return (<div>
        <Box className="box">
            <label>
                <b>{Localisation.TITLE}</b>
                <Input placeholder={Localisation.TITLE} value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>
        </Box>

        <Box className="box"><b>{Localisation.INGREDIENTS}</b>
            <Box>{ingredients.map((ingredient: QuantifiedIngredient) => {
                const { name, quantity_number, quantity_description } = ingredient;
                return (<Box className="edit-ingredient-container" key={ingredient.id}>
                    <label>
                        <Tooltip label={Localisation.EDIT_INGREDIENT} fontSize="md">
                            <Button onClick={() => {
                                setEditingType({
                                    action: 'edit',
                                    ingredient
                                });
                            }}><FontAwesomeIcon icon={faPencilAlt} /></Button>
                        </Tooltip>
                        <Tooltip label={Localisation.REMOVE_INGREDIENT} fontSize="md">
                            <Button onClick={() => removeIngredient(ingredient)}><FontAwesomeIcon icon={faTrash} /></Button>
                        </Tooltip>
                        <strong>{name}</strong>, {quantity_number} {quantity_description}
                    </label>
                </Box>)
            })}</Box>


            {editingType && <IngredientsModal
                onConfirm={(ingredient: QuantifiedIngredient) => {
                    if (!editingType) {
                        return;
                    }

                    const identifier = editingType.ingredient.id;
                    const shallowCopy = [...ingredients];
                    const entryToReplace = shallowCopy.filter((ingredient) => ingredient.id === identifier);
                    const indexOfEntryToReplace = shallowCopy.indexOf(entryToReplace[0]);

                    if (indexOfEntryToReplace !== -1) {
                        shallowCopy[indexOfEntryToReplace] = ingredient;
                    } else {
                        shallowCopy.push(ingredient);
                    }

                    setEditingType(undefined);
                    setIngredients(shallowCopy);
                }}
                onCancel={() => {
                    setEditingType(undefined);
                }}
                ingredientInputs={editingType.ingredient} />}

            <Button onClick={() => {
                const newIngredient = createEmptyIngredient();
                setEditingType({
                    action: 'add',
                    ingredient: newIngredient
                });
            }}><FontAwesomeIcon icon={faPlus} /></Button>
        </Box>

        <Box className="box">
            <label>
                <Box><b>{Localisation.STEPS}</b></Box>
                <Textarea placeholder={Localisation.STEP} value={steps} onChange={(event) => setSteps(event.target.value)} />
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
                {props.editingExisting ? Localisation.EDIT_RECIPE : Localisation.ADD_RECIPE }
            </Button>
            <Button variant="ghost" onClick={close}>{Localisation.CANCEL}</Button>
        </Box>
    </div>)
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipeEditor);