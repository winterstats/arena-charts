import {fetchJson} from "../../services/data-service.js";
import {Table} from "../../components/table.js";

let data;
let table;

function main() {
    const container = document.getElementById("table-container");
    Promise.all([fetchJson('assets/data/tables/table-overview-data.json'), fetchJson('assets/data/static/static-data.json')])
        .then(([tableData, staticData]) => {
        table = new Table(tableData, staticData, container);
    });
}

main();
