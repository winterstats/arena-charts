import {fetchData} from "./data.js";
import {createChart} from "./chart.js";
import {createDataSelects, createFilters} from "./filters.js";

let data;
let ctx;
let chartContainer;
let filterContainer;
let chart;

function main() {
    ctx = document.getElementById('myChart');
    chartContainer = document.getElementById('chart-container');
    filterContainer = document.getElementById('filter-container');
    fetchData('data/data.json').then(json_data => {
        data = json_data;
        chart = createChart(
            ctx, data["labels"], data["datasets"]);
        createFilters(chart, data, filterContainer, data["filters"]);
        createDataSelects(chart, data, chartContainer);
    });
}

main();
