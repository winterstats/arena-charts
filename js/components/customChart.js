const lineTypes = {
    "line": {"borderWidth": 2, "borderDash": [], "borderDashOffset": 0},
    "dash": {"borderWidth": 2, "borderDash": [15, 5], "borderDashOffset": 0},
    "dot": {"borderWidth": 2, "borderDash": [2, 3], "borderDashOffset": 0},
    "dashdot": {"borderWidth": 2, "borderDash": [5, 5, 1, 5], "borderDashOffset": 0},
}

export class CustomChart {
    constructor(ctx, options) {
        this.chart = this.createChart(ctx, options);
    }
    
    createChart(ctx, options) {
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: "day",
                            tooltipFormat: "MMMM d"
                        }
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
    
    onVisibilityChange = (specId, visibilityState, borderStyle) => {
        Object.assign(this.chart.data.datasets[specId], lineTypes[borderStyle]);
        if (visibilityState === this.chart.isDatasetVisible(specId)) return;
        
        if (visibilityState) {
            //this.chart.update();
            this.chart.show(specId);
        } else {
            this.chart.hide(specId);
        }
    }
    
    onDatasetChange = (data) => {
        this.chart.data = data;
        this.chart.update();
    }
}
