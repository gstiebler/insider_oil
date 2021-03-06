
export function find<T>(list: T[], func: (T) => boolean):T {
    for(let val of list) {
        if(func(val)) {
            return val;
        }
    }
    return null;
}