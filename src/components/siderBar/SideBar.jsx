import React from 'react';
import { IoMdMenu } from "react-icons/io";
import { TfiAgenda } from "react-icons/tfi";
import '../../pages/oggicar/OggiFest.css'
import { useNavigate } from 'react-router-dom';

export const SideBar = () => {
  const navigate = useNavigate();
  const handleChangePages = () => {
    navigate("/oggifest/agendamentos");
  };

  return(
    <aside className='flex-col bg-blue-950 text-white  w-12 min-h-dvh' style={{backgroundColor:'#37A2C2'}}>
      <div onClick={{}} className="flex items-center justify-between w-full p-2 gap-1  ">
          <button onClick={{}} className="font-bold text-2xl"><IoMdMenu/></button>
      </div>
      <ul>
        <span className="flex items-center justify-between w-full p-2 gap-1  ">
          <button onClick={handleChangePages} className="font-bold text-2xl"><TfiAgenda /></button>
        </span>
  
      </ul>
    </aside>
  );
}