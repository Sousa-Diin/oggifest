
//#######################################################LAYOUT RESPONSIVO MOBILE ###################### 

import React, { useState, useRef, useEffect } from "react";
import { VscAccount } from "react-icons/vsc";
import { FaRegCalendarCheck } from "react-icons/fa";
import { TfiAgenda } from "react-icons/tfi";
import { IoBarChartSharp } from "react-icons/io5";
import { LuSettings } from "react-icons/lu";
import { TbLogout2 } from "react-icons/tb";
import { LiaLocationArrowSolid } from "react-icons/lia";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from '../../provider/AuthContextProvider';
import { IoMdClose } from "react-icons/io";
import Notie from "../../service/notieService.js";
import "../../pages/oggicar/OggiFest.css";

export const SideBar = ({ setActiveComponent }) => {
  
  const { evento } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [arrowTop, setArrowTop] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // controla sidebar no mobile
  const itemsRef = useRef([]);

  const handleChangePages = (page, index) => {
    setSelectedIndex(index);
    setActiveComponent(page);
    if (window.innerWidth < 768) setIsOpen(false); // fecha após clicar no mobile
  };

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

  // 🔽 Atualiza a posição da seta sempre que o item selecionado muda
  useEffect(() => {
    if (selectedIndex !== null && itemsRef.current[selectedIndex]) {
      const el = itemsRef.current[selectedIndex];
      const rect = el.getBoundingClientRect();
      setArrowTop(rect.top + rect.height / 2 - 10);
    }
  }, [selectedIndex,evento]);

  return (
    <>
      {/* 🔽 Botão hambúrguer (só aparece no mobile) */}
      <button
        className="md:h-full md:hidden  fixed top-4 left-4 z-20 bg-[#37A2C2] p-3 rounded text-white shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <IoMdClose size={24} /> : <GiHamburgerMenu size={24} />}
      </button>

      {/* 🔽 Sidebar */}
      <aside
        className={`pb-5 md:h-[90dvh] flex flex-col justify-between  text-white fixed md:min-h-dvh z-10
          w-56  md:w-8 lg:w-24 xl:w-11
          bg-[#37A2C2] transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 "}
        `}
      >
        <ul className="flex flex-col gap-6 md:gap-8 items-center pt-10">
          {listIcons.map((item, index) => (
            <li
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              className="font-bold text-xl md:text-2xl"
            >
              <button
                onClick={() => item.action(index)}
                title={item.label}
                className={`transition-colors duration-200 ${
                  selectedIndex === index ? "text-yellow-300" : ""
                }`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>

        {/* 🔽 Seta lateral dinâmica */}
        {selectedIndex !== null && (
          <span
            className="absolute -right-2 text-white p-1 rounded-full shadow-md 
                     hover:bg-[#2d8aa5] transition-all duration-300"
            style={{ top: arrowTop, backgroundColor: "var(--color-primary)" }}
          >
            <LiaLocationArrowSolid size={15} className="rotate-270" />
          </span>
        )}
      </aside>
    </>
  );
};
