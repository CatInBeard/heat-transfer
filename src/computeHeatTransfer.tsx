import { transposeMatrix, MultiplyMatrix, MultiplyMatrixByVector, SumVector, multiplyVectorByNumber, solveLinearEquationSystem, multiplyMatrixByNumber, InverseMatrix, Determinant, SumMatrix, frobeniusNorm } from "./matrix.tsx";
import { Nset, Lset, Section, TemperatureBC } from "./inpParse"
import { multiplyMatrixByNumberBig, SumVectorBig, multiplyVectorByNumberBig, MultiplyMatrixByVectorBig, solveLinearEquationSystemBig } from "./bigMatrix.ts"
import Big from 'big.js';


const computeTransitive = (inpData, temperature_BC, blocks_termal_conductivity, blocks_density, blocks_capacity, progress_callback, initialTemp = 0, timeStep = 0.1, steps = 500, useBig = false) => {

    Big.DP = 60;

    let freq = 1 / timeStep;

    let K: number[][] = getConductivityMatrixTransitive(inpData, blocks_termal_conductivity);

    let C: number[][] = getCapacityMatrix(inpData, blocks_density, blocks_capacity);


    K = applyTemperatureBCToKTransitive(K, inpData);


    let F: number[] = getFForTransitive(K, inpData);

    K = applyTemperatureBCToKTransitiveStep2(K, inpData);


    if (progress_callback === null) {
        progress_callback = (progress, data) => {
            console.log("progress: " + progress + "%")
        }
    }

    let temperaturePrevStep: number[] = [];
    let temperatureCurrentStep: number[] = [];

    for (let i = 0; i < F.length; i++) {
        temperaturePrevStep.push(initialTemp);
    }
    temperaturePrevStep = fixTemperatureFromBC(temperaturePrevStep, inpData, temperature_BC)

    let temperatureFrames: number[][] = [];

    temperatureFrames.push(temperaturePrevStep);

    let progress = 0;


    if (useBig) {
        let bigC = floatMatrixToBig(C);
        let bigK = floatMatrixToBig(K);
        let bigFreq = new Big(freq);
        let bigF = floatVectorToBig(F);
        let bigTemperaturePrevStep = floatVectorToBig(temperaturePrevStep);
        let bigTemperatureCurrentStep: Big[] = [];

        for (let t = 0; t < steps; t++) {


            let A = multiplyMatrixByNumberBig(bigC, bigFreq)
            let b = SumVectorBig(
                SumVectorBig(bigF, multiplyVectorByNumberBig(
                    MultiplyMatrixByVectorBig(bigK, bigTemperaturePrevStep), new Big(-1))),
                multiplyVectorByNumberBig(
                    MultiplyMatrixByVectorBig(bigC, bigTemperaturePrevStep), bigFreq))

            let Temperature = solveLinearEquationSystemBig(A, b)

            bigTemperatureCurrentStep = fixTemperatureFromBCBig(Temperature, inpData, temperature_BC)

            let vector = BigVectorToFloat(bigTemperatureCurrentStep)
            temperatureFrames.push(vector);
            bigTemperaturePrevStep = bigTemperatureCurrentStep;

            progress += 100 / steps
            progress_callback(progress, vector)
        }
    }
    else {
        for (let t = 0; t < steps; t++) {


            let A = multiplyMatrixByNumber(C, freq)
            let b = SumVector(
                SumVector(F, multiplyVectorByNumber(
                    MultiplyMatrixByVector(K, temperaturePrevStep), -1)),
                multiplyVectorByNumber(
                    MultiplyMatrixByVector(C, temperaturePrevStep), freq))

            let Temperature = solveLinearEquationSystem(A, b)

            temperatureCurrentStep = fixTemperatureFromBC(Temperature, inpData, temperature_BC)

            temperatureFrames.push(temperatureCurrentStep);
            temperaturePrevStep = temperatureCurrentStep;

            progress += 100 / steps
            progress_callback(progress, temperatureCurrentStep)
        }
    }


    return temperatureFrames;

}


