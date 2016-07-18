import { IGeoPoint } from '../../common/Interfaces';

/**
 * Receives the coords in the form: {"lat":-21.23799528,"lng":-39.96288806}
 * and returns: '-21.23799528, -39.96288806'
 */
export function coordToString(coords:IGeoPoint):string {
    return coords.lat + ', ' + coords.lng;
}

/**
 * Receives the coords in the form: '-21.23799528, -39.96288806'
 * and returns: {"lat":-21.23799528,"lng":-39.96288806}
 */
export function stringToCoord(strWithCoords: string):IGeoPoint {
    if(!strWithCoords || strWithCoords.length == 0) {
        return null;
    }

    const parts:string[] = strWithCoords.split(',');
    const lat = parseFloat(parts[0].trim());
    const lng = parseFloat(parts[1].trim());
    return { lat, lng };
}