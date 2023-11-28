type LU = {
    lower: number[][],
    upper: number[][]
}

const transposeMatrix = (matrix: number[][]): number[][] => {
    let transposedMatrix: number[][] = [];

    for (let i = 0; i < matrix[0].length; i++) {
        transposedMatrix[i] = [];
        for (let j = 0; j < matrix.length; j++) {
            transposedMatrix[i].push(matrix[j][i]);
        }
    }

    return transposedMatrix;
}

const SumMatrix = (A: number[][], B: number[][]): number[][] => {

    let C = new Array(A[0].length);

    for (let i = 0; i < A.length; i++) {
        C[i] = new Array(A[0].length);
        for (let j = 0; j < A[0].length; j++) {
            C[i][j] = A[i][j] + B[i][j];
        }
    }

    return C;
}

const MultiplyMatrix = (A: number[][], B: number[][]): number[][] => {
    const rows1 = A.length;
    const cols1 = A[0].length;
    const cols2 = B[0].length;

    if (cols1 !== B.length) {
        throw new Error("The number of columns in the first matrix must match the number of rows in the second matrix.");
    }

    const C: number[][] = [];

    for (let i = 0; i < rows1; i++) {
        C[i] = [];
        for (let j = 0; j < cols2; j++) {
            let sum = 0;
            for (let k = 0; k < cols1; k++) {
                sum += A[i][k] * B[k][j];
            }
            C[i][j] = sum;
        }
    }

    return C;
}

const multiplyMatrixByNumber = (matrix: number[][], number: number): number[][] => {
    const rows = matrix.length;
    const cols = matrix[0].length;

    const result: number[][] = [];

    for (let i = 0; i < rows; i++) {
        result[i] = [];
        for (let j = 0; j < cols; j++) {
            result[i][j] = matrix[i][j] * number;
        }
    }

    return result;
}

const InverseMatrix = (A: number[][]) => { // LU inverse matrix
    if (A.length != A[0].length) {
        throw new Error("The matrix is not square");
    }

    const n = A.length;
    const identity = Array(n);
    const inverse = Array(n);

    for (let i = 0; i < n; i++) {
        identity[i] = [];
        inverse[i] = [];
        for (let j = 0; j < n; j++) {
            identity[i][j] = (i === j) ? 1 : 0;
            inverse[i][j] = 0;
        }
    }

    let LU = luDecomposition(A);

    for (let k = 0; k < n; k++) {
        const y = Array(n);
        const b = Array(n);
        for (let i = 0; i < n; i++) {
            y[i] = 0;
            b[i] = identity[i][k];
            for (let j = 0; j < i; j++) {
                y[i] += (LU.lower[i][j] * y[j]);
            }
            y[i] = (b[i] - y[i]) / LU.lower[i][i];
        }
        for (let i = n - 1; i >= 0; i--) {
            inverse[i][k] = y[i];
            for (let j = i + 1; j < n; j++) {
                inverse[i][k] -= (LU.upper[i][j] * inverse[j][k]);
            }
            inverse[i][k] = inverse[i][k] / LU.upper[i][i];
        }
    }

    return inverse;

}

const luDecomposition = (matrix: number[][]): LU => {
    const n = matrix.length;
    const lower = Array(n);
    const upper = Array(n);

    for (let i = 0; i < n; i++) {
        lower[i] = [];
        upper[i] = [];
        for (let j = 0; j < n; j++) {
            lower[i][j] = 0;
            upper[i][j] = 0;
        }
    }

    for (let i = 0; i < n; i++) {
        for (let k = i; k < n; k++) {
            let sum = 0;
            for (let j = 0; j < i; j++) {
                sum += (lower[i][j] * upper[j][k]);
            }
            upper[i][k] = matrix[i][k] - sum;
        }

        for (let k = i; k < n; k++) {
            if (i === k) {
                lower[i][i] = 1;
            } else {
                let sum = 0;
                for (let j = 0; j < i; j++) {
                    sum += (lower[k][j] * upper[j][i]);
                }
                lower[k][i] = (matrix[k][i] - sum) / upper[i][i];
            }
        }
    }

    return { lower: lower, upper: upper };
}

const solveLinearEquationSystem = (A: number[][], b: number[]): number[] => {
    const LU = luDecomposition(A);
    const n = A.length;
    const y: number[] = [];
    const x: number[] = [];

    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
            sum += LU.lower[i][j] * y[j];
        }
        y[i] = (b[i] - sum) / LU.lower[i][i];
    }

    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += LU.upper[i][j] * x[j];
        }
        x[i] = (y[i] - sum) / LU.upper[i][i];
    }

    return x;
}



export { transposeMatrix, SumMatrix, MultiplyMatrix, InverseMatrix, multiplyMatrixByNumber, solveLinearEquationSystem }