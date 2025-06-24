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
