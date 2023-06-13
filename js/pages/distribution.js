import {fetchData} from "../services/dataService.js";
import {Legend} from "../components/legend.js";
import {DataSelector} from "../components/dataSelector.js";
import {CustomChart} from "../components/customChart.js";

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

    Promise.all([fetchData('data/distribution_data.json'), fetchData('data/static_data.json')])
        .then(([dataDistribution, staticData]) => {
            chart = new CustomChart(ctx, "line", 1);
            dataSelector = new DataSelector(dataDistribution, staticData, filterContainer, chart.onDatasetChange);
            legend = new Legend(staticData, filterContainer, chart.onVisibilityChange);
        });
}

main();
