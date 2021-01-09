import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea } from "@chakra-ui/react";
import React, { ChangeEvent, useRef, useState } from "react";
import { connect } from "react-redux";
import { Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { switchMenu } from "../../redux/Actions";
import { OpenedMenu, ReduxModel } from "../../redux/Store";

interface IngredientInput {
    value: string;
    identifier: number;
}

let index = 0;

interface ComponentProps {
    isOpened: boolean;
}

interface ReduxProps {
    switchMenu: typeof switchMenu;
}

type Props = ComponentProps & ReduxProps;


function mapStateToProps(reduxModel: ReduxModel): ComponentProps {
    return {
        isOpened: reduxModel.openedMenu === OpenedMenu.ADD_RECIPE
    }
}

export function AddRecipeMenu(props: Props) {
    function updateIngredientsInputs(event: ChangeEvent<HTMLInputElement>, index: number) {
        const copyOfIngredients = [...ingredients]; // always make a copy for immutability

        copyOfIngredients[index].value = event.target.value; // update the entry

        const entryCount0Based = copyOfIngredients.length -1;
        const lastEntry = copyOfIngredients[entryCount0Based];
        if (lastEntry.value) {
            copyOfIngredients[entryCount0Based +1] = {
                value: '',
                identifier: ++index
            }
        }
        
        const emptiedFilter = copyOfIngredients.filter((entry, index) => {
            const lastEntry = (index + 1) === copyOfIngredients.length;
            return entry.value || lastEntry;
        });

        setIngredients(emptiedFilter);
    }

    function postRecipe() {
        if (!canBeSubmitted) {
            return;
        }

        const transformedIngredients = ingredients.slice(0, ingredients.length - 1).map((ingredient) => {
            return {quantity: '1 stuk', name: ingredient.value} // todo: remove me by adding quantity option to interface!
        })
        const recipeData: Recipe = {
            title,
            ingredients: transformedIngredients,
            steps,
            image: ''
        }

        const formData = new FormData()
        formData.append('userfile', ref.current!.files![0]);
        formData.append('recipe', JSON.stringify(recipeData))

        fetch('/addRecipe', {
            method: 'POST',
            body: formData
        })
    }

    const [ingredients, setIngredients] = useState([{ value: '', identifier: ++index}]);
    const [title, setTitle] = useState('');
    const [steps, setSteps] = useState('');
    const [imagePath, setImagePath] = useState('');
    const ref = useRef<HTMLInputElement>(null)

    const canBeSubmitted = Boolean(ingredients.length > 1 && title && steps && imagePath);

    return (<Modal isOpen={props.isOpened} onClose={() => props.switchMenu(OpenedMenu.NONE)}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>{Localisation.ADD_OWN_RECIPE}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Input placeholder={Localisation.TITLE} value={title} onChange={(event) => setTitle(event.target.value)} />
                <br/><br/>
                <h2>{Localisation.INGREDIENTS}</h2>
                {ingredients.map((ingredient: IngredientInput, index: number) => {
                    return <Input placeholder={Localisation.INGREDIENT} key={index} value={ingredient.value} onChange={(event) => updateIngredientsInputs(event, index)} />
                })}
                
                <br/><br/><br/>
                <Textarea placeholder={Localisation.STEP} onChange={(event) => setSteps(event.target.value)} />
                <input ref={ref} type="file" accept="image/jpeg, image/png" onChange={(event) => setImagePath(event.target.value)} />
            </ModalBody>

            <ModalFooter>
                <Button colorScheme="blue" disabled={!canBeSubmitted} mr={3} onClick={() => postRecipe()}>
                    {Localisation.ADD_RECIPE}
            </Button>
                <Button variant="ghost" onClick={() => props.switchMenu(OpenedMenu.NONE)}>{Localisation.CANCEL}</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>)
}

export default connect(mapStateToProps, { switchMenu })(AddRecipeMenu);