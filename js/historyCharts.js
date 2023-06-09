import {fetchData} from "./data.js";
import {createChart} from "./chart.js";
import {Legend} from "./components/legend.js";
import {CustomChart} from "./components/customChart";

let data;
let ctx;
let chartContainer;
let filterContainer;
let chart;
let legend;

function main() {
    ctx = document.getElementById('myChart');
    chartContainer = document.getElementById('chart-container');
    filterContainer = document.getElementById('filter-container');

    Promise.all([fetchData('data/data.json'), fetchData('data/static_data.json')])
        .then(([data, staticData]) => {
            chart = new CustomChart(ctx, data, staticData);
            legend = new Legend(staticData, filterContainer, chart.OnVisibilityChange);
        });
}
main();
