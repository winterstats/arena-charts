import {createAndAppendElement} from "../utils/utils.js";
import {fetchData} from "../services/dataService.js";

let data;

export function createTierLists(data, container,) {
    const roleTierListRow = createAndAppendElement(container, "div", null, "row", "tier-list-row");
    for (const role in data) {
        const roleTierList = createAndAppendElement(roleTierListRow, "div", `${role}-tier-list`, "col-4", "tier-list-column")
        const tierListTitle = createAndAppendElement(roleTierList, "div", null, "row", "tier-list-title");
        tierListTitle.innerText = `${role[0].toUpperCase() + role.slice(1)} Tier List`;
        for (const tier in data[role]) {
            const tierRow = createAndAppendElement(roleTierList, "div", null, `${tier.toLowerCase()}-tier`, "row", "tier-row");
            const nameColumn = createAndAppendElement(tierRow, "div", null, "col-1", "align", "tier-letter");
            nameColumn.innerText = tier;
            const classColumn = createAndAppendElement(tierRow, "div", null, "col", "class-list");
            const classRow = createAndAppendElement(classColumn, "div", null, "row", "align-left");
            for (const entry in data[role][tier]) {
                const specId = data[role][tier][entry][0];
                const specName = data[role][tier][entry][1];
                const img = createAndAppendElement(classRow, "img", null, "class-box");
                img.src = `images/${specId}.png`;
                img.alt = specName;
            }
        }
    }
}

function main() {
    const container = document.getElementById("tier-list-container");
    fetchData('data/tierlist_data.json').then(json_data => {
        data = json_data;
        createTierLists(json_data, container);
    });
}

main();