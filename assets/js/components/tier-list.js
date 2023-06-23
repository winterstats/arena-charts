import {createAndAppendElement} from "../utils/utils.js";


export class TierList {
    constructor(data, container) {
        this.data = data;
        this.container = container;
        
        this.region = "us";
        this.sample = "average"
        
        this.setupButtons();
        this.createTierLists();
    }
    
    setupButtons() {
        const regionButton = document.getElementById("region-select");
        const sampleButton = document.getElementById("sample-select");
        regionButton.addEventListener("change", (event) => this.onRegionChange(event.target.value));
        sampleButton.addEventListener("change", (event) => this.onSampleChange(event.target.value));
    }
    
    onRegionChange(region) {
        this.region = region;
        this.createTierLists();
    }
    
    onSampleChange(sample) {
        this.sample = sample;
        this.createTierLists();
    }
    
    
    createTierLists() {
        const data = this.data[this.region][this.sample];
        this.container.innerHTML = "";
        const roleTierListRow = createAndAppendElement(this.container, "div", null, "row", "tier-list-row");
        for (const role in data) {
            const roleTierList = createAndAppendElement(roleTierListRow, "div", `${role}-tier-list`, "col-6", "tier-list-column")
            const tierListTitle = createAndAppendElement(roleTierList, "div", null, "row", "tier-list-title");
            tierListTitle.innerText = `${role[0].toUpperCase() + role.slice(1)} Tier List`;
            for (const tier in data[role]) {
                const tierRow = createAndAppendElement(roleTierList, "div", null, `${tier.toLowerCase()}-tier`, "row", "tier-row");
                const nameColumn = createAndAppendElement(tierRow, "div", null, "col-1", "align", "tier-letter");
                nameColumn.innerText = tier;
                const classColumn = createAndAppendElement(tierRow, "div", null, "col", "class-list");
                const classRow = createAndAppendElement(classColumn, "div", null, "row", "align-left");
                for (const entry in data[role][tier]) {
                    const specId = data[role][tier][entry][0];
                    const specName = data[role][tier][entry][1];
                    const img = createAndAppendElement(classRow, "img", null, "class-box");
                    img.src = `assets/images/${specId}.png`;
                    img.alt = specName;
                }
            }
        }
    }
}