// Description: This component is a custom modal window that allows users to edit or add appointment details.
import { useState, useEffect } from "react";
import { useAuth } from "../../provider/AuthContextProvider";
import { X } from "lucide-react";
import Notie from "../../service/notieService";

export default function CustomWindow({ message, openWindowEdit, setOpenWindowEdit, appointment }) {
  const { evento, addEvento } = useAuth();
  const [formData, setFormData] = useState(appointment || evento || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(appointment || evento || {});
    setErrors({});
  }, [appointment, evento]);

  const validate = () => {
    const newErrors = {};
    if (formData.Valor < 0) {
      newErrors.Valor = "Valor não pode ser negativo.";
    }
    if (formData.Pedido < 0) {
      newErrors.Pedido = "Pedido não pode ser negativo.";
    }
    if (formData.Quantidade < 0) {
      newErrors.Quantidade = "Quantidade não pode ser negativa.";
    }
    if (!formData.Status) {
      newErrors.Status = "Selecione um status.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Notie.error("Corrija os campos em vermelho.");
      return;
    }

    await addEvento(formData);
    setOpenWindowEdit(false);
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
          {/* ID e Nome */}
          <div className="flex flex-wrap gap-2 w-full">
            <div className="flex-1 min-w-[90px]">
              <label htmlFor="Id" className="block font-semibold">ID</label>
              <input
                type="number"
                name="Id"
                disabled
                value={formData.Id || evento.length + 1}
                className="w-full p-1 text-center rounded shadow"
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label htmlFor="Cliente" className="block font-semibold">Nome do Cliente</label>
              <input
                type="text"
                name="Cliente"
                value={formData.Cliente || ''}
                onChange={(e) => setFormData({ ...formData, Cliente: e.target.value })}
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
                value={formData.Saida || ''}
                onChange={(e) => setFormData({ ...formData, Saida: e.target.value })}
                className="w-full p-1 bg-gray-100 rounded shadow"
                required
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <label htmlFor="Horario" className="block font-semibold">Horário</label>
              <input
                type="time"
                name="Horario"
                value={formData.Horario || ''}
                onChange={(e) => setFormData({ ...formData, Horario: e.target.value })}
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
                value={formData.Pedido || ''}
                onChange={(e) => setFormData({ ...formData, Pedido: parseFloat(e.target.value) })}
                className={`w-full p-1 bg-gray-100 rounded shadow ${errors.Pedido ? 'border border-red-500 text-red-500' : ''}`}
                required
              />
              {errors.Pedido && <p className="text-red-500 text-xs mt-1">{errors.Pedido}</p>}
            </div>
            <div className="flex-1 min-w-[100px]">
              <label htmlFor="Quantidade" className="block font-semibold">Quantidade</label>
              <input
                type="number"
                name="Quantidade"
                value={formData.Quantidade || ''}
                onChange={(e) => setFormData({ ...formData, Quantidade: parseFloat(e.target.value) })}
                className={`bg-gray-100 w-full p-1 rounded shadow ${errors.Quantidade ? 'border border-red-500 text-red-500' : ''}`}
                required
              />
              {errors.Quantidade && <p className="text-red-500 text-xs mt-1">{errors.Quantidade}</p>}
            </div>
            <div className="flex-1 min-w-[100px]">
              <label htmlFor="Valor" className="block font-semibold">Valor (R$)</label>
              <input
                type="number"
                name="Valor"
                value={formData.Valor || ''}
                onChange={(e) => setFormData({ ...formData, Valor: parseFloat(e.target.value) })}
                className={`bg-gray-100 w-full p-1 rounded shadow ${errors.Valor ? 'border border-red-500 text-red-500' : ''}`}
                required
              />
              {errors.Valor && <p className="text-red-500 text-xs mt-1">{errors.Valor}</p>}
            </div>
          </div>

          {/* Status */}
          <div className="w-full">
            <label htmlFor="Status" className="block font-semibold">Status</label>
            <select
              name="Status"
              value={formData.Status || ""}
              onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
              className={`bg-gray-100 w-full p-2 rounded border shadow 
                ${formData.Status === "Agendado" ? 'border-blue-400 text-blue-600' : ''}
                ${formData.Status === "Entrada" ? 'border-yellow-400 text-yellow-600' : ''}
                ${formData.Status === "Pago" ? 'border-green-400 text-green-600' : ''}
                ${errors.Status ? 'border-red-500 text-red-500' : ''}
              `}
              required
            >
              <option value="" disabled>Selecione o status</option>
              <option value="Agendado" disabled={formData.Valor > 0}>Agendado</option>
              <option value="Entrada" disabled={formData.Valor >= 200}>Entrada</option>
              <option value="Pago" disabled={formData.Valor < 200}>Pago</option>
            </select>
            {errors.Status && <p className="text-red-500 text-xs mt-1">{errors.Status}</p>}
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
            type="submit"
            className="px-3 py-1 rounded bg-[#37A2C2] hover:bg-blue-600"
          >
            {message.btnConfirm}
          </button>
        </div>
      </form>
    </div>
  );
}
