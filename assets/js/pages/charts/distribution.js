﻿import {fetchJson} from "../../services/dataService.js";
import {Legend} from "../../components/charts/legend.js";
import {DataSelector} from "../../components/charts/dataSelector.js";
import {CustomChart} from "../../components/charts/customChart.js";

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

    Promise.all([fetchJson('assets/data/charts/distribution_data.json'), fetchJson('assets/data/static/static_data.json')])
        .then(([dataDistribution, staticData]) => {
            chart = new CustomChart(ctx, "line", 1);
            dataSelector = new DataSelector(dataDistribution, staticData, filterContainer, chart.onDatasetChange);
            legend = new Legend(staticData, filterContainer, chart.onVisibilityChange);
        });
}

main();
