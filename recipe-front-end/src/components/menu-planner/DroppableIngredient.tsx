import { Tooltip } from "@chakra-ui/react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { Localisation } from "../../localisation/AppTexts";
import { DayMenu } from "../../redux/Store";

interface OwnProps {
    menu: DayMenu;
    children: React.ReactNode;
}

export function DroppableMenuItem(props: OwnProps) {
    const [isDragging, setIsDragging] = useState(false);
    const extraClasses = isDragging ? 'is-dragging' : ''

    return (<div><span className={`day-menu-item ${extraClasses}`}
        draggable
        onDragStart={(event) => {
            setIsDragging(true);
            event.dataTransfer.setData('menuId', String(props.menu.menuId))
        }}
        onDragEnd={() => setIsDragging(false)}>
        {props.menu.recipe.title}
        <Tooltip label={Localisation.REMOVE}>
            {props.children}
        </Tooltip>
    </span>
    </div>)
}