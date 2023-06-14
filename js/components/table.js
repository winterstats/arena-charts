import {createAndAppendElement} from "../utils/utils.js";

export class Table {
    constructor(data, container) {
        this.data = data;
        this.container = container;

        /** @type {HTMLTableElement} */
        this.table = null;
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
        this.table = createAndAppendElement(this.container, "table", null, "table", "table-response", "table-striped", "table-box", "table-fixedheader", "table-borderless");
        this.createTableHead(this.table);
        this.createTableBody(this.table);
    }
    
    createTableHead(table) {
        this.thead = createAndAppendElement(table, "thead");
        const tr = createAndAppendElement(this.thead, "tr");
        for (const head of this.data["head"]) {
            const th = createAndAppendElement(tr, "th");
            th.addEventListener("click", () => this.sortTable(this.data["head"].indexOf(head)));
            th.innerText = head;
        }
    }
    
    createTableBody(table) {
        this.tbody = createAndAppendElement(table, "tbody");
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
            return (parseInt(a[columnIndex]) - parseInt(b[columnIndex])) * direction;
        });
        
        for (let i = 0; i < tableData.length; i++) {
            for (let j = 0; j < tableData[i].length; j++) {
                this.tbody.rows[i].cells[j].innerText = tableData[i][j];
            }
        }
        this.sortedColumn = columnIndex;
    }
}