const computeSteadyState = (inpData, temperature_BC, blocks_termal_conductivity) => {

    let K = getConductivityMatrix(inpData, blocks_termal_conductivity);

    K = applyTemperatureBC(K, inpData);

    let F = getTermalForcesFromBC(inpData, temperature_BC);

    let temperatures = fixTemperatureFromBC(solveLinearEquationSystem(K, F), inpData, temperature_BC);

    return temperatures

}

const floatVectorToBig = (F: number[]): Big[] => {
    let bigF: Big[] = [];
    for (let i = 0; i < F.length; i++) {
        bigF[i] = new Big(F[i]);
    }
    return bigF;
}

const BigVectorToFloat = (bigF: Array<Big>): number[] => {
    let F: number[] = [];
    for (let i = 0; i < bigF.length; i++) {
        F[i] = bigF[i].toNumber()
    }
    return F;
}

const floatMatrixToBig = (A: number[][]): Big[][] => {
    let bigA: Big[][] = [];
    for (let i = 0; i < A.length; i++) {
        bigA[i] = [];
        for (let j = 0; j < A.length; j++) {
            bigA[i][j] = new Big(A[i][j]);
        }
    }
    return bigA;
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

const getFForTransitive = (K: Array<Array<number>>, inpData): number[] => {
    let F: number[] = [];

    for (let i = 0; i < K.length; i++) {
        F.push(0);
    }


    inpData.steps[0].boundaries.temperature.forEach((temperature: TemperatureBC) => {
        let setName = temperature.setName
        let nset: Nset | undefined = inpData.assembly.nsets.find((nset: Nset) => {
            return nset.setname == setName;
        });
        if (!nset) {
            throw new Error("Nset not found");
        }

        nset.nodes.forEach((node) => {
            F[node - 1] = K[node - 1][node - 1] * temperature.temperature;
            for (let i = 0; i < F.length; i++) {
                if (i != node - 1) {
                    F[i] -= K[i][node - 1] * temperature.temperature;
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


        let Bi: number = Yj - Yk;
        let Bj: number = Yk - Yi;
        let Bk: number = Yi - Yj;
        let Ci: number = Xk - Xj;
        let Cj: number = Xi - Xk;
        let Ck: number = Xj - Xi;

        let Square = 0.5 * Math.abs(Xi * (Yj - Yk) + Xj * (Yk - Yi) + Xk * (Yi - Yj))

        let B: number[][] = [[Bi, Bj, Bk], [Ci, Cj, Ck]];

        let Ki = multiplyMatrixByNumber(MultiplyMatrix(MultiplyMatrix(transposeMatrix(B), conductivityMatrix), B), 1 / 4 * Square)

        K = accumulateToGlobalMatrix(K, Ki, elements[i][1], elements[i][2], elements[i][3]);

    }

    return K;

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

const fixTemperatureFromBC = (temperature: number[], inpData, temperature_BC): number[] => {

    for (let i = 0; i < temperature_BC.length; i++) {
        let BC: TemperatureBC = temperature_BC[i];

        let nodes: number[] = getNodesByAssemblySetName(BC.setName, inpData);

        for (let i = 0; i < nodes.length; i++) {
            let node: number = nodes[i];
            temperature[node - 1] = BC.temperature;
        }

    }

    return temperature
}

const fixTemperatureFromBCBig = (temperature: Big[], inpData, temperature_BC): Big[] => {

    for (let i = 0; i < temperature_BC.length; i++) {
        let BC: TemperatureBC = temperature_BC[i];

        let nodes: number[] = getNodesByAssemblySetName(BC.setName, inpData);

        for (let i = 0; i < nodes.length; i++) {
            let node: number = nodes[i];
            temperature[node - 1] = new Big(BC.temperature);
        }

    }

    return temperature
}


export { computeSteadyState, computeTransitive }