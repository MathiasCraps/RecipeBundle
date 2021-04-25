import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { addMenu } from "../../redux/Actions";
import { AddMenuAction, DayMenu, ReduxModel } from "../../redux/Store";
import SearchInput from '../common/search/SearchInput';

interface OwnProps {
    isOpened: boolean;
    onCancel: () => void;
    onSubmit: () => void;
}

interface ReduxProps {
    recipes: Recipe[];
    date: Date;
}

interface ReduxActionProps {
    addMenu: (menu: DayMenu) => Promise<void>;
}

function mapStateToProps(reduxStore: ReduxModel): ReduxProps {
    return {
        recipes: reduxStore.recipes,
        date: new Date(reduxStore.activeDay!)
    }
}

function map(dispatch: Dispatch<AddMenuAction>) {
    return {
        addMenu: addMenu(dispatch),
    };
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

function AddMenuOverlay(props: Props) {
    const [focusedSuggestion, setFocusedSuggestion] = useState<Recipe>();

    function reset() {
        setFocusedSuggestion(undefined);
    }

    function onCancel() {
        reset();
        props.onCancel();
    }

    function onConfirm() {
        if (focusedSuggestion) {
            props.addMenu({
                date: props.date.getTime(),
                recipe: focusedSuggestion!,
                menuId: -1,
                ingredientsBought: false
            });
        }
        reset();
        props.onSubmit();
    }

    const inputRef = useRef<HTMLInputElement>(null);
    return (<Modal isOpen={props.isOpened} initialFocusRef={inputRef} onClose={props.onCancel}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>{Localisation.ADD_RECIPE}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <SearchInput<Recipe>
                    onSelectionChange={setFocusedSuggestion}
                    selection={focusedSuggestion}
                    onRender={(recipe) => recipe.title}
                    items={props.recipes}
                    inputRef={inputRef}
                    inputHasResults={() => {
                        // ignore
                    }}
                    defaultValue={''}
                />
            </ModalBody>

            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onConfirm}>
                    {Localisation.ADD}
                </Button>
                <Button variant="ghost" onClick={onCancel}>{Localisation.CANCEL}</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>);
}

export default connect(mapStateToProps, map)(AddMenuOverlay);