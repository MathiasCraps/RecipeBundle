import React, { useState } from "react";
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
        {props.children}
    </span>
    </div>)
}