import React from 'react';
import { IoMdMenu } from "react-icons/io";
import { TfiAgenda } from "react-icons/tfi";
import '../../pages/oggicar/OggiFest.css'

export const SideBar = ({openPage, setOpenPage}) => {
  
  const handleChangePages = () => {
    setOpenPage(!openPage);
  };

  return(
    <aside className='flex-col text-white fixed min-h-dvh  z-1 ' style={{backgroundColor:'#37A2C2'}}>
      <div onClick={handleChangePages} className=" p-2   ">
          <button onClick={{}} className="font-bold text-2xl"><IoMdMenu/></button>
      </div>
      <ul>
        <span className=" p-2   ">
          <button onClick={handleChangePages} className="font-bold text-2xl"><TfiAgenda /></button>
        </span>
  
      </ul>
    </aside>
  );
}