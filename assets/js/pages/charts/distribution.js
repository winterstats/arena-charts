import {fetchJson} from "../../services/data-service.js";
import {Legend} from "../../components/charts/legend.js";
import {DataSelector} from "../../components/charts/data-selector.js";
import {CustomChart} from "../../components/charts/custom-chart.js";

let ctx;
let chartContainer;
let categoryContainer;
let filterContainer;
let chart;
let legend;
let dataSelector;

function main() {
    ctx = document.getElementById('myChart');
    chartContainer = document.getElementById('chart-container');
    categoryContainer = document.getElementById('category-container');
    filterContainer = document.getElementById('filter-container');

    Promise.all([fetchJson('assets/data/charts/distribution-data.json'), fetchJson('assets/data/static/static-data.json')])
        .then(([dataDistribution, staticData]) => {
            chart = new CustomChart(ctx, "line", 1);
            dataSelector = new DataSelector(dataDistribution, staticData, categoryContainer, chart.onDatasetChange);
            legend = new Legend(staticData, filterContainer, chart.onVisibilityChange);
        });
}

main();
