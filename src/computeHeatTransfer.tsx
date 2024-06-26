import { transposeMatrix, MultiplyMatrix, MultiplyMatrixByVector, SumVector, multiplyVectorByNumber, solveLinearEquationSystem, multiplyMatrixByNumber, InverseMatrix, Determinant, InverseMatrixLU, SumMatrix } from "./matrix";
import { Nset, Lset, Section, TemperatureBC, TemperatureBCTransitive } from "./inpParse"
import { evaluateMathExpression } from "./mathExpression"
import { cloneDeep } from 'lodash';

const calculateAverageBC = (
    expression: string,
    startTime: number,
    endTime: number,
    interval: number = 0.01
): number => {
    let sum = 0;
    let count = 0;

    for (let t = startTime; t <= endTime; t += interval) {
        const value = evaluateMathExpression(expression.toString(), t);
        sum += value;
        count++;
    }

    return sum / count;
};


const computeTransitive = (inpData, temperature_BC, blocks_termal_conductivity, blocks_density, blocks_capacity, progress_callback, initialTemp = 0, timeStep = 0.1, steps = 500, method = "forward", initialTempArray = null) => {


    let freq = 1 / timeStep;

    let K: number[][] = getConductivityMatrixTransitive(inpData, blocks_termal_conductivity);

    let C: number[][] = getCapacityMatrix(inpData, blocks_density, blocks_capacity);

    let KForF = applyTemperatureBCToKTransitive(K, inpData);


    let F: number[] = getFForTransitive(KForF, inpData);

    K = cloneDeep(KForF)

    K = applyTemperatureBCToKTransitiveStep2(K, inpData);


    if (progress_callback === null) {
        progress_callback = (progress, data) => {
            console.log("progress: " + progress + "%")
        }
    }

    let temperaturePrevStep: number[] = [];
    let temperatureCurrentStep: number[] = [];

    if (initialTempArray === null) {
        for (let i = 0; i < F.length; i++) {
            temperaturePrevStep.push(initialTemp);
        }
    }
    else {
        temperaturePrevStep = initialTempArray;
    }
    temperaturePrevStep = fixTemperatureFromBC(temperaturePrevStep, inpData, temperature_BC)

    let temperatureFrames: number[][] = [];

    temperatureFrames.push(temperaturePrevStep);


    switch (method) {
        case "crank-nicolson":
            cracnNicolsonSolve(steps, KForF, inpData, C, freq, K, temperaturePrevStep, F, temperatureCurrentStep, temperature_BC, temperatureFrames, progress_callback, timeStep);
            break;
        default:
            forwardEulerTransitiveSolve(steps, KForF, inpData, C, freq, K, temperaturePrevStep, F, temperatureCurrentStep, temperature_BC, temperatureFrames, progress_callback, timeStep);
    }

    return temperatureFrames;

}

const forwardEulerTransitiveSolve = (steps, KForF, inpData, C, freq, K, temperaturePrevStep, F, temperatureCurrentStep, temperature_BC, temperatureFrames, progress_callback, timeStep) => {

    let progress = 0;

    let realTime = 0;

    for (let t = 0; t < steps; t++) {

        F = getFForTransitive(KForF, inpData, realTime);

        let A = multiplyMatrixByNumber(C, freq)
        let b = SumVector(
            SumVector(F, multiplyVectorByNumber(
                MultiplyMatrixByVector(K, temperaturePrevStep), -1)),
            multiplyVectorByNumber(
                MultiplyMatrixByVector(C, temperaturePrevStep), freq))
        let Temperature = solveLinearEquationSystem(A, b)

        temperatureCurrentStep = fixTemperatureFromBC(Temperature, inpData, temperature_BC, realTime)

        temperatureCurrentStep = Temperature

        temperatureFrames.push(temperatureCurrentStep);
        temperaturePrevStep = temperatureCurrentStep;

        progress += 100 / steps
        progress_callback(progress, temperatureCurrentStep)
        realTime += timeStep
    }

}

const cracnNicolsonSolve = (steps, KForF, inpData, C, freq, K, temperaturePrevStep, F, temperatureCurrentStep, temperature_BC, temperatureFrames, progress_callback, timeStep) => {

    let progress = 0;

    let realTime = 0;

    let FPrev = cloneDeep(F)

    for (let t = 0; t < steps; t++) {

        F = getFForTransitive(KForF, inpData, realTime);

        let A = SumMatrix(C, multiplyMatrixByNumber(K, timeStep / 2));
        let b = SumVector(
            MultiplyMatrixByVector(
                SumMatrix(
                    C,
                    multiplyMatrixByNumber(
                        K,
                        -1 * timeStep / 2
                    )
                ),
                temperaturePrevStep
            ),
            multiplyVectorByNumber(
                SumVector(FPrev, F),
                timeStep / 2
            )
        )

        let Temperature = solveLinearEquationSystem(A, b)

        temperatureCurrentStep = fixTemperatureFromBC(Temperature, inpData, temperature_BC, realTime)

        temperatureCurrentStep = Temperature

        temperatureFrames.push(temperatureCurrentStep);
        temperaturePrevStep = temperatureCurrentStep;

        progress += 100 / steps
        progress_callback(progress, temperatureCurrentStep)
        realTime += timeStep
        FPrev = cloneDeep(F)
    }

}


