import {
     BrowserRouter as Router,
     Route, 
     Routes,
    } from "react-router-dom";

import MenuPrincipal from "./components/menumain/MenuPrincipal";
import OggiFest from './pages/oggicar/OggiFest';
import Agendamentos from "./pages/Agendamentos";
import Store from './pages/main/Store'

const AppRouter =() => {
   
  return(
    <Router>
      <Routes> 
        <Route path="oggifest/" element={<Store/>} />             
        <Route path="/oggifest/main/menu" element={<MenuPrincipal/>} />
        <Route path="/oggifest/main/car" element={<OggiFest/>} />
        <Route path="/oggifest/agendamentos" element={<Agendamentos/>}/>
                     
        {/* <Route path="*" element={<PageNotFound/>} />  */}          
      </Routes>
    </Router>
  );
}

export default AppRouter;