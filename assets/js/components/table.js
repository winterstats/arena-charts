import {createAndAppendElement} from "../utils/utils.js";

const IGNORE_COLUMNS = ["Class", "Spec"]

export class Table {
    constructor(data, lookupData, container) {
        this.data = data;
        this.lookupData = lookupData
        this.container = container;

        /** @type {HTMLTableElement} */
        this.table = null;
        /** @type {HTMLTableElement} */
        this.colGroup = null;
        /** @type {HTMLTableColElement[]} */
        this.cols = [];
        /** @type {HTMLTableElement} */
        this.thead = null;
        /** @type {HTMLTableElement} */
        this.tbody = null;
        
        this.sortedColumn = 2;
        this.reverse = false;
        
        this.region = "us";
        this.roles = ["1", "2", "3"];
        
        this.setupButtons();
        this.createTable();
        this.sortTable(this.sortedColumn);
    }
    
    setupButtons() {
        const regionButton = document.getElementById("region-select");
        const roleButtons = document.getElementById("role-select");
        regionButton.addEventListener("change", (event) => this.onRegionChange(event.target.value));
        roleButtons.addEventListener("change", (event) => this.onRoleChange(event.target.value, event.target.checked));
    }
    
    onRegionChange(region) {
        this.region = region;
        this.createTableBody();
        this.reverse = false;
        this.sortTable(this.sortedColumn);
    }
    
    onRoleChange(role, checked) {
        if (checked)
            this.roles.push(role);
        else
            this.roles.splice(this.roles.indexOf(role), 1);
        this.createTableBody();
        this.reverse = !this.reverse
        this.sortTable(this.sortedColumn);
    }
    
    createTable() {
        this.table = createAndAppendElement(this.container, "table", null, "table-striped");
        this.createTableColGroup();
        this.createTableHead();
        this.createTableBody();
    }
    
    createTableColGroup() {
        this.colGroup = createAndAppendElement(this.table, "colgroup");
        for (const head of this.data["head"])
            this.cols.push(createAndAppendElement(this.colGroup, "col"));
    }
    
    createTableHead() {
        this.thead = createAndAppendElement(this.table, "thead");
        const tr = createAndAppendElement(this.thead, "tr");
        for (const head of this.data["head"]) {
            const th = createAndAppendElement(tr, "th");
            if (IGNORE_COLUMNS.includes(head)) {
                th.classList.add("ignore");
                th.innerHTML = head;
                continue;
            }
            th.addEventListener("click", () => this.sortTable(this.data["head"].indexOf(head)));
            th.innerHTML = `${head} <i class="bi bi-caret-down-fill"></i>`;
        }
    }
    
    createTableBody() {
        if (this.tbody !== null)
            this.table.removeChild(this.tbody);
        this.tbody = createAndAppendElement(this.table, "tbody");
        let roleIds =  [];
        for (const role of this.roles)
            roleIds = roleIds.concat(this.lookupData["roleLists"][role]);
        console.log(this.roles, roleIds);
        for (const row in this.data["body"][this.region]) {
            if (!roleIds.includes(row)) 
                continue
            
            const tr = createAndAppendElement(this.tbody, "tr");
            for (const cell of this.data["body"][this.region][row]) {
                const td = createAndAppendElement(tr, "td");
                td.innerText = cell;
            }
        }
    }
    
    sortTable(columnIndex) {
        const tableData = Array.from(this.tbody.rows,
            (row) => Array.from(
                row.cells, (cell) => cell.innerText));
        
        this.reverse = this.sortedColumn === columnIndex ? !this.reverse : true;
        const direction = this.reverse ? -1 : 1;
        
        tableData.sort((a, b) => {
            if (isNaN(a[columnIndex]) || isNaN(b[columnIndex]))
                return a[columnIndex].localeCompare(b[columnIndex]) * direction;
            return (parseFloat(a[columnIndex]) - parseFloat(b[columnIndex])) * direction;
        });
        
        for (let i = 0; i < tableData.length; i++) 
            for (let j = 0; j < tableData[i].length; j++)
                this.tbody.rows[i].cells[j].innerText = tableData[i][j];
        
        this.sortedColumn = columnIndex;
        
        this.highlightColumn(columnIndex);
        this.highlightAndAddIconToHeader(columnIndex);
    }
    
    highlightColumn(columnIndex) {
        for (const col of this.cols)
            col.classList.remove("highlight");
        this.cols[columnIndex].classList.add("highlight");
    }
    
    highlightAndAddIconToHeader(columnIndex) {
        for (const th of this.thead.rows[0].cells)
            th.classList.remove("highlight");
        this.thead.rows[0].cells[columnIndex].classList.add("highlight");
        this.thead.rows[0].cells[columnIndex].ariaSort = this.reverse ? "descending" : "ascending";
    }
}