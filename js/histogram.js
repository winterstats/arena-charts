import {fetchData} from "./data.js";
import {Legend} from "./components/legend.js";
import {DataSelector} from "./components/dataSelector.js";
import {CustomChart} from "./components/customChart.js";

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

    Promise.all([fetchData('data/data_history.json'), fetchData('data/static_data.json')])
        .then(([dataHistory, staticData]) => {
            chart = new CustomChart(ctx, null);
            dataSelector = new DataSelector(dataHistory, staticData, filterContainer, chart.onDatasetChange);
            legend = new Legend(staticData, filterContainer, chart.onVisibilityChange);
        });
}
main();
