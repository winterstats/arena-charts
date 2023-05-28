import {createAndAppendElement} from "./utils.js";



export function createFilters(data, container,) {
    for (const role in data) {
        const roleTierListRow = createAndAppendElement(container, "div", null, "row", "flex");
        const roleTierList = createAndAppendElement(roleTierListRow, "div", `${role}-tier-list`, "col-6")
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

const data = {"healer": {"S": [[18, "Mistweaver Monk"]], "A": [[23, "Discipline Priest"], [31, "Restoration Shaman"], [24, "Holy Priest"]], "B": [[8, "Restoration Druid"]], "C": [[10, "Preservation Evoker"], [20, "Holy Paladin"]]}, "damage": {"S": [[33, "Demonology Warlock"]], "A": [[25, "Shadow Priest"], [13, "Survival Hunter"], [5, "Balance Druid"], [34, "Destruction Warlock"], [29, "Elemental Shaman"]], "B": [[19, "Windwalker Monk"], [15, "Fire Mage"], [30, "Enhancement Shaman"], [22, "Retribution Paladin"], [36, "Fury Warrior"], [9, "Devastation Evoker"]], "C": [[3, "Havoc Demonhunter"], [11, "Beastmastery Hunter"], [32, "Affliction Warlock"], [2, "Unholy Deathknight"], [28, "Subtlety Rogue"], [35, "Arms Warrior"]], "D": [[1, "Frost Deathknight"], [6, "Feral Druid"], [14, "Arcane Mage"], [16, "Frost Mage"]], "F": [[26, "Assassination Rogue"], [12, "Marksmanship Hunter"], [27, "Outlaw Rogue"]]}}
const container = document.getElementById("tier-list-container");

createFilters(data, container);