export const FormattedDate = (date) => {
  const hora = new Date(date);
  const horaFormatada = hora.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return horaFormatada;
}