import React, { createContext, useContext, useEffect, useState } from "react";
import { getAllAppointments, createAppointment, updateAppointment } from "../service/AppointmentsService"; // Importando o serviço de agendamentos
import Notie from "../service/notieService"; // Importando o serviço de notificação
import { formatarDataHoraParaEnvio } from "../util/FormattedDate"; // Importando a função de formatação de data
import { Result } from "postcss";

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
        const apiData = await getAllAppointments();
        setEvento(apiData.allAppointments);
        console.log("Dados carregados da API.");
        //setLocalStorage("agendamentos", apiData.allAppointments);
     // }
    };

    loadData();
  }, []);

  const addEvento = async (ev, action) => {
    if (!ev || !ev.cliente || !ev.pedido || !ev.horario || !ev.saida) {
      Notie.alert("Erro ao adicionar evento: dados inválidos.");
      console.error("Erro ao adicionar evento: dados inválidos.", ev);
      console.error("Ação[insert|edit]=> ", action);
      return;
    }
  
    const statusValido = ["Agendado", "Entrada", "Pago", "Cancelado"];
    if (!statusValido.includes(ev.status)) {
      Notie.alert("Erro ao adicionar evento: status inválido.");
      console.error("Evento inválido:", ev);
      return;
    }else if (ev.status === undefined) {
      Notie.alert("Erro ao adicionar evento: status não definido.");
      console.error("Evento inválido:", ev.status);
      return;
    }else if(ev.valor === 0 && ev.status !== "Agendado") {
      Notie.alert("Erro ao adicionar evento: valor zerado.");
      console.error("Evento inválido:", ev.valor);
      return;

    }
  
    /* const prevList = [...evento];
    const newEvent = { ...ev };
    const newList = [...prevList]; */
   
    const prevList = [...evento];
    const newEvent = formatarDataHoraParaEnvio({ ...ev });
    const newList = [...prevList];
    

    let result = null;

    if (action === "insert") { 
      result = await createAppointment(newEvent);
    }
    else if (action === "edit") {
      result = await updateAppointment(newEvent);

    }else {
      Notie.alert("Ação inválida. Use 'insert' ou 'edit'.", result);
      console.error("Ação inválida:", action);
      return;
    }
  
    
    if (!result) {
      Notie.alert("Erro ao enviar dados para a planilha.");
      console.error("Erro ao enviar dados para a planilha:", result);
      return;
    }
    Notie.success(result.message);
    localStorage.removeItem("agendamentos");
    setLocalStorage("agendamentos", newList);
    setEvento(newList);
    window.location.reload(); // Recarrega a página para refletir as mudanças
  
    console.log("Evento adicionado com sucesso:");
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
