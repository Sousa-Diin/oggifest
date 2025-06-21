import React, { createContext, useContext, useEffect, useState } from "react";
import { agendamentos } from "../service/ListAgendar";
import { enviarParaPlanilha } from "../service/ListAgendar";
import Notie from "../service/notieService"; // Importando o serviço de notificação

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

const formatarData = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    console.error("Data inválida:", date);
    return ""; // Retorna uma string vazia para evitar erro
  }
  return date.toISOString().split("T")[0];
};

const AuthContextProvider = ({ children }) => {
  const [evento, setEvento] = useState([]);

  // Carregar dados ao iniciar
  useEffect(() => {
    const loadData = async () => {
      //const stored = getLocalStorage("agendamentos");

      /* if (stored && stored.length > 0) {
        setEvento(stored);
      } else { */
        const apiData = await agendamentos();
        setEvento(apiData);
        setLocalStorage("agendamentos", apiData);
     // }
    };

    loadData();
  }, []);

  const addEvento = async (ev) => {
    if (!ev || !ev.Cliente || !ev.Pedido || !ev.Horario || !ev.Saida) {
      Notie.alert("Erro ao adicionar evento: dados inválidos.");
      console.error("Erro ao adicionar evento: dados inválidos.", ev);
      return;
    }
  
    const statusValido = ["Agendado", "Entrada", "Pago"];
    if (!statusValido.includes(ev.Status)) {
      Notie.alert("Erro ao adicionar evento: status inválido.");
      console.error("Evento inválido:", ev);
      return;
    }else if (ev.Status === undefined) {
      Notie.alert("Erro ao adicionar evento: status não definido.");
      console.error("Evento inválido:", ev.Status);
      return;
    }else if(ev.Valor === 0 && ev.Status !== "Agendado") {
      Notie.alert("Erro ao adicionar evento: valor zerado.");
      console.error("Evento inválido:", ev.Valor);
      return;

    }
  
    const prevList = [...evento];
    const lastId = prevList.length > 0 ? prevList[prevList.length - 1].Id || 0 : 0;
    const newEvent = { ...ev, Id: lastId + 1 };
    const newList = [...prevList, newEvent];
  
    const result = await enviarParaPlanilha(newEvent);
    if (!result) {
      Notie.alert("Erro ao enviar dados para a planilha.");
      console.error("Erro ao enviar dados para a planilha:", evento);
      return;
    }
    Notie.success("Evento adicionado com sucesso!");
    localStorage.removeItem("agendamentos");
    setLocalStorage("agendamentos", newList);
    setEvento(newList);
  
    console.log("Evento adicionado com sucesso:", newEvent);
  };
  
  return (
    <AuthContext.Provider value={
      { evento, setEvento, addEvento, setLocalStorage, getLocalStorage, formatarData }
    }>
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
