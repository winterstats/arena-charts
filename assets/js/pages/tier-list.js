import {fetchJson} from "../services/data-service.js";
import {TierList} from "../components/tier-list.js";


function main() {
    const container = document.getElementById("tier-list-container");
    fetchJson('assets/data/tier-lists/tierlist-data.json').then(json_data => {
        let tierList = new TierList(json_data, container);
    });
}

main();