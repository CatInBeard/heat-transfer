import ClosablePopupContainer from "./closablePopup/ClosablePopup";

let PreStepHelpComponent = ({ cancelAction }) => {
  return <ClosablePopupContainer focusOnClose={true} cancelAction={cancelAction} headerText="Pre step help">

  The initial temperature of an object can be set as a number for the entire object. In reality, the object is already heated and has a temperature distribution. The pre-step allows to heat the body with average temperatures from the boundary conditions.<br/>
  For heating, a large pitch is used for the well-stable Crank-Nicholson method. The default is 5 steps of 10000 time units, but in your application you may need to adjust the values yourself

  </ClosablePopupContainer>;
}

export default PreStepHelpComponent;