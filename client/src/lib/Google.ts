import * as Promise from 'bluebird';

declare var google: any;
export var googleRef = google;

let isChartsLoaded = false;

export function loadCharts():Promise<any> {
    if(isChartsLoaded) {
        return Promise.resolve();
    }
    
    return new Promise((resolve) => {
        googleRef.charts.load('current', {packages: ['corechart', 'bar', 'line'], 'language': 'pt-br'});
        googleRef.charts.setOnLoadCallback(() => {
            isChartsLoaded = true;
            resolve();
        });
    });
}
