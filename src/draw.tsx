import { Mesh, findMinMaxCoordinates, MinMax } from "./mesh.tsx"

type Coords = {
    x: number,
    y: number
}

type TemperaturePoint = {
    x: number,
    y: number,
    temperature: number
}

type Color = {
    r: number,
    g: number,
    b: number,
    a: number,
}

const drawMesh = (Mesh: Mesh, canvas) => {
    const pointSize = 0.8;
    const lineSize = 0.05;

    const ctx = canvas.getContext('2d');

    Mesh.points.forEach(point => {

        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.beginPath();
        let coords = localCoordsToCnavasCoords({ x: point.x, y: point.y }, Mesh, canvas);

        ctx.arc(
            coords.x,
            coords.y,
            (pointSize / 2) * Mesh.scale,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.closePath();

    });

    Mesh.lines.forEach(line => {
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.beginPath();

        let coords = localCoordsToCnavasCoords({ x: line.start_x, y: line.start_y }, Mesh, canvas);

        ctx.moveTo(coords.x, coords.y);
        coords = localCoordsToCnavasCoords({ x: line.end_x, y: line.end_y }, Mesh, canvas);
        ctx.lineTo(coords.x, coords.y);
        ctx.lineWidth = lineSize * Mesh.scale;
        ctx.stroke();
    })
}

const drawTemperatureMap = (Mesh, nodesTemperatures, inpData, blocksVisibility, canvas, divElement) => {


    const ctx = canvas.getContext('2d');
    if (!ctx)
        return

    const ctxImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const imageData = ctxImageData.data;


    let nodes: number[][] = inpData.problemData[0].nodes;
    let elements: number[][] = inpData.problemData[0].elements;

    if (nodesTemperatures.length !== nodes.length) {
        return;
    }


    let visibleSections = inpData.problemData[0].sections.filter((section) => {
        return blocksVisibility[section.name]
    });

    let visibleElementsNumbers: number[] = [];

    for (let i = 0; i < visibleSections.length; i++) {
        let section = visibleSections[i]
        let lset = inpData.problemData[0].lsets.find((lset) => {
            return lset.setname == section.elsetName
        });

        visibleElementsNumbers.push(...lset.elements);
    };

    elements = elements.filter((element) => {
        return visibleElementsNumbers.includes(element[0]);
    })

    let minT = nodesTemperatures.reduce((min: number, current: number) => current < min ? current : min, nodesTemperatures[0])
    let maxT = nodesTemperatures.reduce((max: number, current: number) => current > max ? current : max, nodesTemperatures[0])

    elements.forEach(element => {
        let drawNodes: number[][] = []
        for (let i = 1; i <= 3; i++) {

            let node = nodes.find((node) => {
                return node[0] == element[i]
            })

            if (!node) {
                throw new Error("Node is undefined")
            }

            drawNodes.push(node)
        }

        let temperaturePoints: TemperaturePoint[] = drawNodes.map((node) => {
            let coords: Coords = localCoordsToCnavasCoords({ x: node[1], y: node[2] }, Mesh, canvas)
            let temperature: number = nodesTemperatures[node[0] - 1];

            return { x: coords.x, y: coords.y, temperature: temperature }
        })


        temperaturePoints = temperaturePoints.sort((point1, point2) => {
            return point1.temperature - point2.temperature;
        })

        drawGradientTriangle(temperaturePoints, imageData, minT, maxT, canvas.width);


    });

    ctx.putImageData(ctxImageData, 0, 0);


    let maxLeft: number = 0;

    if (divElement.scrollWidth > divElement.clientWidth) {
        Mesh.points.forEach(point => {

            let coords = localCoordsToCnavasCoords({ x: point.x, y: point.y }, Mesh, canvas);

            if (maxLeft < coords.x) {
                maxLeft = coords.x
            }
        });
        maxLeft += 30;
    }

    drawTemperatureLegend(canvas, minT, maxT, maxLeft);

}


const drawTemperatureLegend = (canvas: HTMLCanvasElement, min: number, max: number, startFrom: number = 0) => {
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return

    if (startFrom === 0) {
        startFrom = canvas.width - 100;
    }

    for (let i = 0; i <= 100; i++) {
        const color = temperatureToColor(i, 0, 100);
        ctx.fillStyle = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
        ctx.fillRect(startFrom, canvas.height - i * canvas.height / 120, 20, canvas.height / 80);
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(min.toString(), startFrom + 25, canvas.height - 25);
        ctx.fillText(max.toString(), startFrom + 25, canvas.height * 0.2 + 25);
    }
}


const drawGradientTriangle = (points: TemperaturePoint[], imageData: Uint8ClampedArray, minT: number, maxT: number, canvas_width: number) => {

    let minMax: MinMax = findMinMaxCoordinates(points);

    for (let y = 0; y < Math.floor(minMax.max_y) + 1; y++) {
        for (let x = 0; x < Math.floor(minMax.max_x) + 1; x++) {
            const barycentric = calculateBarycentricCoordinates(points[0], points[1], points[2], x, y);

            if (barycentric.x >= 0 && barycentric.y >= 0 && barycentric.z >= 0) {
                const temperature = interpolateTemperature(points[0].temperature, points[1].temperature, points[2].temperature, barycentric);
                const color: Color = temperatureToColor(temperature, minT, maxT);
                const index = (x + y * canvas_width) * 4;
                imageData[index] = color.r;
                imageData[index + 1] = color.g;
                imageData[index + 2] = color.b;
                imageData[index + 3] = 255;
            }
        }
    }

}

const calculateBarycentricCoordinates = (point1: Coords, point2: Coords, point3: Coords, x: number, y: number) => {
    const denominator = ((point2.y - point3.y) * (point1.x - point3.x) + (point3.x - point2.x) * (point1.y - point3.y));
    const a = ((point2.y - point3.y) * (x - point3.x) + (point3.x - point2.x) * (y - point3.y)) / denominator;
    const b = ((point3.y - point1.y) * (x - point3.x) + (point1.x - point3.x) * (y - point3.y)) / denominator;
    const c = 1 - a - b;
    return { x: a, y: b, z: c };
}

const interpolateColors = (color1: Color, color2: Color, color3: Color, barycentric) => {
    const r = Math.floor(color1.r * barycentric.x + color2.r * barycentric.y + color3.r * barycentric.z);
    const g = Math.floor(color1.g * barycentric.x + color2.g * barycentric.y + color3.g * barycentric.z);
    const b = Math.floor(color1.b * barycentric.x + color2.b * barycentric.y + color3.b * barycentric.z);
    return { r, g, b };
}

const interpolateTemperature = (temperature1: number, temperature2: number, temperature3: number, barycentric) => {
    return Math.floor(temperature1 * barycentric.x + temperature2 * barycentric.y + temperature3 * barycentric.z);
}




const localCoordsToCnavasCoords = (coords: Coords, Mesh: Mesh, canvas: HTMLCanvasElement): Coords => {

    let x: number = (coords.x + Mesh.offset_x) * Mesh.scale;
    let y: number = canvas.height - (coords.y + Mesh.offset_y) * Mesh.scale;
    return { x, y }
}

const temperatureToColor = (T: number, minTemp: number = 0, maxTemp: number = 100): Color => {

    const normalizedTemp = (T - minTemp) / (maxTemp - minTemp) * 100;

    let r = 1
    let g = 1
    let b = 1

    if (normalizedTemp < (25)) {
        r = 0;
        g = 0.04 * normalizedTemp;
    } else if (normalizedTemp < 50) {
        r = 0;
        b = 1 + 0.04 * (0.25 - normalizedTemp);
    } else if (normalizedTemp < 75) {
        r = 0.04 * (normalizedTemp - 50);
        b = 0;
    } else {
        g = 1 + 0.04 * (75 - normalizedTemp);
        b = 0;
    }

    return { r: r * 255, g: g * 255, b: b * 255, a: 255 }
}


export { drawMesh, drawTemperatureMap }  
