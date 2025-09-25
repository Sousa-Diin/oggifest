import React, {useState} from 'react';
import { VscAccount } from "react-icons/vsc";
import { FaRegCalendarCheck } from "react-icons/fa";
import { TfiAgenda } from "react-icons/tfi";
import { IoBarChartSharp } from "react-icons/io5";
import { LuSettings } from "react-icons/lu";
import { TbLogout2 } from "react-icons/tb";
import { LiaLocationArrowSolid } from "react-icons/lia";
import Notie from '../../service/notieService.js';
import '../../pages/oggicar/OggiFest.css';

export const SideBar = ({setActiveComponent }) => {

  const [selectedIndex, setSelectedIndex] = useState(null); // índice selecionado
  const handleChangePages = (page, index) => {
    setSelectedIndex(index);         // ✅ guarda o botão clicado
    setActiveComponent(page);
  };


  /* const listIcons = [
   
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
    }
    
  ]; */

  const listIcons = [
    {
      name: <VscAccount />,
      label: "Account",
      action: (i) => {
        handleChangePages("account", i);
        Notie.warning("Aviso! Pagina em desenvolvimento...");
      },
    },
    {
      name: <FaRegCalendarCheck />,
      label: "oggifest",
      action: (i) => handleChangePages("oggifest", i),
    },
    {
      name: <TfiAgenda />,
      label: "Agendamentos",
      action: (i) => handleChangePages("appointments", i),
    },
    {
      name: <IoBarChartSharp />,
      label: "Gráficos",
      action: (i) => {
        handleChangePages("chart", i);
        Notie.error("Atenção! Seu perfil não tem acesso a essa página.");
      },
    },
    {
      name: <LuSettings />,
      label: "Configurações",
      action: (i) => {
        handleChangePages("config", i);
        Notie.error("Atenção! Seu perfil não tem acesso a essa página.");
      },
    },
    {
      name: <TbLogout2 />,
      label: "Logout",
      action: () =>
        Notie.info("Atenção! Não é possível fazer logout nesse momento."),
    },
  ];

  // 🔑 Cálculo da posição da seta
  // altura de cada <li> (ajuste conforme seu layout)
  const itemHeight = 99;
  const arrowOffset = 15; // distância para centralizar a seta no ícone
  const arrowTop =
    selectedIndex !== null ? selectedIndex * itemHeight + arrowOffset : null;

  return (
    <aside className= 'pb-3 h-full flex flex-col justify-around text-white fixed min-h-dvh z-10' style={{ backgroundColor: '#37A2C2' }}>
      <ul className="h-[85%] flex flex-col  justify-between p-2">
        {listIcons.map((item, index) => (
          <li key={index} className="font-bold text-2xl">
            <button onClick={() => item.action(index)}
              title={item.label}
              className={`transition-colors duration-200 ${
                selectedIndex === index ? "text-yellow-300" : ""
              }`}>
              {item.name}
            </button>
          </li>
        ))}
      </ul>
      <ul className="p-2 font-bold text-2xl"></ul>
       {/* 🔽 Seta lateral dinâmica */}
        {selectedIndex !== null && (
          <span
            className="absolute top-1/2 -right-2 transform -translate-y-1/2  text-white p-1 rounded-full shadow-md hover:bg-[#2d8aa5] transition-all duration-300"
            style={{ top: arrowTop, backgroundColor: "var(--color-primary)" }}
          >
            <LiaLocationArrowSolid size={15} className='rotate-270'/>
          </span>
        )}
    </aside>
  );
};
