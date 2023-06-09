export class CustomChart {
    constructor(ctx, data, lookupData, options) {
        this.lookupData = lookupData;
        this.chart = this.createChart(ctx, data, options);
    }
    
    createChart(ctx, data) {
        return Chart(ctx, {
            type: 'line',
            data: {
                labels: labels[initialState.region],
                datasets: datasets[initialState.region][initialState.timeframe][initialState.metric]
            }
        });
    }
    
    OnVisibilityChange(specId) {
        
    }
}

class HistoryChart extends CustomChart {
        
}