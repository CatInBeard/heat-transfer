import inputStyle from "../style/input.module.css"

const SectionSettings = ({inpData, blocksVisibility, blocks_termal_conductivity, blocks_specific_heat, blocks_density, toggleBlock, isTransitive, onBlockDensityChange, onBlockSpecificHeatChange, onBlockConductivityChange}) => {
    return <>
      {inpData.problemData[0].sections.map((section) => {

        let block_visibility = !blocksVisibility[section.name]
        let block_termal_conductivity = blocks_termal_conductivity[section.name];
        let block_specific_heat = blocks_specific_heat[section.name];
        let block_density = blocks_density[section.name];
        let Button = block_visibility ? <button onClick={toggleBlock} data-section-name={section.name} className='btn btn-success'><nobr data-section-name={section.name}>Show</nobr></button> :
          <button onClick={toggleBlock} data-section-name={section.name} className='btn btn-danger'><nobr data-section-name={section.name}>Hide</nobr></button>


        let transitivePart = isTransitive ? <>
          <div className='p-2 form-group row'>
            <div className="row">
              <div className='col'>
                &rho;
              </div>
              <div className="col">
                <input data-section-name={section.name} min={0} value={block_density} onChange={onBlockDensityChange} type='number' className={'form-control ' + inputStyle.inputMinSizeLarge}></input>
              </div>
              <div className='col'>
                <label>kg/m<sup>3</sup></label>
              </div>
            </div>
          </div>
          <div className='p-2 form-group row'>
            <div className="row">
              <div className='col'>
                <label>C</label>
              </div>
              <div className="col">
                <input data-section-name={section.name} min={0} value={block_specific_heat} onChange={onBlockSpecificHeatChange} type='number' className={'form-control ' + inputStyle.inputMinSizeLarge}></input>
              </div>
              <div className='col'>
                <label>J/kg°С</label>
              </div>
            </div>
          </div>
        </> :
          <></>

        return <>
          <div className='p-2' key={section.name}>
            <div className="row">
              <div className="col">
                {section.name}:
              </div>
              <div className="col">
                {Button}
              </div>
            </div>
          </div>
          <div className='p-2 form-group row'>
            <div className="row">
              <div className='col'>
                <label>P</label>
              </div>
              <div className="col">
                <input data-section-name={section.name} min={0} value={block_termal_conductivity} onChange={onBlockConductivityChange} type='number' className={'form-control ' + inputStyle.inputMinSizeLarge}></input>
              </div>
              <div className='col'>
                <label>W/mK</label>
              </div>
            </div>
          </div>
          {transitivePart}
        </>
      }
      )}</>
}

export default SectionSettings