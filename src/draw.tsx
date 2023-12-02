import { Mesh } from "./mesh.tsx"

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

        drawGradientTriangle(temperaturePoints, canvas, minT, maxT);


    });



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


const drawGradientTriangle = (points: TemperaturePoint[], canvas: HTMLCanvasElement, minT: number, maxT: number) => {

    const ctx = canvas.getContext('2d');
    if (!ctx)
        return


    let color1: Color = temperatureToColor(points[0].temperature, minT, maxT);
    let color2: Color = temperatureToColor(points[1].temperature, minT, maxT);
    let color3: Color = temperatureToColor(points[2].temperature, minT, maxT);
    const gradient = ctx.createLinearGradient(points[0].x, points[0].y, points[2].x, points[2].y);

    gradient.addColorStop(0, 'rgb(' + color1.r + ', ' + color1.g + ', ' + color1.b + ')');
    gradient.addColorStop(0.5, 'rgb(' + color2.r + ', ' + color2.g + ', ' + color2.b + ')');
    gradient.addColorStop(1, 'rgb(' + color3.r + ', ' + color3.g + ', ' + color3.b + ')');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

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