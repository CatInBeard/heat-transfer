import { transposeMatrix, MultiplyMatrix, solveLinearEquationSystem, multiplyMatrixByNumber } from "./matrix.tsx";
import { Nset, Lset, Section, TemperatureBC } from "./inpParse"


const computeSteadyState = (inpData, temperature_BC, blocks_termal_conductivity) => {

    let K = getConductivityMatrix(inpData, blocks_termal_conductivity);

    K = applyTemperatureBC(K, inpData);

    let F = getTermalForcesFromBC(inpData, temperature_BC);

    let temperatures = solveLinearEquationSystem(K,F);

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
            F[node- 1] = BC.temperature;
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
                // K[i][node - 1] = 0
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

const getConductivityMatrix = (inpData, blocks_termal_conductivity): Array<Array<number>> => {

    let nodes = inpData.problemData[0].nodes;
    let elements = inpData.problemData[0].elements;

    let globalCondictivityMatrix = Array(nodes.length)
    for (let i = 0; i < nodes.length; i++) {
        globalCondictivityMatrix[i] = Array(nodes.length)
        for (let j = 0; j < nodes.length; j++) {
            globalCondictivityMatrix[i][j] = 0;
        }
    }
    
    for (let i = 0; i < elements.length; i++) {

        let element: Array<number> = elements[i];

        let Xi: number = nodes[element[1] - 1][1];
        let Yi: number = nodes[element[1] - 1][2];
        let Xj: number = nodes[element[2] - 1][1];
        let Yj: number = nodes[element[2] - 1][2];
        let Xk: number = nodes[element[3] - 1][1];
        let Yk: number = nodes[element[3] - 1][2];

        let area: number = 0.5 * Math.abs(Xi * (Yj - Yk) + Xj * (Yk - Yi) + Xk * (Yi - Yj))
        
        let Bi: number = Yj - Yk
        let Bj: number = Yk - Yi
        let Bk: number = Yi - Yj
        let Ci: number = Xk - Xj
        let Cj: number = Xi - Xk
        let Ck: number = Xj - Xi

        let gradientMatrix: Array<Array<number>> = [[Bi, Bj, Bk], [Ci, Cj, Ck]]

        

        let conductivity = getConductivityByElement(element[0], blocks_termal_conductivity, inpData.problemData[0].lsets, inpData.problemData[0].sections);

        

        let materialPropertiesMatrix = [[conductivity, 0], [0, conductivity]]

        

        let localCondictivityMatrix: Array<Array<number>> = multiplyMatrixByNumber(
            MultiplyMatrix(
                MultiplyMatrix(
                    transposeMatrix(gradientMatrix),
                    materialPropertiesMatrix
                ),
                gradientMatrix
            ),
             0.25 * area
        )
        

        globalCondictivityMatrix = accumulateToGlobalMatrix(globalCondictivityMatrix, localCondictivityMatrix, element[1], element[2], element[3])


    }
    return globalCondictivityMatrix;
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


export { computeSteadyState }