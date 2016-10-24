import * as Promise from 'bluebird';

declare var google: any;
export var googleRef = google;

let isBarChartLoaded = false;
let isLineChartLoaded = false;
let isPieChartLoaded = false;

export function loadBarChart():Promise<any> {
    if(isBarChartLoaded) {
        return Promise.resolve();
    }
    
    return new Promise((resolve) => {
        googleRef.charts.load('current', {packages: ['corechart', 'bar'], 'language': 'pt-br'});
        googleRef.charts.setOnLoadCallback(() => {
            isBarChartLoaded = true;
            resolve();
        });
    });
}

export function loadLineChart():Promise<any> {
    if(isLineChartLoaded) {
        return Promise.resolve();
    }
    
    return new Promise((resolve) => {
        googleRef.charts.load('current', { packages: ['corechart', 'line'], 'language': 'pt-br' });
        googleRef.charts.setOnLoadCallback(() => {
            isLineChartLoaded = true;
            resolve();
        });
    });
}

export function loadPieChart():Promise<any> {
    if(isPieChartLoaded) {
        return Promise.resolve();
    }
    
    return new Promise((resolve) => {
        googleRef.charts.load('current', {packages: ['corechart'], 'language': 'pt-br'});
        googleRef.charts.setOnLoadCallback(() => {
            isPieChartLoaded = true;
            resolve();
        });
    });
}