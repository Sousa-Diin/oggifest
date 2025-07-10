import { DeploymentID } from "../service/authSheets.js";



const BASE_URL = `https://script.google.com/macros/s/${DeploymentID}/exec`;

/**
 * Envia uma requisição para a API do Google Apps Script
 * 
 * @param {string} rota - Ex: 'products', 'orders'
 * @param {string} metodo - 'GET' | 'POST'
 * @param {object} dados - Parâmetros a serem enviados
 * @returns {Promise<object>} - Resposta da API
 */
export const googleScriptClient = async (rota, metodo = 'GET', dados = {}) => {
  try {
    const methodUpper = metodo.toUpperCase();

    if (methodUpper === 'GET') {
      const params = new URLSearchParams({ route: rota, ...dados });
      const url = `${BASE_URL}?${params.toString()}`;

      const response = await fetch(url, { method: 'GET' });
      const result = await response.json();
      //console.log(`[${rota.toUpperCase()} - GET] Resposta:`, result);
      return result;
    }

    // POST (CREATE, UPDATE, DELETE)
    const bodyParams = new URLSearchParams({ route: rota, method: methodUpper, ...dados });

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyParams
    });

    const result = await response.json();
    console.log(`[${rota.toUpperCase()} - POST] Resposta:`, result);
    return result;

  } catch (error) {
    console.error(`Erro na chamada [${rota.toUpperCase()} - ${metodo}]:`, error);
    return { success: false, error };
  }
};
