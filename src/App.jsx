import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux'
import { setHeatTranserStatus } from './store/reducers/values.jsx'

function App() {
  const heat_transfer_status_text = useSelector((state) => state.values.heat_transfer_status_text)
  const status = 'Press start'
  return (
    <div className="container-lg mt-3">
      <h1>{heat_transfer_status_text} heat transfer</h1>
      <canvas id="canvas" width={1200} height={500}></canvas>
      <div className='d-flex align-items-baseline'>
        <div className='p-2 d-flex flex-column'>
          <div className='p-2'>
            Сhange thermal conductivity coefficient
          </div>
          <div className='p-2'>
            <div className="row">
              <div className="col">
                First block:
              </div>
              <div className="col">
                <button className='btn btn-success'><nobr>Show</nobr></button>
              </div>
              <div className="col">
                <button className='btn btn-danger'>Hide</button>
              </div>
            </div>
          </div>
          <div className='p-2 form-group row'>
            <div className="row">
              <div className="col">
                <input type='number' className='form-control' name="coefB1" id="coefB1"></input>
              </div>
              <div className='col'>
              <label for="coefB1">W/mK</label>
              </div>
            </div>
          </div>
          <div className='p-2'>
            <div className="row">
              <div className="col">
                <nobr>Second block:</nobr>
              </div>
              <div className="col">
                <button className='btn btn-success'><nobr>Show</nobr></button>
              </div>
              <div className="col">
                <button className='btn btn-danger'>Hide</button>
              </div>
            </div>
          </div>
          <div className='p-2 form-group'>
            <div className="row">
              <div className="col">
                <input type='number' className='form-control' name="coefB1" id="coefB1"></input>
              </div>
              <div className='col'>
              <label for="coefB1">W/mK</label>
              </div>
            </div>
          </div>
        </div>
        <div className='p-2 d-flex flex-column'>
          <div className='p-2'>
            Change temperature
          </div>
          <div className='p-2 form-group'>
            <div className="row">
              <div className='col'>
              <label for="coefB1">Water:</label>
              </div>
              <div className="col">
                <input type='number' className='form-control' name="coefB1" id="coefB1"></input>
              </div>
            </div>
          </div>
          <div className='p-2 form-group'>
            <div className="row">
              <div className='col'>
              <label for="coefB1">Air:</label>
              </div>
              <div className="col">
                <input type='number' className='form-control' name="coefB1" id="coefB1"></input>
              </div>
            </div>
          </div>
        </div>
        <div className='p-2 d-flex flex-column'>
          <div className='p-2'>Load data</div>
          <div className='p-2 form-group'>
            <div className="row">
              <div className="col">
                <input type='file' className='form-control'></input>
              </div>
              <div className="col">
                <button className='btn btn-primary'>Hint</button>
              </div>
            </div>
          </div>
          <div className='p-2'>Status: <b>{status}</b></div>
          <div className='p-2'>
            <button className='btn btn-lg btn-primary'>Start</button>  
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;
