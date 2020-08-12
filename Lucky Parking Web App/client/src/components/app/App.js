import React from "react";
import MainMap from "./Map";
import Geosearch from "./Geosearch";
import Header from "./Header"
import Sidebar from "./Sidebar"
import HeatMap from "./map/HeatMap";

import '../../sass/main.scss';

function App() {
  return (
    <div className="App">
      <Header />
      <Sidebar />
      <Geosearch />
      {/* <MainMap /> */}
      <HeatMap/>
    </div>
  );
}

export default App;
