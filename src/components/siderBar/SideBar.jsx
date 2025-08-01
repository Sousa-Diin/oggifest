import React from 'react';
import { VscAccount } from "react-icons/vsc";
import { FaRegCalendarCheck } from "react-icons/fa";
import { TfiAgenda } from "react-icons/tfi";
import { IoBarChartSharp } from "react-icons/io5";
import { LuSettings } from "react-icons/lu";
import { TbLogout2 } from "react-icons/tb";
import Notie from '../../service/notieService.js';
import '../../pages/oggicar/OggiFest.css';

export const SideBar = ({setActiveComponent }) => {

  const handleChangePages = (page) => {
    setActiveComponent(page);
  };

  const listIcons = [
   
    {
      name: <VscAccount />,
      label: "Account",
      action: () => {handleChangePages('account'); Notie.warning('Aviso! Pagina em desenvolvimento...');},
    },
    {
      name: <FaRegCalendarCheck />,
      label: "oggifest",
      action: ()=> setActiveComponent('oggifest'),
    },
    {
      name: <TfiAgenda />,
      label: "Agendamentos",
      action: () => handleChangePages('appointments'),
    },
    {
      name: <IoBarChartSharp />,
      label: "Gráficos",
      action: () => {handleChangePages('chart');{Notie.error('Atenção! Seu perfil não tem acesso a essa página.')}},
    },
    {
      name: <LuSettings />,
      label: "Configurações",
      action: () => {handleChangePages('config');{Notie.error('Atenção! Seu perfil não tem acesso a essa página.')}},
    },
    {
      name: <TbLogout2 />,
      label: "Logout",
      action: () => {Notie.info('Atenção! Não é possível fazer logout nesse momento.')},
    },
    
  ];

  return (
    <aside className= 'pb-3 h-full flex flex-col justify-around text-white fixed min-h-dvh z-10' style={{ backgroundColor: '#37A2C2' }}>
      <ul className="h-[85%] flex flex-col  justify-between p-2">
        {listIcons.map((item, index) => (
          <li key={index} className="font-bold text-2xl">
            <button onClick={item.action} title={item.label}>
              {item.name}
            </button>
          </li>
        ))}
      </ul>
      <ul className="p-2 font-bold text-2xl"></ul>
    </aside>
  );
};
