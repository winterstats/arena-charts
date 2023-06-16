import {createPattern} from "../../utils/utils.js";

const lineTypes = {
    "line": {"borderWidth": 2, "borderDash": [], "borderDashOffset": 0},
    "dash": {"borderWidth": 2, "borderDash": [15, 5], "borderDashOffset": 0},
    "dot": {"borderWidth": 2, "borderDash": [2, 3], "borderDashOffset": 0},
    "dashdot": {"borderWidth": 2, "borderDash": [5, 5, 1, 5], "borderDashOffset": 0},
}

export class CustomChart {
    constructor(ctx, type="line", pointRadius=3) {
        this.chart = this.createChart(ctx, type, pointRadius);
    }
    
    createChart(ctx, type, pointRadius) {
        return new Chart(ctx, {
            type: type,
            data: {
                labels: [],
                datasets: []
            },
            options: {
                elements: {
                    point: {
                        radius: pointRadius
                    }
                },
                scales: {
                    x: {
                        // type: 'time',
                        // time: {
                        //     unit: "day",
                        //     tooltipFormat: "MMMM d"
                        // }
                        
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                tension: 0.3,
            }
        });
    }
    
    onVisibilityChange = (specIds, visibilityStates, borderStyles) => {
        this.updateBorders(specIds, borderStyles);
        this.updateBackgroundStyles(specIds, borderStyles);
        this.chart.update();
        this.updateVisibility(specIds, visibilityStates);
    }
    
    updateBorders(specIds, borderStyles) {
        for (let i = 0; i < specIds.length; i++)
            Object.assign(this.chart.data.datasets[specIds[i]], lineTypes[borderStyles[i]]);
    }
    
    updateBackgroundStyles(specIds, borderStyles) {
        for (let i = 0; i < specIds.length; i++) {
            const color = this.chart.data.datasets[specIds[i]]["borderColor"];
            this.chart.data.datasets[specIds[i]]["backgroundColor"] = createPattern(color, borderStyles[i]);
        }
    }
    
    updateVisibility(specIds, visibilityStates) {
        for (let i = 0; i < specIds.length; i++) {
            if (visibilityStates[i] === this.chart.isDatasetVisible(specIds[i])) 
                continue;
            else if (visibilityStates[i])
                this.chart.show(specIds[i]);
            else 
                this.chart.hide(specIds[i]);
        }
    }
    
    onDatasetChange = (data) => {
        this.chart.data = data;
        this.chart.update();
    }
}
