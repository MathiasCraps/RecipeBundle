import { Box, Input } from "@chakra-ui/react";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { KeyboardEvent, useState } from "react";
import { Localisation } from '../../../localisation/AppTexts';
import './SearchInput.scss';

interface OwnProps<ItemType> {
    selection: ItemType | undefined;
    inputRef: React.RefObject<HTMLInputElement>;
    onSelectionChange: (selectedItem: ItemType | undefined) => void;
    onRender: (item: ItemType) => string;
    items: ItemType[];
    defaultValue: string | undefined;
    renderResults: boolean;
    disabled?: boolean;
    label: string;
}

export default function SearchInput<ItemType>(props: OwnProps<ItemType>) {
    const [results, setResults] = useState<ItemType[]>([]);
    const [inputValue, setInputValue] = useState(props.defaultValue || '');
    const [selectedValue, setSelectedValue] = useState<ItemType>();
    const [isHovering, setIsHovering] = useState(false);
    const inputRef = props.inputRef;

    function handleQueryType(event: KeyboardEvent<HTMLInputElement>) {
        if (!results.length) {
            return;
        }

        const currentIndex = selectedValue ? results.indexOf(selectedValue) : 0;
        if (event.code === 'ArrowUp' && currentIndex !== 0) {
            event.preventDefault();
            setSelectedValue(results[currentIndex - 1]);
            return;
        } else if (event.code === 'ArrowDown' && currentIndex < results.length - 1) {
            event.preventDefault();
            setSelectedValue(results[currentIndex + 1]);
            return
        }

        if (results.length === 1) {
            setSelectedValue(results[0]);
        }

        if (selectedValue && (event.code === 'Enter' || event.code === 'NumpadEnter')) {
            updateSearchFromSuggestion(selectedValue);
            props.onSelectionChange(selectedValue)
        }
    }

    function updateSearchFromSuggestion(focusedSuggestion: ItemType) {
        setInputValue(props.onRender(focusedSuggestion));
        setResults([]);
    }

    return (<div>
        <label>{props.label}<br/>
        <Input ref={inputRef}
            onKeyUp={handleQueryType}
            onChange={(e) => {
                const query = e.target.value;
                const results = props.items.filter((item) => query && props.onRender(item).toLowerCase().indexOf(query.toLowerCase()) !== -1);
                setInputValue(query);
                setResults(results);
            }}
            value={inputValue}
            placeholder={Localisation.DO_SEARCH}
            disabled={props.disabled || false} />
        </label>
        {(props.renderResults || isHovering) && <Box
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >{results.map((result, index) => {
            const isActive = selectedValue === result;
            return (<Box className={`search-result ${isActive ? 'active' : ''}`}
                onClick={() => {
                    props.onSelectionChange(result);
                    updateSearchFromSuggestion(result);
                    inputRef.current!.focus(); // always keep your focus
                }}
                onMouseEnter={() => setSelectedValue(result)}
                key={index}>
                <FontAwesomeIcon icon={faAngleRight} /> {props.onRender(result)}
            </Box>)
        })}</Box>}
    </div>);
}
