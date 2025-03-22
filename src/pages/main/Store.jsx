
import React, { useState } from 'react';
import './Store.css';
import OggiFest from '../oggicar/OggiFest';
import Agendamentos from '../../pages/Agendamentos'
import { SideBar } from '../../components/siderBar/SideBar';


function Store() {
  const [openOggiPage, setOpenOggiPage] = useState(true); //muda de pagina
  const [openAgendamentoPage, setOpenAgendamentoPage] = useState(false); //muda de pagina

  return (
    <main className='flex'>
      <SideBar  />
      
      {openOggiPage ? <OggiFest/> :
        <Agendamentos/>
      }
      
    
    </main>
    
  );
}

export default Store;
