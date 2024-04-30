const parseCSV = (csvData: string) => {

    const lines = csvData.split("\n");
    const result = [];

    for (let i = 0; i < lines.length; i++) {
        const [time, temperature] = lines[i].split(",");
        result[parseFloat(time)] = parseFloat(temperature);
    }

    return result;
}


type ValueMap<T> = { [key: string]: T };

function interpolateMap<T>(map: ValueMap<T>, value: number): T {


  const sortedKeys = Object.keys(map).sort((a, b) => a - b);
  const firstValue = map[sortedKeys[0]];

  if(value <= 0 || value <= parseFloat(sortedKeys[0]) ){
    return firstValue;
  }
  
  const keys = Object.keys(map).map((k) => parseFloat(k));
  const lowerKey = keys.find((k) => k <= value);
  const upperKey = keys.find((k) => k >= value);

  if (lowerKey === undefined) {
    return map[keys[0]];
  } else if (upperKey === undefined) {
    return map[keys[keys.length - 1]];
  }

  const lowerValue = map[lowerKey];
  const upperValue = map[upperKey];
  const weight = (value - lowerKey) / (upperKey - lowerKey);

  return (1 - weight) * lowerValue + weight * upperValue;
}



export {parseCSV, interpolateMap}