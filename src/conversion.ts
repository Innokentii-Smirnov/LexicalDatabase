export function mapToObject<TValue>(map: Map<string, TValue>): {[key: string]: TValue} {
  const obj: {[key: string]: TValue} = {};
  for (const [key, value] of map) {
    obj[key] = value;
  }
  return obj;
}

export function setMapToObject<TValue>(map: Map<string, Set<TValue>>): {[key: string]: TValue[]} {
  const obj: {[key: string]: TValue[]} = {};
  for (const [key, valueSet] of map) {
    const values = [];
    for (const value of valueSet) {
      values.push(value);
    }
    obj[key] = values;
  }
  return obj;
}
