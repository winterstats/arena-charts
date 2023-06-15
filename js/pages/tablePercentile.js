﻿import {fetchData} from "../services/dataService.js";
import {Table} from "../components/table.js";

let data;
let table;

function main() {
    const container = document.getElementById("table-container");
    fetchData('data/table_percentile_data.json').then(json_data => {
        data = json_data;
        table = new Table(data, container);
    });
}

main();
