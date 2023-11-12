const getStatusText = (status) => {

    switch(status){
        case "waiting":
            return "Waiting .inp file"
        case "ready":
            return "Ready to compute"
        default:
            return "Error"
    }

}

export {getStatusText}