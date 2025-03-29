import url from '../service/api';

import Papa from 'papaparse';

// Função para buscar os dados da API e armazenar no localStorage
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

