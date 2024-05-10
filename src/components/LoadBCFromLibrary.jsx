import ClosablePopupContainer from "./closablePopup/ClosablePopup";

let LoadBCFromLibrary = ({ cancelAction, confirmAction }) => {

    const fixturesBCCSVFileNames = [
        "nevada2023.csv",
    ]

    const remoteLib = [
        // {name: "test", path:"https://raw.githubusercontent.com/CatInBeard/heat-transfer/main/fixtures/bc_csv/nevada2023.csv"}
    ]

    const selectFile = (event) => {
        const filePath = event.target.getAttribute('data-file-path');
        event.preventDefault();
        confirmAction(filePath)

    }

    let filesChoseList = fixturesBCCSVFileNames.map( (fileName) => {
        return <div className="p-1">
        <a href="#" onClick={selectFile} data-file-path={"./fixtures/bc_csv/" + fileName}>{fileName}</a>
        </div>
    })
   
    filesChoseList.push(...remoteLib.map( (element) => {
        return <div className="p-1">
        <a href="#" onClick={selectFile} data-file-path={element.path}>{element.name}</a>
        </div>
    }))

    return (
        <ClosablePopupContainer cancelAction={cancelAction} headerText={"Select *.csv file from library"} >
            {filesChoseList}
        </ClosablePopupContainer>
    )

}

export default LoadBCFromLibrary;