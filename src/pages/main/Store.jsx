
import React, { useState } from 'react';
import './Store.css';
import OggiFest from '../oggicar/OggiFest';
import Agendamentos from '../../pages/Agendamentos'
import { SideBar } from '../../components/siderBar/SideBar';


function Store() {
  const [openPage, setOpenPage] = useState(true); //muda de pagina

  return (
    <main className='flex'>
      <SideBar openPage={openPage} setOpenPage={setOpenPage}  />
      <div className='aside-content overflow-y-auto'>
        {openPage ? 
          <OggiFest/> :
          <Agendamentos openPage={openPage} setOpenPage={setOpenPage}/>
        }
      </div>
      
      
    
    </main>
    
  );
}

export default Store;
