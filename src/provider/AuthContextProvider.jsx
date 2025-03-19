import React, { createContext, useContext, useEffect, useState } from "react";
import { agendamentos } from "../service/ListAgendar";

const AuthContext = createContext({});

const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
  }
};

const getStoredEvents = () => {
  try {
    const storeData = JSON.parse(localStorage.getItem("agendaList"));

    if (!storeData){
      localStorage.setItem("agendaList", JSON.stringify(agendamentos));
      return agendamentos;
    }
    return storeData;
  } catch (error) {
    console.error("Erro ao recuperar do localStorage:", error);
    return [];
  }
};

const AuthContextProvider = ({ children }) => {
  //Estado inicial carregado do localstorage
  const [evento, setEvento] = useState([]);

  // Carregar eventos do localStorage quando o contexto ininicar
  useEffect(() => {
   setEvento(getStoredEvents());
  }, []);

  const addEvento = (ev) => {
    // Validação para garantir que o evento tenha os campos necessários
    if (!ev || !ev.nome || !ev.pedido || !ev.horario || !ev.data || !ev.status) {
      console.error("Erro ao adicionar evento: dados inválidos.", ev);
      return;
    }
  
    setEvento((prevList) => {
      const lastId = prevList.length > 0 ? prevList[prevList.length - 1].id : 0; // Pegando último ID
      const newEvent = { ...ev, id: lastId + 1 }; // Criando evento com novo ID

      const newList = [...prevList, newEvent];
  
      // Salva a lista atualizada no localStorage
      setLocalStorage("agendaList", newList);
  
      return newList;
    });
  
    console.log("Evento adicionado com sucesso:", ev);
  };
  

  return (
    <AuthContext.Provider value={{ evento, setEvento, addEvento, getStoredEvents }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthContextProvider");
  }
  return context;
};