const computeSteadyState = (inpData, temperature_BC, blocks_termal_conductivity) => {

    let K = getConductivityMatrix(inpData, blocks_termal_conductivity);

    K = applyTemperatureBC(K, inpData);

    let F = getTermalForcesFromBC(inpData, temperature_BC);

    let temperatures = fixTemperatureFromBC(solveLinearEquationSystem(K, F), inpData, temperature_BC);

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
            }
            K[node - 1][node - 1] = 1
        })
    });


    return K;
}

const applyTemperatureBCToKTransitive = (K: Array<Array<number>>, inpData): Array<Array<number>> => {

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
                if (i != node - 1) {
                    K[node - 1][i] = 0
                }
            }
        })
    });

    return K;
}

const applyTemperatureBCToKTransitiveStep2 = (K: Array<Array<number>>, inpData): Array<Array<number>> => {

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
                if (i != node - 1) {
                    K[i][node - 1] = 0
                }
            }
        })
    });

    return K;
}

const getFForTransitive = (K: Array<Array<number>>, inpData, t: number = 0): number[] => {
    let F: number[] = [];

    for (let i = 0; i < K.length; i++) {
        F.push(0);
    }

    inpData.steps[0].boundaries.temperature.forEach((temperature: TemperatureBCTransitive) => {
        let setName = temperature.setName
        let nset: Nset | undefined = inpData.assembly.nsets.find((nset: Nset) => {
            return nset.setname == setName;
        });
        if (!nset) {
            throw new Error("Nset not found");
        }


        let temp = evaluateMathExpression(temperature.temperature.toString(), t);

        nset.nodes.forEach((node) => {
            F[node - 1] = K[node - 1][node - 1] * temp;
        })
    });

    inpData.steps[0].boundaries.temperature.forEach((temperature: TemperatureBCTransitive) => {
        let setName = temperature.setName
        let nset: Nset | undefined = inpData.assembly.nsets.find((nset: Nset) => {
            return nset.setname == setName;
        });
        if (!nset) {
            throw new Error("Nset not found");
        }


        let temp = evaluateMathExpression(temperature.temperature.toString(), t);

        nset.nodes.forEach((node) => {
            for (let i = 0; i < F.length; i++) {
                if (i != node - 1) {
                    F[i] -= K[i][node - 1] * temp;
                }
            }
        })
    });


    return F;
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


const getConductivityMatrixTransitive = (inpData, blocks_termal_conductivity) => {
    let nodes = inpData.problemData[0].nodes;
    let elements = inpData.problemData[0].elements;

    let K: number[][] = new Array(nodes.length);
    for (let i = 0; i < K.length; i++) {
        K[i] = new Array(nodes.length).fill(0);
    }

    for (let i = 0; i < elements.length; i++) {

        let conductivity = getConductivityByElement(elements[i][0], blocks_termal_conductivity, inpData.problemData[0].lsets, inpData.problemData[0].sections);

        let conductivityMatrix = [[conductivity, 0], [0, conductivity]]


        let Xi = nodes[elements[i][1] - 1][1];
        let Yi = nodes[elements[i][1] - 1][2];

        let Xj = nodes[elements[i][2] - 1][1];
        let Yj = nodes[elements[i][2] - 1][2];

        let Xk = nodes[elements[i][3] - 1][1];
        let Yk = nodes[elements[i][3] - 1][2];


        let matrix: number[][] = [[1, Xi, Yi], [1, Xj, Yj], [1, Xk, Yk]]
        let invMatrix: number[][] = InverseMatrix(matrix)
        invMatrix.shift()

        let Square = 0.5 * Math.abs(Xi * (Yj - Yk) + Xj * (Yk - Yi) + Xk * (Yi - Yj))

        let K_local = multiplyMatrixByNumber(MultiplyMatrix(MultiplyMatrix(transposeMatrix(invMatrix), conductivityMatrix), invMatrix), Square)


        K = accumulateToGlobalMatrix(K, K_local, elements[i][1], elements[i][2], elements[i][3]);

    }


    return K;

}

function hasAnyNan(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            if (isNaN(array[i][j])) {
                return true;
            }
        }
    }

    return false;
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

const getCapacityMatrix = (inpData, blocks_density, blocks_capacity): Array<Array<number>> => {

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
            [nodes[elements[i][1] - 1][1], nodes[elements[i][1] - 1][2]],
            [nodes[elements[i][2] - 1][1], nodes[elements[i][2] - 1][2]],
            [nodes[elements[i][3] - 1][1], nodes[elements[i][3] - 1][2]]

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

    let Xi = coords[0][0];
    let Yi = coords[0][1];

    let Xj = coords[1][0];
    let Yj = coords[1][1];

    let Xk = coords[2][0];
    let Yk = coords[2][1];

    let square = 0.5 * Math.abs(Xi * (Yj - Yk) + Xj * (Yk - Yi) + Xk * (Yi - Yj))


    return multiplyMatrixByNumber([
        [2, 1, 1],
        [1, 2, 1],
        [1, 1, 2],
    ], density * capacity / 12 * square)

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

const fixTemperatureFromBC = (temperature: number[], inpData, temperature_BC, t: number = 0): number[] => {

    for (let i = 0; i < temperature_BC.length; i++) {
        let BC: TemperatureBCTransitive = temperature_BC[i];

        let nodes: number[] = getNodesByAssemblySetName(BC.setName, inpData);

        let temp = evaluateMathExpression(BC.temperature.toString(), t);

        for (let i = 0; i < nodes.length; i++) {
            let node: number = nodes[i];
            temperature[node - 1] = temp;
        }

    }

    return temperature
}


export { computeSteadyState, computeTransitive, calculateAverageBC }