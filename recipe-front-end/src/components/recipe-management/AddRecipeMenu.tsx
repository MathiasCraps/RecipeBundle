import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea } from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";
import { connect } from "react-redux";
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
    function changeInputs(event: ChangeEvent<HTMLInputElement>, index: number) {
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

    const [ingredients, setIngredients] = useState([{
        value: '',
        identifier: ++index
    }]);

    return (<Modal isOpen={props.isOpened} onClose={() => props.switchMenu(OpenedMenu.NONE)}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>{Localisation.ADD_OWN_RECIPE}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Input placeholder={Localisation.TITLE} />
                <br/><br/>
                <h2>{Localisation.INGREDIENTS}</h2>
                {ingredients.map((ingredient: IngredientInput, index: number) => {
                    return <Input placeholder={Localisation.INGREDIENT} key={index} value={ingredient.value} onChange={(event) => changeInputs(event, index)} />
                })}
                
                <br/><br/><br/>
                <Textarea placeholder={Localisation.STEP} />
                <input type="file" accept="image/jpeg, image/png"/>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={() => alert('Nice! But not yet implemented. :(')}>
                    {Localisation.ADD_RECIPE}
            </Button>
                <Button variant="ghost" onClick={() => props.switchMenu(OpenedMenu.NONE)}>{Localisation.CANCEL}</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>)
}

export default connect(mapStateToProps, { switchMenu })(AddRecipeMenu);