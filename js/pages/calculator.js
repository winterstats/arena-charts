import {fetchData} from "../services/dataService.js";
import {Calculator} from "../components/calculator.js";

let calculatorContainer;
let calculator;

function main() {
    calculatorContainer = document.getElementById('calculator');

    Promise.all([fetchData('data/history_data.json'), fetchData('data/static_data.json')])
        .then(([dataQuantile, staticData]) => {
            calculator = new Calculator(dataQuantile, staticData, calculatorContainer);
        });
}

main();
