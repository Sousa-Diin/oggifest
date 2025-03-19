import React from 'react';
import { IoMdMenu } from "react-icons/io";
import { TfiAgenda } from "react-icons/tfi";
import '../../pages/oggicar/OggiFest.css'

export const SideBar = ({openSide, writeTitle, handleCloseSideBar}) => {
  /* const navigate = useNavigate(); */
  const handleChangePages = () => {
    /* navigate("/oggi/agendamentos"); */
  };

  return(
    <aside className={`flex-col bg-blue-950 text-white  min-w-12 min-h-screen ${openSide ? "open-side" : ""}`} style={{backgroundColor:'#37A2C2'}}>
      <div onClick={handleCloseSideBar} className="flex items-center justify-between w-full p-2 gap-1  ">
          <p>{writeTitle ? 'Menu' : ''}</p>
          <button onClick={handleCloseSideBar} className="font-bold text-2xl"><IoMdMenu/></button>
      </div>
      <ul>
        <span className="flex items-center justify-between w-full p-2 gap-1  ">
          <p>{writeTitle ? 'Agendamentos' : ''}</p>
          <button onClick={handleChangePages} className="font-bold text-2xl"><TfiAgenda /></button>
        </span>
  
      </ul>
    </aside>
  );
}