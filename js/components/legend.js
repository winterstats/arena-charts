import {createAndAppendElement} from "../utils.js";

export class Legend {
    constructor(lookupData, container, callback, multi) {
        this.lookupData = lookupData;
        this.container = container;
        this.multi = multi;
        this.callback = callback
        this.isVisibleStates = Array(38).fill(false);
        this.borderStyleStates = Array(38).fill("line");
        this.borderStyles = ["line", "dash", "dot", "dashdot"];
        this.createLegend();
    }

    createLegend() {
        const filters = createAndAppendElement(this.container, "div", "filters", "row", "filter-box");
        for (const classId in this.lookupData["clsIds"]) {
            const classColumn = createAndAppendElement(filters, "div", null, "col", "class-column");
            this.createClassIcon(classColumn, classId);
            for (const specId of this.lookupData["clsSpecLists"][classId])
                this.createSpecIcon(classColumn, specId, classId);
        }
    }

    createClassIcon(classColumn, classId) {
        const classIcon = createAndAppendElement(classColumn, "div", null, "class-icon");
        const img = createAndAppendElement(classIcon, "img", null, null);
        img.src = `images/${this.lookupData["clsIds"][classId]}.png`;
        img.addEventListener("click", () => this.toggleClass(classId));
    }

    createSpecIcon(classColumn, specId, classId) {
        const specIcon = createAndAppendElement(classColumn, "div", `spec-${specId}`, "spec-icon", "inactive");
        const img = createAndAppendElement(specIcon, "img", null, null);
        img.src = `images/${specId}.png`;
        specIcon.style.borderColor = this.lookupData["clsColors"][classId];
        img.addEventListener("click", () => this.toggleSpec(specId));
    }

    /**
     * Toggles the visibility of all the specs of a class in the chart. If any are hidden, all are shown. If all are shown,
     * all are hidden.
     * @param classId - The id of the class to toggle the visibility of.
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
     * @param specId - The id of the spec to toggle.
     */
    toggleSpec(specId) {
        this.isVisibleStates[specId] = !this.isVisibleStates[specId];
        this.updateBorder(specId);
        this.updateElementVisibility(specId);
        this.onVisibilityChange(specId)
    }

    updateBorder(specId) {
        // Find all specs of the given class.
        const classId = this.lookupData["specInfo"][specId]["clsId"];
        const specIds = this.lookupData["clsSpecLists"][classId];
        // Assign a border style to each visible class.
        let index = 0;
        for (const specId of specIds) {
            const element = document.getElementById(`spec-${specId}`);
            this.removeBorders(specId, element);
            if (this.isVisibleStates[specId]) {
                this.addBorder(specId, element, index);
                index++;
            }
        }
    }

    removeBorders(specId, element) {
        for (const border of this.borderStyles)
            element.classList.remove(`border-${border}`);
    }

    addBorder(specId, element, index) {
        const border = this.borderStyleStates[index];
        element.classList.add(`border-${border}`)
    }

    updateElementVisibility(specId) {
        const element = document.getElementById(`spec-${specId}`);
        if (this.isVisibleStates[specId])
            element.classList.remove("inactive");
        else
            element.classList.add("inactive");
    }
    
    onVisibilityChange(specId) {
        const borderStyle = this.borderStyleStates[specId];
        this.callback(specId, borderStyle)
    }
}