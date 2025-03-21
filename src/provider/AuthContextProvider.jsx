import React, { createContext, useContext, useEffect, useState } from "react";
import { agendamentos } from "../service/ListAgendar";
import url from '../service/api'
import Papa from 'papaparse';

const AuthContext = createContext({});

const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
  }
};


// Função para buscar os dados da API e armazenar no localStorage
export const getData = async () => {
  try {
    const response = await fetch(url);
    const csv = await response.text();
    const json = Papa.parse(csv, { header: true, dynamicTyping: true });

    setLocalStorage("agendamentos", json.data); // Salva no localStorage
    return json.data;
  } catch (error) {
    console.error("Erro ao buscar os dados da API:", error);
    return [];
  }
};

export const getStoredEvents = () => {
  try {
    const storeData = JSON.parse(localStorage.getItem("agendamentos"));

    if (!storeData){
      localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
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
      setLocalStorage("agendamentos", newList);
  
      return newList;
    });
  
    console.log("Evento adicionado com sucesso:", ev);
  };
  

  return (
    <AuthContext.Provider value={{ evento, setEvento, addEvento, getStoredEvents,getData }}>
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
