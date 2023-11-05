import s from "./PopupContainer.module.css"

let PopupContainer = ({children}) => {
    return <>
        <div className={"position-fixed top-50 start-50 translate-middle p-3 " + s.front}>
            {children}
        </div>
        <div className={"position-fixed top-0 start-0 " + s.Background}>
        
        </div>
    </>;
}

export default PopupContainer;