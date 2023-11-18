class InpParsingError extends Error {
    constructor(message: string = "Parsing .inp error") {
        super(message);
        this.name = 'InpParsingError';
    }
}

type partProblem = {
    name: string,
    nodes: Array<Array<number>>
}

const parseInpText = (inpTextData: string) => {

    let inpDataLines: Array<string> = clearCR(inpTextData).split("\n");

    let inpData = [];
    inpData["heading"] = getHeadings(inpDataLines);
    inpData["problemData"] = getProblemData(inpDataLines);

    return inpData;
}

const clearCR = (text: string): string => {
    return text.replace(/\r/g, "");
}

const getHeadings = (inpDataLines: Array<string>) => {

    checkHeading(inpDataLines);

    const lines = findHeadingLines(inpDataLines);
    const { jobName, modelName } = getJobAndModelName(inpDataLines, lines.jobNameLine);
    const generatedBy = getGeneratedBy(inpDataLines, lines.generatedByLine);

    return { jobName: jobName, modelName: modelName, generatedBy: generatedBy }
}

const checkHeading = (inpDataLines: Array<string>) => {
    if (!inpDataLines[0].startsWith("*Heading")) {
        throw new InpParsingError("Heading is not defined");
    }
}

const findHeadingLines = (inpDataLines: Array<string>) => {
    let inpDataLinesCount: number = inpDataLines.length;
    let jobNameLine: number = 0;
    let generatedByLine: number = 0;

    for (let i = 0; i < inpDataLinesCount; i++) {
        if (inpDataLines[i].startsWith("** Job name:")) {
            jobNameLine = i;
        }
        if (inpDataLines[i].startsWith("** Generated by:")) {
            generatedByLine = i;
        }

        if (jobNameLine != 0 && generatedByLine != 0) {
            break;
        }
    }

    if (jobNameLine == 0 || generatedByLine == 0) {
        throw new InpParsingError("Heading parsing error");
    }

    return { jobNameLine: jobNameLine, generatedByLine: generatedByLine }
}

const getJobAndModelName = (inpDataLines: Array<string>, jobNameLine: number) => {

    const regex: RegExp = /Job name: (.*?) Model name: (.*?)$/;
    const matches: RegExpMatchArray | null = inpDataLines[jobNameLine].match(regex);

    if (matches && matches.length === 3) {
        var jobName: string = matches[1];
        var modelName: string = matches[2];
    } else {
        throw new InpParsingError("Job name or model name not found!");
    }
    return { jobName: jobName, modelName: modelName }
}

const getGeneratedBy = (inpDataLines: Array<string>, generatedByLine: number) => {
    const regexGenBy: RegExp = /Generated by: (.*?)$/;

    const match: RegExpMatchArray | null = inpDataLines[generatedByLine].match(regexGenBy);

    if (match && match.length === 2) {
        var generatedBy = match[1];
    } else {
        throw new InpParsingError("Generated by not found");
    }
    return generatedBy;
}

const getProblemData = (inpDataLines: Array<string>): Array<partProblem> => {

    const parts = findParts(inpDataLines);

    let partsProblems: Array<partProblem> = [];

    for (let i: number = 0; i < parts.length; i++) {
        partsProblems.push(parsePartLines(parts[i]));
    }



    return partsProblems
}

const parsePartLines = (part: Array<string>): partProblem => {


    const regexGenBy: RegExp = /Part, name=(.*?)$/;

    const match: RegExpMatchArray | null = part[0].match(regexGenBy);

    if (match && match.length === 2) {
        var partName = match[1];
    } else {
        throw new InpParsingError("Part name not found");
    }

    let nodes: Array<Array<number>> = []

    let nodeParsingFlag = false;


    for (let i = 1; i < part.length; i++) {
        if(part[i].startsWith("*Node")){
            nodeParsingFlag = true;
            continue;
        }
        if(part[i].startsWith("*Element")){
            break;
        }
        if(nodeParsingFlag){
            nodes.push(part[i].split(',').map(num => parseFloat(num.trim())));
            continue;
        }
        

    }

    return { name: partName, nodes: nodes };
}

const findParts = (inpDataLines: Array<string>): Array<Array<string>> => {

    let parts: Array<Array<string>> = [];

    let inpDataLinesCount: number = inpDataLines.length;

    let partsStart: number = inpDataLines.findIndex((line: string) => {
        return line.startsWith("** PARTS");
    });

    if (partsStart == -1) {
        throw new InpParsingError("PARTS section not found");
    }

    let currentPart: number = 0;

    for (let i = partsStart; i < inpDataLinesCount; i++) {
        let line: string = inpDataLines[i];
        if (line.startsWith("*Part")) {
            parts.push([line])
            continue
        }
        if (line.startsWith("*End Part")) {
            currentPart++;
            continue
        }

        if (parts.length > currentPart)
            parts[currentPart].push(line);

    }

    return parts;

}

export { parseInpText, InpParsingError }