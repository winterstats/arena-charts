import {createAndAppendElement} from "../utils/utils.js";

export class Table {
    constructor(data, container) {
        this.data = data;
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
        
        this.createTable();
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
            th.addEventListener("click", () => this.sortTable(this.data["head"].indexOf(head)));
            th.innerHTML = `${head} <i class="bi bi-caret-down-fill"></i>`;
        }
    }
    
    createTableBody() {
        this.tbody = createAndAppendElement(this.table, "tbody");
        for (const row of this.data["body"]) {
            const tr = createAndAppendElement(this.tbody, "tr");
            for (const cell of row) {
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