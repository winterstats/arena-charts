/**
 * Create an element with the given tag/id/classes and append it to the given parent.
 * @param {HTMLElement} parent - The parent element to append the new element to.
 * @param {string} tag - HTML tag of the element to create.
 * @param {string} id - ID of the element to create.
 * @param {string[]} classes - Classes of the element to create.
 * @returns {HTMLElement} - The newly created element.
 */
export function createAndAppendElement(parent, tag, id, ...classes) {
    const element = document.createElement(tag);
    if (id) element.id = id;
    if (classes) element.classList.add(...classes);
    parent.appendChild(element);
    return element;
}

/**
 * Create an img element with the given src and append it to the given parent.
 * @param {HTMLElement} parent - The parent element to append the new element to.
 * @param {string} src - The path to the image.
 * @returns {HTMLImageElement} - The newly created image element.
 */
export function createImage(parent, src) {
    const img = createAndAppendElement(parent, "img", null, null);
    img.src = src;
    return img;
}

/**
 * Returns the text with the first letter of each word capitalized.
 * @param text - The text to convert.
 * @returns {string} - The converted text.
 */
export function toTitleCase(text) {
    return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Creates a repeating striped background of the given color and style.
 * @param {string} color - Color of the pattern in hex format.
 * @param {string} style - The style of the pattern. Can be "line", "dash", "dot", or "dashdot".
 * @returns {CanvasPattern}
 */
export function createPattern(color, style) {
    let multiplier;
    if (style === "line") {
        return color;
    } else if (style === "dash") {
        multiplier = 20;
    } else if (style === "dot") {
        multiplier = 8;
    } else if (style === "dashdot") {
        multiplier = 4;
    }
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');
    
    const color2 = hexToRGBA(color, 0.9);
    
    const width = 1;
    const height = 20;
    const stripeHeight = multiplier;
    tempCanvas.width = width;
    tempCanvas.height = stripeHeight * 2;
    // slightly transparent blue
    // slightly transparent blue
    tempContext.fillStyle = color2;
    tempContext.fillRect(0, 0, width, height);
    tempContext.fillStyle = color; // Replace 'color2' with the second color for the stripes
    tempContext.fillRect(0, stripeHeight, width, height);
    
    return tempContext.createPattern(tempCanvas, "repeat");
}

/**
 * Converts a hex color to an rgba color.
 * @param {string} hex - The hex color to convert in the form #FFFFFF.
 * @param {number} alpha - The transparency value (0-1).
 * @returns {string} - The rgba color in the form "rgba(255, 255, 255, 1)".
 */
function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}