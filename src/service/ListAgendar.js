import url from '../service/api';
import { DeploymentID } from './authSheets';

import Papa from 'papaparse';

// Função para buscar os dados da API 
// Method: GET
export const agendamentos = async () => {
  try {
    const response = await fetch(url);
    const csv = await response.text();
    const json = Papa.parse(csv, { header: true, dynamicTyping: true });

    return json.data;
  } catch (error) {
    console.error("Erro ao buscar os dados da API:", error);
    return [];
  }
};

//Method: POST
export const enviarParaPlanilha = async (evento) => {
  try {
    fetch(`https://script.google.com/macros/s/${DeploymentID}/exec`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams (evento)
    })
    .then(res => res.json())
    .then(data => console.log("Resposta:", data))
    .catch(err => console.error("Erro:", err));
    
    
    
  } catch (error) {
    console.error("Erro de conexão com a API:", error);
  }
};
