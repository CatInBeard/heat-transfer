import PopupContainer from "../popup/PopupContainer";
import s from "./ClosablePopup.module.css"
import { useState, useEffect, useRef } from "react";

let ClosablePopupContainer = ({ children, cancelAction, headerText = "Warning", type="primary", focusOnClose = true}) => {

    const focusRef = useRef(null);

    useEffect(() => {
        if(focusOnClose){
            if (focusRef.current) {
                focusRef.current.focus();
            }
        }
    }, []);

    useEffect(() => {
        const handleKeydown = (event) => {
            if (event.key === 'Escape') {
                cancelAction()
            }
        };

        document.addEventListener('keydown', handleKeydown);

        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    }, []);


    let colorClass = ""

    switch (type) {
        case "danger":
            colorClass = "bg-danger text-white"
            break;
        default:
            colorClass = ""
    }


    return <PopupContainer>
        <div className={"toast show " + s.confirm} role="alert" aria-live="assertive" aria-atomic="true">
            <div className={colorClass + " toast-header"}>
                <strong className="me-auto">{headerText}</strong>
                <button ref={focusRef} type="button" className="btn-close" aria-label="Close" onClick={cancelAction}></button>
            </div>
            <div className={"toast-body " + s.body}>
                {children}
            </div>
        </div>
    </PopupContainer>;
}

export default ClosablePopupContainer;