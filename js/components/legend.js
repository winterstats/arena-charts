import {createAndAppendElement, createImage} from "../utils.js";

export class Legend {
    /**
     * Creates a new Legend object.
     * @param {object} lookupData
     * @param {HTMLElement} container
     * @param {function} onVisibilityChange
     */
    constructor(lookupData, container, onVisibilityChange) {
        this.lookupData = lookupData;
        this.container = container;
        this.onVisibilityChange = onVisibilityChange
        this.isVisibleStates = Array(38).fill(false);
        this.borderStyleStates = Array(38).fill("line");
        this.specIconElementsById = []
        this.borderStyles = ["line", "dash", "dot", "dashdot"];
        this.createLegend();
    }

    /**
     * Creates the legend.
     */
    createLegend() {
        const filters = createAndAppendElement(this.container, "div", "filters", "row", "filter-box");
        for (const classId in this.lookupData["clsIds"]) {
            const classColumn = createAndAppendElement(filters, "div", null, "col", "class-column");
            this.createClassIcon(classColumn, classId);
            this.createSpecIcons(classColumn, classId);
        }
    }

    /**
     * Creates class icon element and adds it to the legend.
     * @param {HTMLElement} classColumn
     * @param {number} classId
     */
    createClassIcon(classColumn, classId) {
        const classIcon = createAndAppendElement(classColumn, "div", null, "class-icon");
        const img = createImage(classIcon, `images/${this.lookupData["clsIds"][classId]}.png`);
        img.addEventListener("click", () => this.toggleClass(classId));
    }

    /**
     * Creates spec icons for a class.
     * @param {HTMLElement} classColumn
     * @param {number} classId
     */
    createSpecIcons(classColumn, classId) {
        for (const specId of this.lookupData["clsSpecLists"][classId])
            this.createSpecIcon(classColumn, specId, classId);
    }

    /**
     * Create spec icon element and add it to the legend.
     * @param {HTMLElement} classColumn
     * @param {number} specId
     * @param {number} classId
     */
    createSpecIcon(classColumn, specId, classId) {
        const specIcon = createAndAppendElement(classColumn, "div", `spec-${specId}`, "spec-icon", "inactive");
        specIcon.style.borderColor = this.lookupData["clsColors"][classId];
        const img = createImage(specIcon, `images/${specId}.png`);
        this.specIconElementsById[specId] = img;
        img.addEventListener("click", () => this.toggleSpec(specId));
    }
    
    /**
     * Toggles the visibility of all the specs of a class in the chart. If any are hidden, all are shown. If all are shown,
     * all are hidden.
     * @param {number} classId - The id of the class to toggle the visibility of.
     */
    toggleClass(classId) {
        const specIds = this.lookupData["clsSpecLists"][classId];
        const allVisible = specIds.every(specId => this.isVisibleStates[specId]);
        for (const specId of specIds)
            if (this.isVisibleStates[specId] === allVisible)
                this.toggleSpec(specId);
    }

    /**
     * Toggles the visibility of a spec in the chart.
     * @param {number} specId - The id of the spec to toggle.
     */
    toggleSpec(specId) {
        this.isVisibleStates[specId] = !this.isVisibleStates[specId];
        this.updateBorder(specId);
        this.updateElementVisibility(specId);
        this.notifyVisibilityChange(specId)
    }

    /**
     * Updates the border style of all the specs of a class.
     * @param {number} specId
     */
    updateBorder(specId) {
        // Find all specs of the given class.
        const classId = this.lookupData["specInfo"][specId]["clsId"];
        const specIds = this.lookupData["clsSpecLists"][classId];
        
        // Assign a different border style to each visible class.
        let index = 0;
        for (const specId of specIds) {
            const element = this.specIconElementsById[specId];
            this.removeBorders(specId, element);
            if (this.isVisibleStates[specId]) {
                this.addBorder(specId, element, index);
                index++;
            }
        }
    }

    /**
     * Removes all border styles from a spec.
     * @param {number} specId
     * @param {HTMLElement} element
     */
    removeBorders(specId, element) {
        for (const border of this.borderStyles)
            element.classList.remove(`border-${border}`);
    }

    /**
     * Adds a border style to a spec.
     * @param {number} specId
     * @param {HTMLElement} element
     * @param {number} index
     */
    addBorder(specId, element, index) {
        const border = this.borderStyleStates[index];
        element.classList.add(`border-${border}`)
    }

    /**
     * Updates the visibility of a spec by adding or removing the inactive class.
     * @param {number} specId
     */
    updateElementVisibility(specId) {
        const element = this.specIconElementsById[specId]
        if (this.isVisibleStates[specId])
            element.classList.remove("inactive");
        else
            element.classList.add("inactive");
    }

    /**
     * Notifies the chart that the visibility of a spec has changed.
     * @param {number} specId
     */
    notifyVisibilityChange(specId) {
        const borderStyle = this.borderStyleStates[specId];
        const visibleState = this.isVisibleStates[specId];
        this.onVisibilityChange(specId, visibleState, borderStyle)
    }
}