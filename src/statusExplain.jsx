const getStatusText = (status) => {

    switch(status){
        case "waiting":
            return "Waiting .inp file"
        case "loading":
            return "Loading .inp file"
        case "ready":
            return "Ready to compute"
        case "computing":
            return "Computing, please wait"
        case "computed":
            return "Computing finished"
        default:
            return "Error"
    }

}

export {getStatusText}