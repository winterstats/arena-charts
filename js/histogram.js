import {fetchData} from "./data.js";
import {createChart} from "./chart.js";
import {createDataSelects, createFilters} from "./filters.js";
import {Legend} from "./components/legend.js";
import {DataSelector} from "./components/dataSelector";

let data;
let ctx;
let chartContainer;
let filterContainer;
let chart;
let legend;
let dataSelector;

function main() {
    ctx = document.getElementById('myChart');
    chartContainer = document.getElementById('chart-container');
    filterContainer = document.getElementById('filter-container');

    Promise.all([fetchData('data/data.json'), fetchData('data/static_data.json')])
        .then(([data, staticData]) => {
            chart = createChart(ctx, data["labels"], data["datasets"]);
            dataSelector = new DataSelector(staticData, chart.callback, filterContainer);
            legend = new Legend(staticData, chart, filterContainer, chart.callback);
        });
}
main();
