// Description: This component is a custom modal window that allows users to edit or add appointment details.
import { useState, useEffect } from "react";
import { useAuth } from "../../provider/AuthContextProvider";
import { X } from "lucide-react";
import Notie from "../../service/notieService";
import { FormattedDate, FormattedHour } from "../../util/FormattedDate";

export default function CustomWindow({ message, action='insert',subText = "Enviando...", setOpenWindowEdit, appointment }) {
  const { evento, addEvento, setLocalStorage } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(appointment || evento || {});
  const [errors, setErrors] = useState({});

  
  setLocalStorage('currentEvent',appointment);
  useEffect(() => {
  if (appointment && Object.keys(appointment).length > 0) {
    setFormData(appointment);
  } else if (evento && Object.keys(evento).length > 0) {
    setFormData(evento);
  } else {
    setFormData({});
  }
  setErrors({});
}, [appointment, evento]);


  const validate = () => {
    const newErrors = {};
    formData.telefone = formData.telefone.toString().trim();
    const digits = formData.telefone.replace(/\D/g, '');

    if (digits.length > 11) {
      newErrors.telefone = "O telefone não pode ter mais de 11 dígitos.";
    } else if (!/^\d+$/.test(digits)) {
      newErrors.telefone = "O telefone deve conter apenas números.";
    }

    if (formData.valor < 0) {
      newErrors.valor = "Valor não pode ser negativo.";
    }
    if (isNaN(formData.valor) || formData.valor < 0.01) {
      newErrors.valor = "Valor deve ser maior que zero.";
    }
    if (formData.pedido < 0) {
      newErrors.pedido = "Pedido não pode ser negativo.";
    }
    if (formData.quantidade < 0) {
      newErrors.quantidade = "Quantidade não pode ser negativa.";
    }
    if (!formData.status) {
      newErrors.status = "Selecione um status.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result = null;
    try {
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        throw new Error("Corrija os campos em vermelho.");
        //return;
      }

      let preencheDataEntrega = new Date(formData.saida);
      preencheDataEntrega.setDate(preencheDataEntrega.getDate() + 1);
      formData.entrega = FormattedDate(formData.saida);

      //seta o carregamento para true
      setLoading(true);
      // Envia os dados do formulário para o serviço de adição de evento
      result = await addEvento(formData, action);
      setOpenWindowEdit(false); // Fecha a janela de edição
    }catch(error){
      Notie.error(error ||result.message || "Erro ao salvar o evento.");
    }finally {
      setLoading(false);
      Notie.success(result.message || "Evento salvo com sucesso!");
    }
  };

  return (
    <div className="shadow bg-[#EAE8E1] transition-all duration-300 w-full h-full">
      <div className="flex items-center text-white justify-between px-2 py-1 bg-[#E59E07]">
        <span className="font-bold">{message.title}</span>
        <button onClick={() => setOpenWindowEdit(false)} className="hover:text-[#E52C66]">
          <X size={23} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col justify-around items-center h-[90%] p-2 text-sm">
        <fieldset className="w-full flex flex-col gap-3">
          {/* Telefone e Nome */}
          <div className="flex flex-wrap gap-2 w-full">
            <div className="flex-1 min-w-[90px]">
              <label htmlFor="Phone" className="block font-semibold">Telefone</label>
              <input
                type="text"
                name="Phone"                
                value={formData.telefone ?? ''} 
                placeholder="Ex: 11987654321"           
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className={` bg-gray-100 w-full p-1 text-center rounded shadow ${errors.pedido ? 'border border-red-500 text-red-500' : ''}`}
                required
                maxLength={11}
              />
               {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
            </div>
            <div className="flex-1 min-w-[180px]">
              <label htmlFor="Cliente" className="block font-semibold">Nome do Cliente</label>
              <input
                type="text"
                name="Cliente"
                value={formData.cliente || ''}
                placeholder="ex: Maria da Silva"
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                className="w-full p-1 bg-gray-100 rounded shadow"
                required
              />
            </div>
          </div>

          {/* Data e Horário */}
          <div className="flex flex-wrap gap-2 w-full">
            <div className="flex-1 min-w-[160px]">
              <label htmlFor="Saida" className="block font-semibold">Data de Saída</label>
              <input
                type="date"
                name="Saida"
                value={FormattedDate(formData.saida) || ''}
                onChange={(e) => setFormData({ ...formData,saida: e.target.value })}
                className="w-full p-1 bg-gray-100 rounded shadow"
                required
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <label htmlFor="Horario" className="block font-semibold">Horário</label>
              <input
                type="time"
                name="Horario"
                value={FormattedHour(formData.horario) || ''}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                className="w-full p-1 bg-gray-100 rounded shadow"
                required
              />
            </div>
          </div>

          {/* Pedido, Quantidade, Valor */}
          <div className="flex flex-wrap gap-2 w-full">
            <div className="flex-1 min-w-[100px]">
              <label htmlFor="Pedido" className="block font-semibold">Pedido</label>
              <input
                type="number"
                name="Pedido"
                value={formData.pedido || ''}
                onChange={(e) => setFormData({ ...formData, pedido: parseFloat(e.target.value) })}
                className={`w-full p-1 bg-gray-100 rounded shadow ${errors.pedido ? 'border border-red-500 text-red-500' : ''}`}
                required
                maxLength={3}
              />
              {errors.pedido && <p className="text-red-500 text-xs mt-1">{errors.pedido}</p>}
            </div>
            <div className="flex-1 min-w-[100px]">
              <label htmlFor="Quantidade" className="block font-semibold">Quantidade</label>
              <input
                type="number"
                name="Quantidade"
                value={formData.quantidade || ''}
                onChange={(e) => setFormData({ ...formData, quantidade: parseFloat(e.target.value) })}
                className={`bg-gray-100 w-full p-1 rounded shadow ${errors.quantidade ? 'border border-red-500 text-red-500' : ''}`}
                required
                maxLength={4}
              />
              {errors.quantidade && <p className="text-red-500 text-xs mt-1">{errors.quantidade}</p>}
            </div>
            <div className="flex-1 min-w-[100px]">
              <label htmlFor="Valor" className="block font-semibold">Valor (R$)</label>
              <input
                type="number"
                name="Valor"
                value={formData.valor || ''}
                onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) })}
                className={`bg-gray-100 w-full p-1 rounded shadow ${errors.valor ? 'border border-red-500 text-red-500' : ''}`}
                required
              />
              {errors.valor && <p className="text-red-500 text-xs mt-1">{errors.valor}</p>}
            </div>
          </div>

          {/* Status */}
          <div className="w-full">
            <label htmlFor="Status" className="block font-semibold">Status</label>
            <select
              name="Status"
              value={formData.status || ""}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={`bg-gray-100 w-full p-2 rounded border shadow 
                ${formData.status === "Agendado" ? 'border-blue-400 text-blue-600' : ''}
                ${formData.status === "Entrada" ? 'border-yellow-400 text-yellow-600' : ''}
                ${formData.status === "Pago" ? 'border-green-400 text-green-600' : ''}
                ${errors.status ? 'border-red-500 text-red-500' : ''}
              `}
              required
            >
              <option value="" disabled>Selecione o status</option>
              <option value="Agendado" disabled={formData.valor > 0}>Agendado</option>
              <option value="Entrada" disabled={formData.valor >= 200}>Entrada</option>
              <option value="Pago" disabled={formData.valor < 200}>Pago</option>
            </select>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
          </div>
        </fieldset>

        {/* Botões */}
        <div className="mt-4 p-1 flex flex-row w-full justify-end gap-3 text-white">
          <button
            type="button"
            className="px-3 py-1 rounded bg-red-500 hover:bg-red-600"
            onClick={() => {
              setOpenWindowEdit(false);
              Notie.error("Ação cancelada.");
            }}
          >
            {message.btnCancel}
          </button>
          <button
            disabled={loading}
            type="submit"
            className="px-3 py-1 rounded bg-[#37A2C2] hover:bg-blue-600"
          >
            {loading ? subText : message.btnConfirm}
          </button>
        </div>
      </form>
    </div>
  );
}