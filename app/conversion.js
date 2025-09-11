export function mapToObject(map) {
    const obj = {};
    for (const [key, value] of map) {
        obj[key] = value;
    }
    return obj;
}
export function setMapToObject(map) {
    const obj = {};
    for (const [key, valueSet] of map) {
        const values = [];
        for (const value of valueSet) {
            values.push(value);
        }
        obj[key] = values;
    }
    return obj;
}
