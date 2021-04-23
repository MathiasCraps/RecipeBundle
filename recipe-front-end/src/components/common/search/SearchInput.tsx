import { Box, Input } from "@chakra-ui/react";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { KeyboardEvent, useRef, useState } from "react";
import { Localisation } from '../../../localisation/AppTexts';
import './SearchInput.scss';

interface OwnProps<ItemType> {
    selection: ItemType | undefined;
    onSelectionChange: (selectedItem: ItemType | undefined) => void;
    onRender: (item: ItemType) => string;
    items: ItemType[];
}

export default function SearchInput<ItemType>(props: OwnProps<ItemType>) {
    const [results, setResults] = useState<ItemType[]>([]);

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

    function updateSearchFromSuggestion(focusedSuggestion: ItemType) {
        inputRef.current!.value = props.onRender(focusedSuggestion);
        setResults([]);
    }

    const inputRef = useRef<HTMLInputElement>(null);
    return (<div>
        <Input ref={inputRef}
            onKeyUp={handleQueryType}
            onChange={(e) => {
                const query = e.target.value;
                const results = props.items.filter((item) => query && props.onRender(item).toLowerCase().indexOf(query.toLowerCase()) !== -1);
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
                <FontAwesomeIcon icon={faAngleRight} /> {props.onRender(result)}
            </Box>)
        })}</Box>
    </div>);
}
