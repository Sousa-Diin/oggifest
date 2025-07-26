export const FormattedHour = (hour) => {
  if (!hour) return '';
  
  const date = new Date(hour);
  if (isNaN(date.getTime())) {
    // Tente extrair direto, se já estiver no formato HH:mm
    if (/^\d{2}:\d{2}$/.test(hour)) return hour;
    return '';
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};


export const FormattedDate = (date) => {
  //console.log("Valor recebido:", date);
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    console.warn("Data inválida:", date);
    return '';
  }
  return parsedDate.toISOString().split('T')[0];
};

export const formatarTelefone = (telefone) => {
  if (!telefone) return '';

  
  telefone = telefone.toString().trim();
  const digits = telefone.replace(/\D/g, '');
  
  if (digits.length > 11) return 'INVÁLIDO';

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else {
    return telefone; // valor parcial ou inválido
  }
  
}

const formatarHorario = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return "";
  }
  return date.toTimeString().split(" ")[0].slice(0, 5); // Ex: "13:45"
};

// Formata a data para o formato DD/MM/YYYY ou DD/MM/YYYY HH:mm
export function formatarData(data, comHora = false) {
  if (!data) return '';

  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();

  if (comHora) {
    const horas = String(d.getHours()).padStart(2, '0');
    const minutos = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  }

  return `${dia}/${mes}/${ano}`;
}


export const formatarDataHoraParaEnvio = (evento) => {
  const novoEvento = { ...evento };

  const saida = new Date(novoEvento.saida);
  const horario = new Date(novoEvento.horario);

  if (!isNaN(saida)) {
    novoEvento.saida = formatarData(saida);
  }

  if (!isNaN(horario)) {
    novoEvento.horario = formatarHorario(horario);
  }

  return novoEvento;
};
