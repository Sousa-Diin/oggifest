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
        <Route path="/oggi/" element={<Store/>} />             
        <Route path="/oggi/main/menu" element={<MenuPrincipal/>} />
        <Route path="/oggi/main/car" element={<OggiFest/>} />
        <Route path="/oggi/agendamentos" element={<Agendamentos/>}/>
                     
        {/* <Route path="*" element={<PageNotFound/>} />  */}          
      </Routes>
    </Router>
  );
}

export default AppRouter;