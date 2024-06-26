import ClosablePopupContainer from "./closablePopup/ClosablePopup";

let LoadFromLibrary = ({ cancelAction, confirmAction }) => {

    const fixturesInpFileNames = [
        "200-elem.inp",
        "760-elem.inp",
        "1720-elem.inp",
        "6651-elem.inp"
    ]

    const remoteLib = [
        // {name: "test", path:"https://raw.githubusercontent.com/CatInBeard/heat-transfer/main/fixtures/inp/13-elem.inp"}
    ]

    const selectFile = (event) => {
        const filePath = event.target.getAttribute('data-file-path');
        event.preventDefault();
        confirmAction(filePath)

    }

    let filesChoseList = fixturesInpFileNames.map( (fileName) => {
        return <div className="p-1">
        <a href="#" onClick={selectFile} data-file-path={"./fixtures/inp/" + fileName}>{fileName}</a>
        </div>
    })
   
    filesChoseList.push(...remoteLib.map( (element) => {
        return <div className="p-1">
        <a href="#" onClick={selectFile} data-file-path={element.path}>{element.name}</a>
        </div>
    }))

    return (
        <ClosablePopupContainer cancelAction={cancelAction} headerText={"Select *.inp file from library"} >
            {filesChoseList}
        </ClosablePopupContainer>
    )

}

export default LoadFromLibrary;