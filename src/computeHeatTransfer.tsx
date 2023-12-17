import { transposeMatrix, MultiplyMatrix, MultiplyMatrixByVector, SumVector, multiplyVectorByNumber, solveLinearEquationSystem, multiplyMatrixByNumber, InverseMatrix, Determinant, SumMatrix } from "./matrix.tsx";
import { Nset, Lset, Section, TemperatureBC } from "./inpParse"

type TemperaturedNode = {
    x: number,
    y: number,
    temperature: number
}


const computeTransitive = (inpData, temperature_BC, blocks_termal_conductivity, blocks_density, blocks_capacity) => {

    let timeStep = 0.01;
    let steps = 1000;

    let Theta = 1;

    let K = getConductivityMatrix(inpData, blocks_termal_conductivity);

    let C = getCapacityMayrix(inpData, blocks_density, blocks_capacity);

    K = applyTemperatureBC(K, inpData);
    C = applyTemperatureBC(C, inpData);

    let F = getTermalForcesFromBC(inpData, temperature_BC);

    let K_new = SumMatrix(C, multiplyMatrixByNumber(K,timeStep * Theta));

    

    let temperaturePrevStep: number[] = [];
    let temperatureCurrentStep: number[] = [];

    for (let i = 0; i < F.length; i++) {
        temperaturePrevStep.push(0);
    }

    let temperatureFrames: number[][] = [];

    temperatureFrames.push(temperaturePrevStep);

    for (let t = 0; t < timeStep * steps; t += timeStep) {

        let F_new =  SumVector(MultiplyMatrixByVector( SumMatrix(C, multiplyMatrixByNumber(K, -1*timeStep*(1 - Theta))), temperaturePrevStep), multiplyVectorByNumber(F,timeStep))

        temperatureCurrentStep = solveLinearEquationSystem(K_new, F_new);

        // temperatureCurrentStep = solveLinearEquationSystem(
        //     multiplyMatrixByNumber(C, 1 / timeStep),
        //     SumVector(
        //         SumVector(F, multiplyVectorByNumber(MultiplyMatrixByVector(K, temperaturePrevStep), -1)),
        //         multiplyVectorByNumber(temperaturePrevStep, 1 / timeStep)
        //     )
        // )

        temperatureFrames.push(temperatureCurrentStep);
        temperaturePrevStep = temperatureCurrentStep;
    }


    return temperatureFrames;

}


const computeSteadyState = (inpData, temperature_BC, blocks_termal_conductivity) => {

    let K = getConductivityMatrix(inpData, blocks_termal_conductivity);

    K = applyTemperatureBC(K, inpData);

    let F = getTermalForcesFromBC(inpData, temperature_BC);

    let temperatures = solveLinearEquationSystem(K, F);

    return temperatures

}


const getTermalForcesFromBC = (inpData, temperature_BC): number[] => {
    let length = inpData.problemData[0].nodes.length;

    let F: number[] = Array(length);
    for (let i = 0; i < length; i++) {
        F[i] = 0;
    }

    for (let i = 0; i < temperature_BC.length; i++) {
        let BC: TemperatureBC = temperature_BC[i];

        let nodes: number[] = getNodesByAssemblySetName(BC.setName, inpData);

        for (let i = 0; i < nodes.length; i++) {
            let node: number = nodes[i];
            F[node - 1] = BC.temperature;
        }

    }

    return F;
}

const getNodesByAssemblySetName = (setName: string, inpData): number[] => {

    let nset: Nset | undefined = inpData["assembly"].nsets.find((nset: Nset) => {
        return nset.setname == setName
    });
    if (!nset) {
        throw new Error("Set not found")
    }

    return nset.nodes
}


const applyTemperatureBC = (K: Array<Array<number>>, inpData): Array<Array<number>> => {

    inpData.steps[0].boundaries.temperature.forEach((temperature: TemperatureBC) => {
        let setName = temperature.setName
        let nset: Nset | undefined = inpData.assembly.nsets.find((nset: Nset) => {
            return nset.setname == setName;
        });
        if (!nset) {
            throw new Error("Nset not found");
        }

        nset.nodes.forEach((node) => {
            for (let i = 0; i < K.length; i++) {
                K[node - 1][i] = 0
                K[node - 1][node - 1] = 1
            }
        })
    });


    return K;
}

const getConductivityByElement = (element: number, blocks_termal_conductivity, lsets: Lset[], sections: Section[]): number => {

    let lset = lsets.find((elset) => {
        return elset.elements.indexOf(element) != -1;
    })
    if (!lset) {
        throw new Error("Element not in elset");
    }
    let lsetName: string = lset.setname;
    let section = sections.find((section) => {
        return section.elsetName == lsetName
    })
    if (!section) {
        throw new Error("Elset not in section");
    }
    let sectionName = section.name;

    return blocks_termal_conductivity[sectionName] ?? 0;
}

const getDensityByElement = (element: number, blocks_density, lsets: Lset[], sections: Section[]): number => {

    let lset = lsets.find((elset) => {
        return elset.elements.indexOf(element) != -1;
    })
    if (!lset) {
        throw new Error("Element not in elset");
    }
    let lsetName: string = lset.setname;
    let section = sections.find((section) => {
        return section.elsetName == lsetName
    })
    if (!section) {
        throw new Error("Elset not in section");
    }
    let sectionName = section.name;

    return blocks_density[sectionName] ?? 0;
}

