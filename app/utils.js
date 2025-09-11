export function objectToMap(object) {
    const map = new Map();
    for (const [key, value] of Object.entries(object)) {
        map.set(key, value);
    }
    return map;
}
export function objectToSetValuedMap(object) {
    const map = new Map();
    for (const [key, values] of Object.entries(object)) {
        const collection = new Set();
        for (const value of values) {
            collection.add(value);
        }
        map.set(key, collection);
    }
    return map;
}
export function updateSetValuedMapWithOverride(map, object) {
    for (const [key, values] of Object.entries(object)) {
        const collection = new Set();
        for (const value of values) {
            collection.add(value);
        }
        map.set(key, collection);
    }
}
function getValueSet(map, key) {
    let current = map.get(key);
    if (current === undefined) {
        current = new Set;
        map.set(key, current);
    }
    return current;
}
export function add(map, key, value) {
    const current = getValueSet(map, key);
    current.add(value);
}
export function remove(map, key, value) {
    const current = map.get(key);
    if (current !== undefined) {
        current.delete(value);
        if (current.size === 0) {
            map.delete(key);
        }
    }
}
export function addMultiple(map, key, values) {
    const current = getValueSet(map, key);
    for (const value of values) {
        current.add(value);
    }
}
export function replaceKey(map, oldKey, newKey) {
    const values = map.get(oldKey);
    if (values !== undefined) {
        map.delete(oldKey);
        const oldValues = map.get(newKey);
        if (oldValues === undefined) {
            // If no value is assigned to the new key
            map.set(newKey, values);
        }
        else {
            for (const value of values) {
                oldValues.add(value);
            }
        }
    }
}
export function removeMacron(s) {
    return s
        .replaceAll('ā', 'a')
        .replaceAll('ē', 'e')
        .replaceAll('ī', 'i')
        .replaceAll('ō', 'o')
        .replaceAll('ū', 'u')
        .replaceAll('Ā', 'A')
        .replaceAll('Ē', 'E')
        .replaceAll('Ī', 'I')
        .replaceAll('Ō', 'O')
        .replaceAll('Ū', 'U');
}
export function formIsFragment(form) {
    return form.includes('[') || form.includes(']') || form.includes('x');
}
export function groupBy(array, getKey, getValue) {
    const map = new Map();
    for (const element of array) {
        const key = getKey(element);
        const value = getValue(element);
        add(map, key, value);
    }
    return map;
}
