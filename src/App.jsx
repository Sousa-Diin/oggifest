import './App.css'
import 'notie/dist/notie.css';  // Import the CSS file for notie  
import React, { useState } from 'react';
import { SideBar } from './components/siderBar/SideBar'
import OggiFest from './pages/oggicar/OggiFest'
import Agendamentos from './pages/Agendamentos'

function App() {
  
  /* const [openPage, setOpenPage] = useState('OggiFest'); //muda de pagina */
  const [activeComponent, setActiveComponent] = useState('oggifest'); 

  const stackComponent = {
    oggifest: <OggiFest/>,
    appointments: <Agendamentos setActiveComponent={setActiveComponent}/>,
  };

  return (
    <section className='bg-[#EAE8E1] flex h-[100dvh ]'>
      <SideBar  setActiveComponent={setActiveComponent}/>
      <div className='ml-8'>
     {stackComponent[activeComponent]}
      </div>
    </section>
  )
}

export default App
