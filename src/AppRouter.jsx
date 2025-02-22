import {
     BrowserRouter as Router,
     Route, 
     Routes,
    } from "react-router-dom";

import Login from './pages/login/Login';
import Store from './pages/main/Store';
import MenuPrincipal from "./components/menumain/MenuPrincipal";
import OggiFest from './pages/oggicar/OggiFest';
import LoginSplash from "./pages/login/splash/LoginSplash";
const AppRouter =() => {
   
  return(
    <Router>
      <Routes>           
        <Route path='/oggi/' element={<Login/>}/>  
        <Route path='/oggi/splash' element={<LoginSplash/>}/>  
        <Route path="/oggi/main/store" element={<Store/>} />             
        <Route path="/oggi/main/menu" element={<MenuPrincipal/>} />
        <Route path="/oggi/main/car" element={<OggiFest/>} />
                     
        {/* <Route path="*" element={<PageNotFound/>} />  */}          
      </Routes>
    </Router>
  );
}

export default AppRouter;