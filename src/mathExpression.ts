import {parseCSV, interpolateMap} from "./table"


const evaluateMathExpression = (expression: string, t: number): number => {

    const lines = expression.split("\n");

    if(lines.length > 2 && lines[0].includes(",")){
        const tableData = parseCSV(expression)        
        const value = interpolateMap(tableData, t);

        return value
    }

    expression = expression.replace(/t\^(\d+)/g, 'Math.pow(t, $1)');
    expression = expression.replace(/sin/g, 'Math.sin');
    expression = expression.replace(/cos/g, 'Math.cos');

    const result: number = eval(expression);

    
    return result;
}

export {evaluateMathExpression};