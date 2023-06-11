export function fetchData(jsonFile){
    return fetch(jsonFile)
        .then(response => response.json())
        .then(json_data => {
            return json_data;
        })
        .catch(error => console.error('Error fetching data:', error));
}

export function createAndAppendElement(parent, tag, id, ...classes) {
    const element = document.createElement(tag);
    if (id) element.id = id;
    if (classes) element.classList.add(...classes);
    parent.appendChild(element);
    return element;
}
export function createImage(parent, src) {
    const img = createAndAppendElement(parent, "img", null, null);
    img.src = src;
    return img;
}

export function toTitleCase(text) {
    return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

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

function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}