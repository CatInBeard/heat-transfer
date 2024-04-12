const getStatusText = (status, state_type, progress) => {

    switch(status){
        case "waiting":
            return "Waiting .inp file"
        case "loading":
            return "Loading .inp file"
        case "ready":
            return "Ready to compute"
        case "computing":
            if(state_type == "transitive"){
                return "Computing, please wait, progress " + progress + "%"    
            }
            return "Computing, please wait"
        case "computed":
            return "Computing finished"
        default:
            return "Error"
    }

}

export {getStatusText}