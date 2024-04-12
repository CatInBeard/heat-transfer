import Big from "big.js";

type LUBig = {
    lower: Big[][],
    upper: Big[][]
}

const multiplyMatrixByNumberBig = (matrix: Big[][], number: Big): Big[][] => {
    const rows = matrix.length;
    const cols = matrix[0].length;

    const result: Big[][] = [];

    for (let i = 0; i < rows; i++) {
        result[i] = [];
        for (let j = 0; j < cols; j++) {
            result[i][j] = matrix[i][j].mul(number);
        }
    }

    return result;
}

const SumVectorBig = (A: Big[], B: Big[]): Big[] => {

    let C = new Array(A.length);

    for (let i = 0; i < A.length; i++) {
        C[i] = A[i].plus(B[i]);
    }

    return C;
}

const multiplyVectorByNumberBig = (matrix: Big[], number: Big): Big[] => {

    const result: Big[] = [];

    for (let i = 0; i < matrix.length; i++) {
        result[i] = matrix[i].mul(number);
    }

    return result;
}

const MultiplyMatrixByVectorBig = (A: Big[][], v: Big[]): Big[] => {
    const rows = A.length;
    const cols = A[0].length;

    if (cols !== v.length) {
        throw new Error("The number of columns in the matrix must match the length of the vector.");
    }

    const result: Big[] = [];

    for (let i = 0; i < rows; i++) {
        let sum =  new Big(0);
        for (let j = 0; j < cols; j++) {
            sum = sum.plus(A[i][j].mul(v[j]));
        }
        result[i] = sum;
    }

    return result;
}

const solveLinearEquationSystemBig = (A: Big[][], b: Big[]): Big[] => {
    const LU = luDecompositionBig(A);
    const n = A.length;
    const y: Big[] = [];
    const x: Big[] = [];

    for (let i = 0; i < n; i++) {
        let sum = new Big(0);
        for (let j = 0; j < i; j++) {
            sum = sum.plus(LU.lower[i][j].mul(y[j]));
        }
        y[i] = (b[i].minus(sum)).div(LU.lower[i][i]);
    }

    for (let i = n - 1; i >= 0; i--) {
        let sum = new Big(0);
        for (let j = i + 1; j < n; j++) {
            sum = sum.plus(LU.upper[i][j].mul(x[j])) ;
        }
        x[i] = (y[i].minus(sum)).div(LU.upper[i][i]);
    }

    return x;
}

const luDecompositionBig = (matrix: Big[][]): LUBig => {
    const n = matrix.length;
    const lower = Array(n);
    const upper = Array(n);

    for (let i = 0; i < n; i++) {
        lower[i] = [];
        upper[i] = [];
        for (let j = 0; j < n; j++) {
            lower[i][j] = new Big(0);
            upper[i][j] = new Big(0);
        }
    }

    for (let i = 0; i < n; i++) {
        for (let k = i; k < n; k++) {
            let sum = new Big(0);
            for (let j = 0; j < i; j++) {
                sum = sum.plus(lower[i][j].mul(upper[j][k]));
            }
            upper[i][k] = matrix[i][k].minus(sum);
        }

        for (let k = i; k < n; k++) {
            if (i === k) {
                lower[i][i] = 1;
            } else {
                let sum = 0;
                for (let j = 0; j < i; j++) {
                    sum += (lower[k][j] * upper[j][i]);
                }
                lower[k][i] = (matrix[k][i].minus(sum)).div(upper[i][i]);
            }
        }
    }

    return { lower: lower, upper: upper };
}

export {multiplyMatrixByNumberBig, SumVectorBig, multiplyVectorByNumberBig, MultiplyMatrixByVectorBig, solveLinearEquationSystemBig}