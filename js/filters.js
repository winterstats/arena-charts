import {createAndAppendElement} from "./utils.js";


const lineTypes = {
    "line": {"borderWidth": 2, "borderDash": [], "borderDashOffset": 0},
    "dash": {"borderWidth": 2, "borderDash": [15, 5], "borderDashOffset": 0},
    "dot": {"borderWidth": 2, "borderDash": [2, 3], "borderDashOffset": 0},
    "dashdot": {"borderWidth": 2, "borderDash": [5, 5, 1, 5], "borderDashOffset": 0},
}

export function createFilters(chart, data, container, filterData) {
    const filters = createAndAppendElement(container, "div", "filters", "row", "filter-box");
    for (const className in filterData) {
        const classColumn = createAndAppendElement(filters, "div", null, "col", "class-column");
        const classIcon = createAndAppendElement(classColumn, "div", null, "class-icon");
        const img = createAndAppendElement(classIcon, "img", null, null);
        img.src = `images/${className}.png`;
        const specs = Object.values(filterData[className]);
        img.addEventListener("click", () => toggleDisplayClass(chart, data, specs));
        for (const specName in filterData[className]) {
            const specId = filterData[className][specName];
            const specIcon = createAndAppendElement(
                classColumn, "div", `spec-${filterData[className][specName]}`, "spec-icon", "inactive");
            const img = createAndAppendElement(specIcon, "img", null, null);
            img.src = `images/${filterData[className][specName]}.png`;
            specIcon.style.borderColor = chart.data.datasets[specId].borderColor;
            img.addEventListener("click", () => toggleDisplaySpec(chart, data, specId));
        }
    }
}


/**
 * Toggles the visibility of all the specs of a class in the chart. If any are hidden, all are shown. If all are shown,
 * all are hidden.
 * @param chart - The chart to toggle the visibility of.
 * @param data - The data of the chart.
 * @param specs - The ids of the specs of the class.
 */
const toggleDisplayClass = (chart, data, specs) => {
    const areAllShowing = specs.every(spec => chart.isDatasetVisible(spec));
    for (const spec of specs)
        if (chart.isDatasetVisible(spec) === areAllShowing)
            toggleDisplaySpec(chart, data, spec);
}

/**
 * Toggles the visibility of a spec in the chart.
 * @param chart - The chart to toggle the visibility of.
 * @param data - The data of the chart.
 * @param specId The id of the spec to toggle
 */
const toggleDisplaySpec = (chart, data, specId) => {
    const isVisible = chart.isDatasetVisible(specId);
    updateFilterBorder(chart, data, specId, isVisible);
    chart.update();
    toggleVisibility(chart, specId, isVisible);
}

/**
 * Updates the border of the filter icons so each shown spec has a different border style.
 * @param chart - The chart to update the border of.
 * @param data - The data of the chart.
 * @param specId - The id of the spec to update the border of.
 * @param isVisible - Whether the spec is visible or not.
 */
const updateFilterBorder = (chart, data, specId, isVisible) => {
    let index = 0;
    // Find all the other specs of the same class.
    const cls = data["cls_lookup"][specId];
    const otherSpecIds = Object.values(data["filters"][cls]);
    // If the spec is visible, add a border and increment the index to the next border style.
    for (const otherSpecId of otherSpecIds) {
        if ((otherSpecId !== specId && chart.isDatasetVisible(otherSpecId)) || (otherSpecId === specId && !isVisible)) {
            addBorder(chart, otherSpecId, index)
            index++;
        }
        else {
            removeOtherBorderStyles(otherSpecId, index);
        }
    }
}

// Should updating the border and updating the chart line type be separate?
/**
 * Adds a specific border to the filter icon and updates the line type of the spec in the chart and removes
 * any other borders.
 * @param chart - The chart to update the line type of.
 * @param specId - The id of the spec to update the line type of.
 * @param index - The index of the border style to add.
 */
const addBorder = (chart, specId, index) => {
    const border = Object.keys(lineTypes)[index];
    // Update chart border
    Object.assign(chart.data.datasets[specId], Object.values(lineTypes)[index]);
    // Update legend border
    document.getElementById(`spec-${specId}`).classList.add(`border-${border}`);
    // Remove other borders
    for (const otherBorder in lineTypes)
        if (otherBorder !== border)
            document.getElementById(`spec-${specId}`).classList.remove(`border-${otherBorder}`);
}

/**
 * Removes all other border styles excluding the one at the given index.
 * @param specId - The id of the spec to remove the border from.
 * @param index - The index of the border style to remove.
 */
const removeOtherBorderStyles = (specId, index) => {
    const border = Object.keys(lineTypes)[index];
    for (const otherBorder in lineTypes) {
        if (otherBorder !== border) {
            document.getElementById(`spec-${specId}`).classList.remove(`border-${otherBorder}`);
        }
    }
}


/**
 * Toggles the visibility of a spec in the chart.
 * @param chart - The chart to toggle the visibility of.
 * @param specId - The id of the spec to toggle.
 * @param isVisible - Whether the spec is currently visible or not.
 */
const toggleVisibility = (chart, specId, isVisible) => {
    if (isVisible) {
        document.getElementById(`spec-${specId}`).classList.add("inactive");
        chart.hide(specId)
    } else {
        document.getElementById(`spec-${specId}`).classList.remove("inactive");
        chart.show(specId)
    }
}


export function createDataSelects(chart, data, container) {
    // Too hardcoded? Why not just a for loop three levels deep? Stop when it reaches object with 10+ keys?
    const regions = Object.keys(data.datasets);
    const timeframes = Object.keys(Object.values(data.datasets)[0]);
    const metrics = Object.keys(Object.values(Object.values(data.datasets)[0])[0]);
    console.log(regions[0])
    createSelect(chart, data, container, "region", regions);
    createSelect(chart, data, container, "timeframe", timeframes);
    createSelect(chart, data, container, "metric", metrics);
}

function createSelect(chart, data, container, category, labels) {
    const  select = createAndAppendElement(container, "select", `${category}-select`, "form-select");
    for (const label of labels) {
        const option = createAndAppendElement(select, "option", null, null);
        option.value = label;
        option.text = label;
    }
    select.addEventListener("change", () => changeChartState(chart, data, category, select.value));
}

function changeChartState(chart, data, stateType, value) {
    console.log(chart);
    chart.options.selectState[stateType] = value
    const activeStatus = Object.keys(data.cls_lookup).map(key => chart.isDatasetVisible(key));
    const region = chart.options.selectState.region;
    const timeframe = chart.options.selectState.timeframe;
    const metric = chart.options.selectState.metric;
    chart.data.datasets = data["datasets"][region][timeframe][metric];
    activeStatus.forEach((status, index) => {
        if (status)
            toggleDisplaySpec(chart, data, index);
    });
    chart.update();
}