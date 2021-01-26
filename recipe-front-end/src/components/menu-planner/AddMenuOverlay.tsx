import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { KeyboardEvent, useRef, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { addMenu } from "../../redux/Actions";
import { AddMenuAction, DayMenu, ReduxModel } from "../../redux/Store";

interface OwnProps {
    isOpened: boolean;
    onCancel: () => void;
    onSubmit: (selectedRecipe: Recipe) => void;
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
    const [results, setResults] = useState<Recipe[]>([]);
    const [focusedSuggestion, setFocusedSuggestion] = useState<Recipe>();

    function reset() {
        setResults([]);
        setFocusedSuggestion(undefined);
    }

    function onCancel() {
        props.onCancel();
        reset();
    }

    function onConfirm() {
        props.addMenu({
            date: props.date.getTime(),
            recipe: focusedSuggestion!,
            menuId: -1
        });
        props.onSubmit(focusedSuggestion!);
        reset();

    }

    function handleQueryType(event: KeyboardEvent<HTMLInputElement>) {
        if (!results.length) {
            return;
        }

        const currentIndex = focusedSuggestion ? results.indexOf(focusedSuggestion) : 0;
        if (event.code === 'ArrowUp' && currentIndex !== 0) {
            event.preventDefault();
            setFocusedSuggestion(results[currentIndex - 1]);
            return;
        }

        if (event.code === 'ArrowDown' && currentIndex < results.length - 1) {
            event.preventDefault();
            setFocusedSuggestion(results[currentIndex + 1])
            return
        }

        if (focusedSuggestion && (event.code === 'Enter' || event.code === 'NumpadEnter')) {
            updateSearchFromSuggestion(focusedSuggestion);
        }
    }

    function updateSearchFromSuggestion(focusedSuggestion: Recipe) {
        inputRef.current!.value = focusedSuggestion.title;
        setResults([]);
    }

    const inputRef = useRef<HTMLInputElement>(null);
    return (<Modal isOpen={props.isOpened} initialFocusRef={inputRef} onClose={onCancel}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>{Localisation.ADD_RECIPE}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Input ref={inputRef}
                    onKeyUp={handleQueryType}
                    onChange={(e) => {
                        const query = e.target.value;
                        const results = props.recipes.filter((recipe) => query && recipe.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
                        setResults(results);
                        if (results.length) {
                            setFocusedSuggestion(results[0]);
                        }
                    }}
                    placeholder={Localisation.DO_SEARCH} />
                <Box>{results.map((result, index) => {
                    const isActive = focusedSuggestion === result;
                    return (<Box className={`search-result ${isActive ? 'active' : ''}`}
                        onClick={() => {
                            setFocusedSuggestion(result);
                            updateSearchFromSuggestion(result);
                            inputRef.current!.focus(); // always keep your focus
                        }}
                        onMouseEnter={() => setFocusedSuggestion(result)}
                        key={index}>
                        <FontAwesomeIcon icon={faAngleRight} /> {result.title}
                    </Box>)
                })}</Box>
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