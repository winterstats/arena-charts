import {createAndAppendElement} from "../utils/utils.js";

export class Calculator {
    constructor(data, lookupData, container) {
        this.data = data;
        this.lookupData = lookupData;
        this.container = container;
        
        this.regionSelect = null;
        this.classSelect = null;
        this.specSelect = createAndAppendElement(this.container, "select", "spec-select");
        this.ratingInput = null;
        
        this.createCalculator();
    }
    
    createCalculator() {
        this.createSelects();
        this.createRatingInput();
        this.createCalculateButton();
    }
    
    createSelects() {
        this.createRegionSelect();
        this.createClassSelect();
        this.createSpecSelect();
    }
    
    createRegionSelect() {
        this.regionSelect = createAndAppendElement(this.container, "select", "region-select");
        for (const region of ["us", "eu"]) {
            const option = createAndAppendElement(this.regionSelect, "option");
            option.value = region;
            option.text = region;
        }
    }
    
    createClassSelect() {
        this.classSelect = createAndAppendElement(this.container, "select", "class-select");
        Object.entries(this.lookupData["clsIds"]).forEach(([classId, className]) => {
            const option = createAndAppendElement(this.classSelect, "option");
            option.value = classId;
            option.text = className;
        });
        this.classSelect.addEventListener("change", () => this.createSpecSelect());
    }
    
    createSpecSelect() {
        this.specSelect.innerHTML = "";
        this.specSelect = createAndAppendElement(this.container, "select", "spec-select");
        const specs = this.lookupData["clsSpecLists"][this.classSelect.value];
        for (const specId of specs) {
            const option = createAndAppendElement(this.specSelect, "option");
            option.value = specId;
            option.text = this.lookupData["specInfo"][specId]["specName"];
        }
    }
    
    createRatingInput() {
        this.ratingInput = createAndAppendElement(this.container, "input", "rating-input");
        this.ratingInput.type = "number";
        this.ratingInput.min = 0;
        this.ratingInput.max = 4000;
    }
    
    createCalculateButton() {
        const button = createAndAppendElement(this.container, "button", "calculate-button");
        button.text = "Calculate";
        button.addEventListener("click", () => {
            const rating = this.ratingInput.value;
            const specId = this.specSelect.value;
            const percentile = this.convertRatingToPercentile(rating, specId);
            console.log(percentile);
        });
    }
    
    convertRatingToPercentile() {
        console.log(this.regionSelect.value, this.specSelect.value, this.ratingInput.value);
        const rating = this.ratingInput.value;
        const specData = this.data[this.regionSelect.value][this.specSelect.value];
        const percentiles = specData[0];
        const ratings = specData[1];
        const lowerBound = ratings.find(r => r >= rating);
        const lowerBoundIndex = ratings.indexOf(lowerBound);
        const upperBoundIndex = lowerBoundIndex + 1;
        const upperBound = ratings[upperBoundIndex];
        
        const lowerBoundPercentile = percentiles[lowerBoundIndex];
        const upperBoundPercentile = percentiles[upperBoundIndex];
        
        const ratingDifferencePercent = (rating - lowerBound) / (upperBound - lowerBound);
        const percentileDifference = upperBoundPercentile - lowerBoundPercentile;
        return lowerBoundPercentile + (ratingDifferencePercent * percentileDifference);
    }
    
    convertPercentToRatingile(percent, specId) {
    }
}