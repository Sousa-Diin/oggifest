import { useState } from 'react';
import React from 'react';
import './Store.css';
import OggiFest from '../oggicar/OggiFest';


function Store({hidden}) {

  return (
    <div className='container-faturar-cobrar'>
      {/* <Header title='Oggi - Três Pontas | Carrinho'/> */}
      <main id='main-s-n' className='main-menu'>
        <OggiFest/>
      </main>
    </div>
  );
}

export default Store;
