import ClosablePopupContainer from "./closablePopup/ClosablePopup";

let MethodHelpComponent = ({ cancelAction }) => {
  return <ClosablePopupContainer focusOnClose={true} cancelAction={cancelAction} headerText="Method select hint">

    Two schemes are currently supported:
    <ul>
      <li>
        Forward Difference (Euler) Scheme. Requires less computational cost, but poor stability
      </li>
      <li>
        Crank-Nicolson Scheme. Requires more computational cost, but has good stability
      </li>
    </ul>

  </ClosablePopupContainer>;
}

export default MethodHelpComponent;