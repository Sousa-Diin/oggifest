import './App.css'
import 'notie/dist/notie.css';  // Import the CSS file for notie  
import React, { useState } from 'react';
import { SideBar } from './components/siderBar/SideBar'
import OggiFest from './pages/oggicar/OggiFest'
import Agendamentos from './pages/Agendamentos'

function App() {
  
  const [openPage, setOpenPage] = useState(true); //muda de pagina

  return (
    <section className='bg-[#EAE8E1] flex h-[100dvh ]'>
      <SideBar  openPage={openPage} setOpenPage={setOpenPage}/>
      <div className='ml-9'>
        {openPage ? 
          <OggiFest/>
           :
          <Agendamentos openPage={openPage} setOpenPage={setOpenPage}/>
        }
      </div>
    </section>
  )
}

export default App
