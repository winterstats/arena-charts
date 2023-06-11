import {createAndAppendElement, createPattern, toTitleCase} from "../utils/utils.js";

export class DataSelector {
    /**
     * Creates a new DataSelector object.
     * @param {Object} datasets
     * @param {HTMLDivElement} container
     * @param {function} onDataSetChange
     */
    constructor(datasets, lookupData, container, onDataSetChange) {
        this.datasets = datasets;
        this.lookupData = lookupData;
        this.container = container;
        this.onDataSetChange = onDataSetChange;
        this.chartData =  {"labels": [], "datasets": []};
        this.selectors = [];
        this.selectorsOptions = {};
        this.selectorsStates = []
        this.initializeDataSelects();
        this.createDataSelectors();
        this.initializeDatasets();
    }

    /**
     * Changes the data set based on the selected options.
     */
    initializeDataSelects() {
        let index = 0;
        let datasetLayer = this.datasets;
        
        while (!("labels" in datasetLayer) && (index < 10)) {
            this.UpdateSelectorLabelsAndStates(datasetLayer, index);
            datasetLayer = datasetLayer[this.selectors[index]][this.selectorsStates[index]];
            index++;
        }
    }

    /**
     * Updates the selectors and states based on the dataset layer.
     * @param {Object} datasetLayer
     * @param {number} index
     * @constructor
     */
    UpdateSelectorLabelsAndStates(datasetLayer, index) {
        const category = Object.keys(datasetLayer)[0];
        const options = Object.keys(Object.values(datasetLayer)[0]);
        this.selectors[index] = category;
        this.selectorsStates[index] = options[0]
        this.selectorsOptions[category] = options;
    }

    /**
     * Creates the data selectors.
     */
    createDataSelectors() {
        this.selectors.forEach((category, i) => this.createDataSelector(category,  i));
    }

    /**
     * Creates a data selector.
     * @param {string} category
     * @param {number} index
     */
    createDataSelector(category, index) {
        const select = createAndAppendElement(this.container, "select", `${category}-select`, "form-select");
        this.createDataSelectorLabels(select, category);
        select.addEventListener("change", () => this.changeDataSelect(index, select.value));
    }

    /**
     * Creates the labels for the data selector.
     * @param {HTMLSelectElement} select
     * @param {string} category
     */
    createDataSelectorLabels(select, category) {
        const labels = this.selectorsOptions[category];
        for (const label of labels)
            this.createDataSelectorOption(select, label)
    }

    /**
     * Creates an option for the data selector.
     * @param {HTMLSelectElement} select
     * @param {string} label
     */
    createDataSelectorOption(select, label) {
        const option = createAndAppendElement(select, "option", null, null);
        option.value = label;
        option.text = label;
    }

    /**
     * Changes the data set based on the selected options.
     * @param {number} index
     * @param {string} value
     */
    changeDataSelect(index, value) {
        this.selectorsStates[index] = value;
        this.updateChartData();
        this.notifyDatasetChange();
    }

    updateChartData() {
        const dataset = this.getSelectedDataset();
        this.chartData["labels"] = dataset["labels"];
        for (const specId in this.chartData["datasets"]) {
            this.chartData["datasets"][specId]["data"] = dataset["data"][specId];
        }
    }

    /**
     * Notifies the chart that the dataset has changed.
     */
    notifyDatasetChange() {
        this.onDataSetChange(this.chartData);
    }

    /**
     * Returns the selected dataset.
     * @returns {Object}
     */
    getSelectedDataset() {
        let dataset = this.datasets;
        for (let i = 0; i < this.selectors.length; i++)
            dataset = dataset[this.selectors[i]][this.selectorsStates[i]];
        return dataset;
    }

    initializeDatasets() {
        for (const [specId, specInfo] of Object.entries(this.lookupData["specInfo"])) {
            const name = toTitleCase(`${specInfo["specName"]} ${specInfo["clsName"]}`);
            const classId = specInfo["clsId"];
            const color = this.lookupData["clsColors"][classId];
            this.chartData["datasets"][specId] = {
                "label": name, 
                "data": [],
                "borderColor": color,
                "backgroundColor": color,
                "hidden": true,
                "categoryPercentage": .9,
                "barPercentage": .9,
            };
        }
        this.updateChartData();
        this.notifyDatasetChange();
    }
}