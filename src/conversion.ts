export function mapToObject(map) {
  const object = {};
  for (const [key, value] of map) {
    object[key] = value;
  }
  return object;
}

export function setMapToObject(map) {
  const object = {};
  for (const [key, valueSet] of map) {
    const values = [];
    for (const value of valueSet) {
      values.push(value);
    }
    object[key] = values;
  }
  return object;
}