const getCapacityByElement = (element: number, blocks_capacity, lsets: Lset[], sections: Section[]): number => {

    let lset = lsets.find((elset) => {
        return elset.elements.indexOf(element) != -1;
    })
    if (!lset) {
        throw new Error("Element not in elset");
    }
    let lsetName: string = lset.setname;
    let section = sections.find((section) => {
        return section.elsetName == lsetName
    })
    if (!section) {
        throw new Error("Elset not in section");
    }
    let sectionName = section.name;

    return blocks_capacity[sectionName] ?? 0;
}



const getConductivityMatrix = (inpData, blocks_termal_conductivity): Array<Array<number>> => {

    let nodes = inpData.problemData[0].nodes;
    let elements = inpData.problemData[0].elements;

    let K: number[][] = new Array(nodes.length);
    for (let i = 0; i < K.length; i++) {
        K[i] = new Array(nodes.length).fill(0);
    }

    for (let i = 0; i < elements.length; i++) {

        let conductivity = getConductivityByElement(elements[i][0], blocks_termal_conductivity, inpData.problemData[0].lsets, inpData.problemData[0].sections);
        let R: number[][] = [[], [], []];
        for (let j = 1; j <= 3; j++) {
            R[j - 1] = [nodes[elements[i][j] - 1][1], nodes[elements[i][j] - 1][2]];
        }

        R = transposeMatrix(R);

        let Ki = getLocalCondictivityMatrix(R, conductivity);
        K = accumulateToGlobalMatrix(K, Ki, elements[i][1], elements[i][2], elements[i][3]);

    }

    return K;
}

const getCapacityMayrix = (inpData, blocks_density, blocks_capacity): Array<Array<number>> => {

    let nodes = inpData.problemData[0].nodes;
    let elements = inpData.problemData[0].elements;

    let C: number[][] = new Array(nodes.length);
    for (let i = 0; i < C.length; i++) {
        C[i] = new Array(nodes.length).fill(0);
    }

    for (let i = 0; i < elements.length; i++) {

        let density = getDensityByElement(elements[i][0], blocks_density, inpData.problemData[0].lsets, inpData.problemData[0].sections);
        let capacity = getCapacityByElement(elements[i][0], blocks_capacity, inpData.problemData[0].lsets, inpData.problemData[0].sections);

        let coords: number[][] = [
            [nodes[elements[i][1] - 1][1], [nodes[elements[i][1] - 1][2]]],
            [nodes[elements[i][2] - 1][1], [nodes[elements[i][2] - 1][2]]],
            [nodes[elements[i][3] - 1][1], [nodes[elements[i][3] - 1][2]]]

        ]

        let Ci = getLocalCapacityMatrix(coords, density, capacity);
        C = accumulateToGlobalMatrix(C, Ci, elements[i][1], elements[i][2], elements[i][3]);

    }

    return C;
}

const getLocalCondictivityMatrix = (coords: number[][], Lambda: number) => {

    let J = [
        [coords[0][2] - coords[0][0], coords[1][2] - coords[1][0]],
        [coords[0][1] - coords[0][0], coords[1][1] - coords[1][0]]
    ];

    let Bnat = [
        [-1, 0, 1],
        [-1, 1, 0]
    ];

    let B = MultiplyMatrix(InverseMatrix(J), Bnat);
    return MultiplyMatrix(multiplyMatrixByNumber(transposeMatrix(B), Lambda), multiplyMatrixByNumber(B, Determinant(J) / 2));
}

const calculateTriangleArea = (coordinates: number[][]): number => {
    const [point1, point2, point3] = coordinates;

    const [x1, y1] = point1;
    const [x2, y2] = point2;
    const [x3, y3] = point3;

    const area = 0.5 * Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));

    return area;
}

const getLocalCapacityMatrix = (coords: number[][], density: number, capacity: number): number[][] => {

    let area = calculateTriangleArea(coords);

    return multiplyMatrixByNumber([
        [1 / 6, 1 / 12, 1 / 12],
        [1 / 12, 1 / 6, 1 / 12],
        [1 / 12, 1 / 12, 1 / 6],
    ], density * capacity * area)

}

const accumulateToGlobalMatrix = (globalMatrix: Array<Array<number>>, localMatrix: Array<Array<number>>, i: number, j: number, k: number): Array<Array<number>> => {

    i--
    j--
    k--

    globalMatrix[i][i] += localMatrix[0][0]
    globalMatrix[j][j] += localMatrix[1][1]
    globalMatrix[k][k] += localMatrix[2][2]

    globalMatrix[i][j] += localMatrix[0][1]
    globalMatrix[j][i] += localMatrix[1][0]

    globalMatrix[i][k] += localMatrix[0][2]
    globalMatrix[k][i] += localMatrix[2][0]

    globalMatrix[j][k] += localMatrix[1][2]
    globalMatrix[k][j] += localMatrix[2][1]

    return globalMatrix;
}


export { computeSteadyState, computeTransitive }