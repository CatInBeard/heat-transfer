import PopupContainer from "../popup/PopupContainer";
import s from "./ClosablePopup.module.css"

let ClosablePopupContainer = ({children,cancelAction, headerText="Warning"}) => {
    return <PopupContainer>
            <div className={"toast show " + s.confirm} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <strong className="me-auto">{headerText}</strong>
                    <button type="button" class="btn-close" aria-label="Close" onClick={cancelAction}></button>
                </div>
                <div className={"toast-body " + s.body}>
                    {children}
                </div>
            </div>
        </PopupContainer>;
}

export default ClosablePopupContainer;