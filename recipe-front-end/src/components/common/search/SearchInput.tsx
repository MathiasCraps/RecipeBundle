import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { KeyboardEvent, useRef, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from 'redux';
import { Recipe } from '../../../interfaces/Recipe';
import { Localisation } from '../../../localisation/AppTexts';
import { addMenu } from '../../../redux/Actions';
import { DayMenu, ReduxModel } from '../../../redux/Store';

interface OwnProps {
    selection: Recipe | undefined;
    onSelectionChange: (selectedRecipe: Recipe | undefined) => void;
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

function mapActions(dispatch: Dispatch) {
    return {
        addMenu: addMenu(dispatch)
    };
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

function SearchInput(props: Props) {
    const [results, setResults] = useState<Recipe[]>([]);

    function onConfirm() {
        setResults([]);
        props.onSelectionChange(undefined);
    }

    function handleQueryType(event: KeyboardEvent<HTMLInputElement>) {
        if (!results.length) {
            return;
        }

        const currentIndex = props.selection ? results.indexOf(props.selection) : 0;
        if (event.code === 'ArrowUp' && currentIndex !== 0) {
            event.preventDefault();
            props.onSelectionChange(results[currentIndex - 1]);
            return;
        }

        if (event.code === 'ArrowDown' && currentIndex < results.length - 1) {
            event.preventDefault();
            props.onSelectionChange(results[currentIndex + 1])
            return
        }

        if (props.selection && (event.code === 'Enter' || event.code === 'NumpadEnter')) {
            updateSearchFromSuggestion(props.selection);
        }
    }

    function updateSearchFromSuggestion(focusedSuggestion: Recipe) {
        inputRef.current!.value = focusedSuggestion.title;
        setResults([]);
    }

    const inputRef = useRef<HTMLInputElement>(null);
    return (<div>
        <Input ref={inputRef}
            onKeyUp={handleQueryType}
            onChange={(e) => {
                const query = e.target.value;
                const results = props.recipes.filter((recipe) => query && recipe.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
                setResults(results);
                if (results.length) {
                    props.onSelectionChange(results[0]);
                }
            }}
            placeholder={Localisation.DO_SEARCH} />
        <Box>{results.map((result, index) => {
            const isActive = props.selection === result;
            return (<Box className={`search-result ${isActive ? 'active' : ''}`}
                onClick={() => {
                    props.onSelectionChange(result);
                    updateSearchFromSuggestion(result);
                    inputRef.current!.focus(); // always keep your focus
                }}
                onMouseEnter={() => props.onSelectionChange(result)}
                key={index}>
                <FontAwesomeIcon icon={faAngleRight} /> {result.title}
            </Box>)
        })}</Box>
    </div>);
}

export default connect(mapStateToProps, mapActions)(SearchInput);