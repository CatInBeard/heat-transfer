import ClosablePopupContainer from "./closablePopup/ClosablePopup";

let ErrorComponent = ( {closeAction, title, text} ) => {


    return (
        <ClosablePopupContainer type="danger" cancelAction={closeAction} headerText= {title} >
                {text}
        </ClosablePopupContainer>
    )

}

export default ErrorComponent;