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

export function polygonsToStr(polygons:IGeoPoint[][]):string {
    const polygonsStrs:string[] = [];
    for(var polygon of polygons) {
        const pointStrs:string[] = [];
        for(var point of polygon) {
            pointStrs.push(coordToString(point));
        }
        polygonsStrs.push(pointStrs.join('\n'));
    }
    return polygonsStrs.join('\n*\n');    
}

export function strToPolygons(polygonsStr_: string):IGeoPoint[][] {
    const polygons:IGeoPoint[][] = [];
    const polygonsStr = polygonsStr_.split('*');
    for(var polygonStr of polygonsStr) {
       const polygon:IGeoPoint[] = [];
       const points = polygonStr.split('\n');
       for(var point of points) {
          const coords = point.split(',');
          if(coords.length != 2) {
              continue;
          }
          const lat = parseFloat(coords[0].trim());
          const lng = parseFloat(coords[1].trim());
          polygon.push({ lat, lng });
       }
       polygons.push(polygon);
    } 
    return polygons;
}