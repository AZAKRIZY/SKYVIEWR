

import { FlightList } from "./components/FlightList";
import {SearchForm}  from "./components/SearchForm";

function App() {
  return( 
  <div className="bg-main-200 h-screen">
  <h1 className="md:text-3xl text-4xl font-bold text-center md:text-left m-6 md:m-2 text-main-900">Skyviewr</h1>
  <SearchForm/>  
  <FlightList/>
  </div>
  )
}
export default App;
