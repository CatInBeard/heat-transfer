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

const SumVector = (A: number[], B: number[]): number[] => {

    let C = new Array(A.length);

    for (let i = 0; i < A.length; i++) {
        C[i] = A[i] + B[i];
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

const MultiplyMatrixByVector = (A: number[][], v: number[]): number[] => {
    const rows = A.length;
    const cols = A[0].length;

    if (cols !== v.length) {
        throw new Error("The number of columns in the matrix must match the length of the vector.");
    }

    const result: number[] = [];

    for (let i = 0; i < rows; i++) {
        let sum = 0;
        for (let j = 0; j < cols; j++) {
            sum += A[i][j] * v[j];
        }
        result[i] = sum;
    }

    return result;
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

const multiplyVectorByNumber = (matrix: number[], number: number): number[] => {

    const result: number[] = [];

    for (let i = 0; i < matrix.length; i++) {
        result[i] = matrix[i] * number;
    }

    return result;
}

function InverseMatrix(matrix: number[][]): number[][] {
    if (!isSquareMatrix(matrix)) {
      throw new Error("Matrix must be square");
    }
  
    const det = calculateDeterminant(matrix);
  
    if (det === 0) {
        throw new Error("Matrix has 0 det");
    }
  
    const cofactors = calculateCofactors(matrix);
    const adjoint = transposeMatrix(cofactors);
  
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        adjoint[i][j] /= det;
      }
    }

    return adjoint;

  
    function isSquareMatrix(matrix: number[][]): boolean {
      const n = matrix.length;
      for (let i = 0; i < n; i++) {
        if (matrix[i].length !== n) {
          return false;
        }
      }
      return true;
    }
  
    function calculateDeterminant(matrix: number[][]): number {
      if (matrix.length === 1) {
        return matrix[0][0];
      }
  
      let det = 0;
      for (let i = 0; i < matrix.length; i++) {
        det +=
          matrix[0][i] *
          calculateDeterminant(
            getSubmatrix(matrix, 0, i)
          ) *
          ((-1) ** i);
      }
      return det;
    }
  
    function calculateCofactors(matrix: number[][]): number[][] {
      const cofactors: number[][] = [];
      for (let i = 0; i < matrix.length; i++) {
        cofactors[i] = [];
        for (let j = 0; j < matrix[i].length; j++) {
          cofactors[i][j] =
            ((-1) ** (i + j)) *
            calculateDeterminant(getSubmatrix(matrix, i, j));
        }
      }
      return cofactors;
    }
  
    function getSubmatrix(matrix: number[][], row: number, col: number): number[][] {
      const submatrix: number[][] = [];
      for (let i = 0; i < matrix.length; i++) {
        if (i === row) continue;
        submatrix.push(matrix[i].filter((_, c) => c != col));
      }
      return submatrix;
    }
  
    function transposeMatrix(matrix: number[][]): number[][] {
      const transposed: number[][] = [];
      for (let i = 0; i < matrix[0].length; i++) {
        transposed[i] = [];
        for (let j = 0; j < matrix.length; j++) {
          transposed[i][j] = matrix[j][i];
        }
      }
      return transposed;
    }
  }
  


const InverseMatrixLU = (A: number[][]) => { // LU inverse matrix
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

const Determinant = (matrix: number[][]): number => {
    if (matrix.length !== matrix[0].length) {
        throw new Error("Matrix must be square");
    }

    if (matrix.length === 1) {
        return matrix[0][0];
    }

    if (matrix.length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    let det = 0;

    for (let i = 0; i < matrix.length; i++) {
        det += matrix[0][i] * cofactor(matrix, 0, i);
    }

    return det;
}

const cofactor = (matrix: number[][], row: number, col: number): number => {
    const subMatrix = matrix.filter((_, r) => r !== row).map(row => row.filter((_, c) => c !== col));
    const sign = (row + col) % 2 === 0 ? 1 : -1;
    
    return sign * Determinant(subMatrix);
}

const frobeniusNorm = (matrix: number[][]): number => {
    let sum = 0;
    
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            sum += matrix[i][j] ** 2;
        }
    }
    
    return Math.sqrt(sum); 
}



export { transposeMatrix, SumMatrix, MultiplyMatrixByVector, multiplyVectorByNumber, SumVector, MultiplyMatrix, InverseMatrix, multiplyMatrixByNumber, solveLinearEquationSystem, Determinant, frobeniusNorm, InverseMatrixLU }