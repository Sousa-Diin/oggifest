import React, { createContext, useContext, useEffect, useState } from "react";
import { agendamentos } from "../service/ListAgendar";
import { enviarParaPlanilha } from "../service/ListAgendar";

const AuthContext = createContext({});

const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
  }
};

const getLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Erro ao recuperar do localStorage:", error);
    return null;
  }
};

const AuthContextProvider = ({ children }) => {
  const [evento, setEvento] = useState([]);

  // Carregar dados ao iniciar
  useEffect(() => {
    const loadData = async () => {
      const stored = getLocalStorage("agendamentos");

      if (stored && stored.length > 0) {
        setEvento(stored);
      } else {
        const apiData = await agendamentos();
        setEvento(apiData);
        setLocalStorage("agendamentos", apiData);
      }
    };

    loadData();
  }, []);

  const addEvento = async (ev) => {
    if (!ev || !ev.Cliente || !ev.Pedido || !ev.Horario || !ev.Saida || !ev.Status) {
      console.error("Erro ao adicionar evento: dados inválidos.", ev);
      return;
    }
    
  
    const prevList = [...evento]; // pega a lista atual
    const lastId = prevList.length > 0 ? prevList[prevList.length - 1].Id || 0 : 0;
    const newEvent = { ...ev, Id: lastId + 1 };
    const newList = [...prevList, newEvent];
  
    //console.log("newEvent:", newEvent);
    //console.log("newList:", newList);
  
    // Envia para a planilha
    await enviarParaPlanilha(newEvent);
  
    // Atualiza localStorage e estado
    localStorage.removeItem("agendamentos");
    setLocalStorage("agendamentos", newList);
    setEvento(newList);
  
    console.log("Evento adicionado com sucesso:", newEvent);
  };
 

  return (
    <AuthContext.Provider value={{ evento, setEvento, addEvento, setLocalStorage }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthContextProvider");
  }
  return context;
};
