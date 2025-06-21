import Papa from 'papaparse';
import fetch from 'node-fetch';
import { DeploymentID } from '../../src/service/authSheets.js';

const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQLk_IahvgeqvN9HSDBEmSWYtn6roUxFxVE9mMLoMDTj_mgKoIhSmZhgnvj5nq9RRhBGgTNNL_Foo_E/pub?gid=0&single=true&output=csv';
const targetUrl = `https://script.google.com/macros/s/${DeploymentID}/exec?route=appointments&method=create`;

async function seedProducts() {
  try {
    const response = await fetch(csvUrl);
    const csv = await response.text();

    const { data: agendamentos } = Papa.parse(csv, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });

    for (const agendamento of agendamentos) {
      try {
        // Remove o ID antes de enviar
        delete agendamento.Id;

        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams(Object.entries(agendamento))
        });

        const result = await res.json();
        console.log(`✅ Agendamento "${agendamento.Cliente || agendamento.client || 'sem nome'}" enviado com sucesso.`, result);
      } catch (err) {
        console.error(`❌ Erro ao enviar agendamento:`, err.message);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao buscar ou processar o CSV:', error.message);
  }
}

seedProducts();
