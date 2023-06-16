import {fetchJson} from "../services/data-service.js";

let calculatorContainer;
let staticData;
let dataQuantile;

function addSpecOptions(staticData) {
    const specSelect = document.getElementById('spec-select');
    Object.entries(staticData["specInfo"]).forEach(([specId, specDetails]) => {
        const option = document.createElement('option');
        option.value = specId;
        option.text = `${specDetails["clsName"]} - ${specDetails["specName"]}`;
        specSelect.appendChild(option); 
    });
}

function hookUpButton() {
    document.getElementById("calculate").addEventListener("click", () => calculate());
}

function calculate() {
    const percentile = convertRatingToPercentile();
    const percentileDisplay = document.getElementById('results');
    percentileDisplay.innerHTML = `You are higher than ${(percentile * 100).toFixed(2)}% of players of your spec.`;
}

function convertRatingToPercentile() {
    const region = document.getElementById('region-select').value;
    const rating = document.getElementById('rating').value;
    const specId = document.getElementById('spec-select').value;
    const specData = dataQuantile[region][specId];
    const percentiles = specData[0];
    const ratings = specData[1];
    
    if (rating < ratings[0]) return 0;
    if (rating > ratings[ratings.length - 1]) return 1;
    
    const lowerBound = ratings.find(r => r >= rating);
    const lowerBoundIndex = ratings.indexOf(lowerBound);
    const upperBoundIndex = lowerBoundIndex + 1;
    const upperBound = ratings[upperBoundIndex];

    const lowerBoundPercentile = percentiles[lowerBoundIndex];
    const upperBoundPercentile = percentiles[upperBoundIndex];

    const ratingDifferencePercent = (rating - lowerBound) / (upperBound - lowerBound);
    const percentileDifference = upperBoundPercentile - lowerBoundPercentile;
    return lowerBoundPercentile + (ratingDifferencePercent * percentileDifference);
}

function main() {
    calculatorContainer = document.getElementById('calculator');

    Promise.all([fetchJson('assets/data/calculator/quantile-data.json'), fetchJson('assets/data/static/static-data.json')])
        .then(([dataQuantile_, staticData_]) => {
            dataQuantile = dataQuantile_;
            staticData = staticData_;
            addSpecOptions(staticData_);
            hookUpButton();
        });
}

main();
