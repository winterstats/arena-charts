﻿export function createAndAppendElement(parent, tag, id, ...classes) {
    const element = document.createElement(tag);
    if (id) element.id = id;
    if (classes) element.classList.add(...classes);
    parent.appendChild(element);
    return element;
}