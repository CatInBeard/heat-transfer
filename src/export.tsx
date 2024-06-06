import { saveAs } from "file-saver";
import JSZip from "jszip";

type FileDataMap = Record<string, string>;

const temperatureToCsv = (temperatures: number[][], increment: number = 1): string => {
    let csv: string = "step,time,node,temperature\n";
    let time: number = 0;

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

const saveZip = (fileDataMap: FileDataMap, zipName) => {
    const zip = new JSZip();

    for (const [filename, data] of Object.entries(fileDataMap)) {
        zip.file(filename, data);
    }

    zip.generateAsync({ type: "blob" }).then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = zipName;
        a.click();
        window.URL.revokeObjectURL(url);
    });
};

const downloadTemperatureCsv = (temperatures: number[][], increment: number = 1) => {
    let temperaturesCsvText = temperatureToCsv(temperatures, increment)
    saveTextFile(temperaturesCsvText, "temp.csv");
}

const temperatureToVtkString = (temperatures: number[], inpData): string => {

    let nodes = inpData.problemData[0].nodes;
    let elements = inpData.problemData[0].elements;

    let vtk = "# vtk DataFile Version 3.0\n" +
        "written by https://github.com/catinbeard/heat-transfer\n" +
        "ASCII\n" +
        "DATASET UNSTRUCTURED_GRID\n" +
        "POINTS " + nodes.length + " double\n" +
        nodes.map((node) => [node[1], node[2], 0].join(" ")).join("\n") + "\n" +
        "CELLS " + (elements.length) + " " + (elements.length * 4) + "\n" +
        elements.map((element) => [3, element[1] - 1, element[2] - 1, element[3] - 1].join(" ")).join("\n") + "\n" +
        "CELL_TYPES " + elements.length + "\n" +
        elements.map((element) => 5).join("\n") + "\n" +
        "POINT_DATA " + nodes.length + "\n" +
        "FIELD FieldData 1\n" +
        "T 1 " + nodes.length + " double\n" +
        temperatures.join(" ")

    return vtk
}

const createVtkSeties = (num: number): string => {
    let files = [];
    for (let i = 0; i < num; i++) {
        files.push({
            "name": "temp" + i + ".vtk",
            "time": i
        })
    }
    let serisData = {
        "file-series-version": "1.0",
        "files": files
    }

    return JSON.stringify(serisData)
}

const temperatureToVtk = (temperatures: number[][], inpData): FileDataMap => {
    let temps = {}


    for (let i = 0; i < temperatures.length; i++) {

        const vtkString = temperatureToVtkString(temperatures[i], inpData);
        temps["temp" + i + ".vtk"] = vtkString;

    }

    if (temperatures.length > 1) {
        const vtkSeriesString = createVtkSeties(temperatures.length);
        temps["temp.vtk.series"] = vtkSeriesString;
    }

    return temps
}

const downloadTemperatureVtk = (temperatures: number[][], inpData) => {
    let temperaturesVtk = temperatureToVtk(temperatures, inpData)
    saveZip(temperaturesVtk, "temp.zip");
}

export { downloadTemperatureCsv, downloadTemperatureVtk }