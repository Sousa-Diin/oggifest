import './App.css'
import AppRouter from './AppRouter'
import Store from './pages/main/Store'
import React, { useState } from 'react';
import { SideBar } from './components/siderBar/SideBar'
import OggiFest from './pages/oggicar/OggiFest'
import Agendamentos from './pages/Agendamentos'

function App() {
  
  const [openPage, setOpenPage] = useState(true); //muda de pagina
  const apiUrl = import.meta.env.VITE_API_URL;
 // console.log("URL da API:", apiUrl);

  return (
    <section className='bg-[#EAE8E1] flex h-[100dvh]'>
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
