import {createAndAppendElement} from "../utils";

export class DataSelector {
    constructor(datasets, callback, container) {
        this.container = container;
        this.datasets = datasets;
        this.callback = callback;
        this.selectors = [];
        this.selectorsOptions = {};
        this.selectorsStates = []
        this.initializeDataSelects();
        this.createDataSelectors();
    }
    
    initializeDataSelects() {
        let index = 0;
        let datasetLayer = this.datasets;
        
        while (!("labels" in Object.keys(datasetLayer))) {
            this.UpdateSelectorLabelsAndStates(datasetLayer, index);
            datasetLayer = datasetLayer[this.selectors[index]][this.selectorsStates[index]];
            index++;
        }
    }

    UpdateSelectorLabelsAndStates(datasetLayer, index) {
        const category = Object.keys(datasetLayer)[0];
        const options = Object.values(datasetLayer)[0];

        this.selectors[index] = category;
        this.selectorsStates[index] = options[0]
        this.selectorsOptions[category] = options;
    }

    createDataSelectors() {
        this.selectors.forEach((category, i) => this.createDataSelector(category,  i));
    }
    
    createDataSelector(category, index) {
        const select = createAndAppendElement(this.container, "select", `${category}-select`, "form-select");
        this.createDataSelectorLabels(select, category);
        select.addEventListener("change", () => this.changeDataSelect(index, select.value));
    }
    
    createDataSelectorLabels(select, category) {
        const labels = this.selectorsOptions[category];
        for (const label of labels)
            this.createDataSelectorOption(select, label)
    }
    
    createDataSelectorOption(select, label) {
        const option = createAndAppendElement(select, "option", null, null);
        option.value = label;
        option.text = label;
    }
    
    changeDataSelect(index, value) {
        this.selectorsStates[index] = value;
        this.onDataSelectChange();
    }

    onDataSelectChange() {
        const dataset = this.getSelectedDataset();
        this.callback(dataset["labels"], dataset["data"], dataset["options"]);
    }

    getSelectedDataset() {
        let dataset = this.datasets;
        for (let i = 0; i < this.selectors.length; i++)
            dataset = dataset[this.selectors[i]][this.selectorsStates[i]];
        return dataset;
    }
}