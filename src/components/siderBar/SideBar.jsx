import React from 'react';
import { FaRegCalendarCheck } from "react-icons/fa";
import { TfiAgenda } from "react-icons/tfi";
import { IoBarChartSharp } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import Notie from 'notie';
import '../../pages/oggicar/OggiFest.css';

export const SideBar = ({setActiveComponent }) => {

  const handleChangePages = (page) => {
    setActiveComponent(page);
  };

  const listIcons = [
   
    {
      name: <TfiAgenda />,
      label: "Agendamentos",
      action: () => handleChangePages('appointments'),
    },
    {
      name: <IoBarChartSharp />,
      label: "Gráficos",
      action: () => {Notie.alert('Atenção! Seu perfil não tem acesso a essa página.')},
    },
    
  ];

  return (
    <aside className= 'pb-3 h-full flex flex-col justify-around text-white fixed min-h-dvh z-10' style={{ backgroundColor: '#37A2C2' }}>
      <ul className="p-2 font-bold text-2xl"><FaRegCalendarCheck onClick={ ()=> setActiveComponent('oggifest')}/></ul>
      <ul className="h-[35%] flex flex-col items-center justify-around p-2">
        {listIcons.map((item, index) => (
          <li key={index} className=" font-bold text-2xl">
            <button onClick={item.action} title={item.label}>
              {item.name}
            </button>
          </li>
        ))}
      </ul>
      <ul className="p-2 font-bold text-2xl"><TbLogout2 onClick={ ()=> null }/></ul>
    </aside>
  );
};
