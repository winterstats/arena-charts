import {createAndAppendElement, createForm, toTitleCase} from "../../utils/utils.js";

// Space between bars.
const CATEGORY_PERCENTAGE = .9;
const BAR_PERCENTAGE = .9;

export class DataSelector {
    /**
     * Creates a new DataSelector component which adds selectors for choosing datasets.
     * @param {Object} datasets - Object containing the all the datasets.
     * @param {Object} lookupData - The lookup data object containing ids, names, colors, etc.
     * @param {HTMLDivElement} container - The container the selectors will be appended to.
     * @param {function(Object)} onDataSetChange - The function that will be called when the dataset changes.
     */
    constructor(datasets, lookupData, container, onDataSetChange) {
        this.datasets = datasets;
        this.lookupData = lookupData;
        this.container = container;
        this.onDataSetChange = onDataSetChange;
        
        /** @type {{labels: string[], datasets: Object}} Object containing labels and data for each spec. */
        this.chartData =  {"labels": [], "datasets": []};
        /**  @type {string[]} The names of each of the categories. */
        this.selectors = [];
        /** @type {{string: string[]}} Object containing the options for each category. */
        this.selectorsOptions = {};
        /** @type {string[]} The current option selected for each selector category. */
        this.selectorsStates = []
        
        this.initializeDataSelectOptions();
        this.createDataSelectors();
        this.initializeDatasets();
    }

    /**
     * Find the different dataset categories and update their labels and the default states.
     */
    initializeDataSelectOptions() {
        let index = 0;
        let datasetLayer = this.datasets;
        const maxIterations = 10; // Protection against infinite loops if dataset is malformed.
        
        // Loop through each category of dataset until we find the labels which is where the data is.
        while (!("labels" in datasetLayer) && (index < maxIterations)) {
            this.UpdateSelectorLabelsAndStates(datasetLayer, index);
            datasetLayer = datasetLayer[this.selectors[index]][this.selectorsStates[index]];
            index++;
        }
    }

    /**
     * Updates the selector category, options and default state for the given layer.
     * @param {{string: Object}} datasetLayer - The layer of the dataset we are currently on by cate
     * @param {number} index - The depth of the category layers we are on.
     */
    UpdateSelectorLabelsAndStates(datasetLayer, index) {
        // Get the name of the category and the options for that category.
        const category = Object.keys(datasetLayer)[0];
        const options = Object.keys(Object.values(datasetLayer)[0]);
        
        this.selectors[index] = category;
        this.selectorsStates[index] = options[0]; // Default to the first option.
        this.selectorsOptions[category] = options;
    }

    /**
     * Creates the data selectors for each category.
     */
    createDataSelectors() {
        this.selectors.forEach((category, i) => this.createDataSelect(category,  i));
    }

    /**
     * Creates a data select element and attaches it to the HTML container.
     * @param {string} category - The name of the category for this data select.
     * @param {number} index - The index of the data selector.
     */
    createDataSelect(category, index) {
        const div = createAndAppendElement(this.container, "div", null, "col content-fit");
        const labels = this.selectorsOptions[category];
        const form = createForm(div, category, labels);
        form.addEventListener("change", (e) => this.changeDataSelect(index, e.target.value));
        // const select = createAndAppendElement(this.container, "select", `${category}-select`, "form-select");
        // this.createDataSelectOptions(select, category);
        // select.addEventListener("change", () => this.changeDataSelect(index, select.value));
    }

    /**
     * Creates and append the options for the data select.
     * @param {HTMLSelectElement} select - The select element to add options to.
     * @param {string} category - The name of the category for this data selector.
     */
    createDataSelectOptions(select, category) {
        const labels = this.selectorsOptions[category];
        for (const label of labels)
            this.createDataSelectOption(select, label)
    }

    /**
     * Create and append an option for the data select.
     * @param {HTMLSelectElement} select - The select element to add options to.
     * @param {string} label - The label for the option.
     */
    createDataSelectOption(select, label) {
        const option = createAndAppendElement(select, "option", null, null);
        option.value = label;
        option.text = label;
    }

    /**
     * Changes the data set based on the selected options.
     * @param {number} index - The index of the data select to change the value of.
     * @param {string} value - The value to change the data select to.
     */
    changeDataSelect(index, value) {
        console.log(index,  value);
        this.selectorsStates[index] = value;
        this.updateChartData();
        this.notifyDatasetChange();
    }

    /**
     * Updates the chart data with the data from the currently selected dataset.
     */
    updateChartData() {
        const dataset = this.getSelectedDataset();
        this.chartData["labels"] = dataset["labels"];
        for (const specId in this.chartData["datasets"]) {
            this.chartData["datasets"][specId]["data"] = dataset["data"][specId];
        }
    }

    // TODO: Better explain this.
    /**
     * Gathers the data from the currently selected dataset.
     * @returns {{string: object}} The selected dataset.
     */
    getSelectedDataset() {
        // Iterate through the dataset categories until we get to the selected dataset.
        let dataset = this.datasets;
        for (let i = 0; i < this.selectors.length; i++)
            dataset = dataset[this.selectors[i]][this.selectorsStates[i]];
        return dataset;
    }
    
    /**
     * Notifies the chart that the dataset has changed.
     */
    notifyDatasetChange() {
        this.onDataSetChange(this.chartData);
    }

    /**
     * Initializes the datasets for the chart.
     */
    initializeDatasets() {
        for (const [specId, specInfo] of Object.entries(this.lookupData["specInfo"])) {
            // Lookup full name ("Balance Druid"), classId and color associated with that classId.
            const name = toTitleCase(`${specInfo["specName"]} ${specInfo["clsName"]}`);
            const classId = specInfo["clsId"];
            const color = this.lookupData["clsColors"][classId];
            
            this.initializeDatasetForSpec(specId, name, color);
        }
        this.updateChartData();
        this.notifyDatasetChange();
    }

    /**
     * Initializes the dataset for a specific spec.
     * @param {number} specId - The id of the spec.
     * @param {string} name - The full name of the class/spec.
     * @param {string} color - The color associated with the class in hex format.
     */
    initializeDatasetForSpec(specId, name, color) {
        this.chartData["datasets"][specId] = {
            "label": name,
            "data": [],
            "borderColor": color,
            "backgroundColor": color,
            "hidden": true,
            "categoryPercentage": CATEGORY_PERCENTAGE,
            "barPercentage": BAR_PERCENTAGE,
            "pointStyle": false,
        };
    }
}