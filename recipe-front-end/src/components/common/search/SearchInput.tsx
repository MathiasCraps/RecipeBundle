import { Box, Input } from "@chakra-ui/react";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { KeyboardEvent, useState } from "react";
import { Localisation } from '../../../localisation/AppTexts';
import './SearchInput.scss';

interface OwnProps<ItemType> {
    selection: ItemType | undefined;
    inputRef: React.RefObject<HTMLInputElement>;
    inputHasResults: (hasResults: boolean) => void;
    onSelectionChange: (selectedItem: ItemType | undefined) => void;
    onRender: (item: ItemType) => string;
    items: ItemType[];
    defaultValue: string | undefined;
}

export default function SearchInput<ItemType>(props: OwnProps<ItemType>) {
    const [results, setResults] = useState<ItemType[]>([]);
    const [inputValue, setInputValue] = useState(props.defaultValue || '')
    const inputRef = props.inputRef;

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

        setInputValue(props.inputRef.current!.value);
    }

    function updateSearchFromSuggestion(focusedSuggestion: ItemType) {
        setInputValue(props.onRender(focusedSuggestion));
        props.inputHasResults(true);
        setResults([]);
    }

    return (<div>
        <Input ref={inputRef}
            onKeyUp={handleQueryType}
            onChange={(e) => {
                const query = e.target.value;
                const results = props.items.filter((item) => query && props.onRender(item).toLowerCase().indexOf(query.toLowerCase()) !== -1);

                setInputValue(query);
                setResults(results);
                props.inputHasResults(Boolean(!inputRef.current!.value || results.length));
                if (results.length) {
                    props.onSelectionChange(results[0]);
                }
            }}
            value={inputValue}
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
                <FontAwesomeIcon icon={faAngleRight} /> {props.onRender(result)}
            </Box>)
        })}</Box>
    </div>);
}
