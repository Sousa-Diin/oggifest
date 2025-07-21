export default function formatarTelefone(telefone) {
  
  if (!telefone) return '';
  telefone = telefone.toString().trim();
  const digits = telefone.replace(/\D/g, '');

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else {
    return telefone; // valor parcial ou inválido
  }
}

