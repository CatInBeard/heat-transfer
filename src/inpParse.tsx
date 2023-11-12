class InpParsingError extends Error {
    constructor(message: string = "Parsing .inp error") {
        super(message);
        this.name = 'InpParsingError';
    }
}

const parseInpText = (inpTextData: string) => {

    let inpData = [];

    let inpDataLines: Array<string> = clearCR(inpTextData).split("\n");

    inpData["heading"] = getHeadings(inpDataLines);




    return inpData;
}

const clearCR = (text: string) : string => {
    return text.replace(/\r/g, "");
}

const getHeadings = (inpDataLines: Array<string>) => {
    
    if (!inpDataLines[0].startsWith("*Heading")) {
        throw new InpParsingError("Heading is not defined");
    }

    let inpDataLinesCount: number = inpDataLines.length;

    let jobNameLine: number = 0;
    let generatedByLine: number = 0;

    for(let i = 0; i< inpDataLinesCount; i++){
        if(inpDataLines[i].startsWith("** Job name:")){
            jobNameLine = i;
        }
        if(inpDataLines[i].startsWith("** Generated by:")){
            generatedByLine = i;
        }

        if(jobNameLine != 0 && generatedByLine != 0){
            break;
        }
    }
    

    const regex: RegExp = /Job name: (.*?) Model name: (.*?)$/;
    const matches: RegExpMatchArray | null = inpDataLines[jobNameLine].match(regex);

    if (matches && matches.length === 3) {
        var jobName: string = matches[1];
        var modelName: string = matches[2];
    } else {
        throw new Error("Job name or model name not found!");
    }

    const regexGenBy: RegExp = /Generated by: (.*?)$/;

    const match: RegExpMatchArray | null = inpDataLines[generatedByLine].match(regexGenBy);

    if (match && match.length === 2) {
        var generatedBy = match[1];
    } else {
        throw new Error("Generated by not found");
    }

    return { jobName: jobName, modelName: modelName, generatedBy: generatedBy }
}

export { parseInpText, InpParsingError }