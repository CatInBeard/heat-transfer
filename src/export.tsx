import { saveAs } from "file-saver";

const temperatureToCsv = (temperatures: number[][], increment: number = 1): string => {
    let csv = "step,time,node,temperature\n";
    let time = 0;

    for (let i = 0; i < temperatures.length; i++) {
        for (let j = 0; j < temperatures[i].length; j++) {
            csv += `${i + 1},${time},${j + 1},${temperatures[i][j]}\n`;
            time += increment;
        }
    }
    return csv
}

const saveTextFile = (text: string, filename: string) => {
    const file = new File([text], filename, { type: "text/plain" });
    saveAs(file);
}

const downloadTemperatureCsv = (temperatures: number[][], increment:number = 1) => {
    let temperaturesCsvText = temperatureToCsv(temperatures, increment)
    saveTextFile(temperaturesCsvText, "temp.csv");
}

export { downloadTemperatureCsv }