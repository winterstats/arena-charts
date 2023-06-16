import {fetchJson} from "../../services/data-service.js";
import {Table} from "../../components/table.js";

let data;
let table;

function main() {
    const container = document.getElementById("table-container");
    fetchJson('assets/data/tables/table-overview-data.json').then(json_data => {
        data = json_data;
        table = new Table(data, container);
    });
}

main();
