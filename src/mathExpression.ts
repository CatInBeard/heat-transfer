const evaluateMathExpression = (expression: string, t: number): number => {

    expression = expression.replace(/t\^(\d+)/g, 'Math.pow(t, $1)');
    expression = expression.replace(/sin/g, 'Math.sin');
    expression = expression.replace(/cos/g, 'Math.cos');

    const result: number = eval(expression);

    
    return result;
}

export {evaluateMathExpression};