type Mesh = {
    points: Array<Point>
    lines: Array<Line>,
    scale: number,
    offset_x: number
    offset_y: number
}

type Point = {
    x: number,
    y: number
}

type Line = {
    start_x: number,
    start_y: number,
    end_x: number,
    end_y: number,
}

type MinMax = {
    min_x: number,
    min_y: number,
    max_x: number,
    max_y: number,
}

const convertInpDataToMesh = (inpData, height, width): Mesh => {

    let scale = 8;
    

    let points: Array<Point> = []
    let lines: Array<Line> = []

    inpData.problemData[0].nodes.forEach(node => {
        points.push({ x: node[1], y: node[2] })
    });

    inpData.problemData[0].elements.forEach(element => {

        lines.push({
            start_x: points[element[1]-1].x,
            start_y: points[element[1]-1].y,
            end_x: points[element[2]-1].x,
            end_y: points[element[2]-1].y
        })

        lines.push({
            start_x: points[element[1]-1].x,
            start_y: points[element[1]-1].y,
            end_x: points[element[3]-1].x,
            end_y: points[element[3]-1].y
        })

        lines.push({
            start_x: points[element[2]-1].x,
            start_y: points[element[2]-1].y,
            end_x: points[element[3]-1].x,
            end_y: points[element[3]-1].y
        })
    });

    let minMax: MinMax = findMinMaxCoordinates(points);

    let scaleX = height/(minMax.max_x - minMax.min_x + 20);
    let scaleY = width/(minMax.max_y - minMax.min_y);

    scale = scaleX > scaleY ? scaleY : scaleX;


    let mesh: Mesh = {
        points: points,
        lines: lines,
        scale: scale,
        offset_x: minMax.min_x < 0 ? 5 - minMax.min_x : 5,
        offset_y: minMax.min_y < 0 ? 5 - minMax.min_y : 5,
    };

    return mesh;
}

const findMinMaxCoordinates = (points: Array<Point>): MinMax => {
    if (points.length === 0) {
        throw new Error("Points is empty!");
    }

    let minX = points[0].x;
    let maxX = points[0].x;
    let minY = points[0].y;
    let maxY = points[0].y;

    for (let i = 1; i < points.length; i++) {
        if (points[i].x < minX) {
            minX = points[i].x;
        } else if (points[i].x > maxX) {
            maxX = points[i].x;
        }

        if (points[i].y < minY) {
            minY = points[i].y;
        } else if (points[i].y > maxY) {
            maxY = points[i].y;
        }
    }

    return { min_x: minX, min_y: minY, max_x: maxX, max_y: maxY };
}


export { convertInpDataToMesh, Mesh, MinMax, findMinMaxCoordinates };