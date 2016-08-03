export function formatPercentage(prop: number): string {
    return (prop * 100.0).toFixed(2).replace('.', ',') + '%';
}