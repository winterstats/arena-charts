export function createChart(ctx, labels, datasets) {
    const initialState = getInitialState(datasets);
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels[initialState.region],
            datasets: datasets[initialState.region][initialState.timeframe][initialState.metric]
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
            selectState: initialState,
            plugins: {
                legend: {
                    display: false
                }
            },
            tension: 0.3,

        },
    });
}

function getInitialState(datasets) {
    const region = Object.keys(datasets)[0];
    const timeframe = Object.keys(datasets[region])[0];
    const metric = Object.keys(datasets[region][timeframe])[0];
    return {
        region: region,
        timeframe: timeframe,
        metric: metric
    }
}