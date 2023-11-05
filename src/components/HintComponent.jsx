import ClosablePopupContainer from "./closablePopup/ClosablePopup";

let hintComponent = ({cancelAction}) => {
    return <ClosablePopupContainer cancelAction={cancelAction} headerText="File format hint">
        
        <ol> 
            <li>
                Nodes coordinates must come after
                "*Node" and end up with a "*Element, type=DC2D3"<br/>
                Example:<br/>
                *Node<br/>
                1, 5.05000019, 31.1499996<br/>
                2, 5.05000019, 33.6499977<br/>
                3, 7.05000019, 33.6499977<br/>
                4, 7.05000019, 31.1499996
                <hr style={{border: 'dotted'}} />
                *Element, type=DC2D3
            </li>
            <li>
                Nodes elements must come after 
                "*Element, type=DC2D3" and end up with a
                "*Nset, nset=Concrete-1"<br/>
                Example:<br/>
                *Element, type=DC2D3<br/>
                1, 144, 123, 47<br/>
                2, 130, 97, 46<br/>
                3, 114, 64, 24<br/>
                4, 146, 114, 86
                <hr style={{border: 'dotted'}} />
                *Nset, nset=Concrete-1
            </li>
            <li>
                1st material nodes must come after
                "*Elset, elset=Concrete-1, generate"
                and end up with
                anything<br/>
                Example:<br/>
                *Elset, elset=Concrete-1, generate<br/>
                1, 300, 1
            </li>
            <li>
                2nd material nodes must come after
                "*Elset, elset=Concrete-2, generate"
                and end up with
                anything<br/>
                Example:<br/>
                *Elset, elset=Concrete-2, generate<br/>
                301, 335, 1
            </li>
            <li>
                Water temperature must come after
                "*Nset, nset=T_water"
                and end up with a
                "*Nset, nset=T_air"<br/>
                Example:<br/>
                *Nset, nset=T_water<br/>
                13, 14, 46, 47, 48, 49, 50, 51, 52, 53<br/>
                *Nset, nset=T_air
            </li>
            <li>
                "*Nset, nset=T_air"
                and end up with any
                word<br/>
                Example:<br/>
                *Nset, nset=T_air<br/>
                10, 11, 12, 27, 42, 43, 44, 45, 72, 73, 74, 75, 76, 77, 78<br/>
                Air temperature must come after
                *Nset, nset=T_gallery
            </li>
        </ol>
    </ClosablePopupContainer>;
}

export default hintComponent;