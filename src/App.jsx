import './App.css'
import 'notie/dist/notie.css';  // Import the CSS file for notie  
import React, { useState } from 'react';
import { SideBar } from './components/siderBar/SideBar'
import OggiFest from './pages/oggicar/OggiFest'
import Agendamentos from './pages/Agendamentos'
import LoadSplash from './pages/splash/LoadSplash';

function App() {
  
  /* const [openPage, setOpenPage] = useState('OggiFest'); //muda de pagina */
  const [activeComponent, setActiveComponent] = useState('oggifest'); // Estado para o componente ativo

  const stackComponent = {
    oggifest: <OggiFest/>,
    load: <LoadSplash/>,
    appointments: <Agendamentos setActiveComponent={setActiveComponent}/>,
  };

  return (
    <section className=' flex flex-row justify-between w-[98dvw] gap-1 h-[99dvh] capitalize'>
      <SideBar  setActiveComponent={setActiveComponent}/>
      <div className='md:ml-8'>
       {stackComponent[activeComponent]}
      </div>
    </section>
  )
}

export default App
