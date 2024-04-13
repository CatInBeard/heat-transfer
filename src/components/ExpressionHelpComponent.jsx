import ClosablePopupContainer from "./closablePopup/ClosablePopup";

let ExpressionHelpComponent = ({cancelAction}) => {
    return <ClosablePopupContainer focusOnClose={true} cancelAction={cancelAction} headerText="Math expression hint">

      This mathematical expression allows for the substitution of numbers and various operations, including addition, subtraction, multiplication, division, exponentiation, sine, and cosine of an argument. The argument in this case is denoted as 't'. For example, consider the expression: cos(t) + t*2 + sin(t*5) * 3 + t^2 + t^3
      
    </ClosablePopupContainer>;
}

export default ExpressionHelpComponent;