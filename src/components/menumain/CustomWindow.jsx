import { useState, useEffect } from "react";
import { useAuth } from "../../provider/AuthContextProvider";
import { X } from "lucide-react";

export default function CustomWindow({ message, openWindowEdit, setOpenWindowEdit, appointment }) {
  const { evento, addEvento } = useAuth();
  
  // Inicializando o estado corretamente
  const [formData, setFormData] = useState(appointment || evento || {});

  useEffect(() => {
    setFormData(appointment || evento || {}); // Atualiza quando `appointment` muda
  }, [appointment, evento]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dados do agendamento:", formData);
    
    await addEvento(formData); // Espera o envio terminar
  
    alert(message.ok);
    setOpenWindowEdit(false);
  };
  

  const apiUrl = import.meta.env.VITE_API_URL;

  return (
    <div className="shadow bg-[#EAE8E1] transition-all duration-300 w-[99%] h-[100%]">
      
      <div className="flex items-center text-[#fcfcfc] justify-between px-2 py-1 bg-[#E59E07]">
        <span className="font-bold">{message.title}</span>
        <button onClick={() => setOpenWindowEdit(!openWindowEdit)} className="hover:text-[#E52C66] pointer rounded">
          <X size={23} />
        </button>
      </div>

      
      <form onSubmit={handleSubmit} className=" flex flex-col justify-around items-center w-[588px] h-[88%] p-1">
        
        <div  className="w-[100%] flex flex-col gap-2 justify-between">
        <aside className="w-[100%] flex flex-row gap-2 justify-between">
          <input
            className="w-[25%] p-1 bg-[#fff] rounded shadow"
            type="number"
            name="Id"
            value={formData.Id || ''}
            disabled
            placeholder="ID"
          />
          <input
            className="w-[75%] p-1 bg-[#fff] rounded shadow"
            type="text"
            name="Cliente"
            value={formData.Cliente || ''}
            onChange={(e) => setFormData({ ...formData, Cliente: e.target.value })}
            placeholder="Nome"
          />
        </aside>
        
        
        <aside className="w-[100%] flex flex-row gap-2 justify-between">
          <input
            className="w-[80%] p-1 bg-[#fff] rounded shadow"
            type="date"
            name="Saida"
            value={formData.Saida || ''}
            onChange={(e) => setFormData({ ...formData, Saida: e.target.value })}
          />
          <input
            className="w-[20%] p-1 bg-[#fff] rounded shadow"
            type="time"
            name="Horario"
            value={formData.Horario || ''}
            onChange={(e) => setFormData({ ...formData, Horario: e.target.value })}
          />
        </aside>
        
        
        <aside className="w-[100%] flex flex-row gap-2 justify-around">
          <input
            className="w-[30%] p-1 bg-[#fff] rounded shadow"
            type="number"
            name="Pedido"
            value={formData.Pedido || ''}
            onChange={(e) => setFormData({ ...formData, Pedido: e.target.value })}
            placeholder="Pedido"
          />
          <div className="flex justify-between w-[65%]">
            <input
              className="w-[49%] p-1 bg-[#fff] rounded shadow"
              type="number"
              name="Quantidade"
              value={formData.Quantidade || ''}
              onChange={(e) => setFormData({ ...formData, Quantidade: e.target.value })}
              placeholder="Quantidade"
            />
            <input
              className={`w-[49%] p-1 bg-[#fff] rounded shadow ${Number(formData.Valor) < 250 ? 'text-[#ff0000]' : ''}`} 
              type="text"
              name="Valor"
              value={formData.Valor || ''}
              onChange={(e) => setFormData({ ...formData, Valor: e.target.value })}
              placeholder="Valor"
            />
          </div>
        </aside>

        
        {/* <input
          className="p-1 bg-[#fff] rounded shadow w-[100%] text-center"
          type="text"
          name="Status"
          value={formData.Status || ''}
          onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
          placeholder="Status"
        /> */}
        <div className="w-[100%] p-1 shadow">
          <select
            value={
              formData.Valor <= 0
                ? "Agendado"
                : formData.Valor < 200
                ? "Entrada"
                : formData.Status
            }
            onChange={(e) =>setFormData({ ...formData, Status: e.target.value })}
            disabled={formData.Valor <= 0 || formData.Valor < 200}
            className={`
              w-full bg-transparent border 
              ${
                formData.Valor <= '0'
                  ? 'border-blue-400 text-blue-400'
                  : formData.Valor < 200
                  ? 'border-yellow-400 text-yellow-400'
                  : 'border-green-400 text-green-400'
              } 
              rounded px-2 py-1 outline-none transition-all duration-300
              futuristic-select
            `}
          >
            <option value="Agendado">Agendado</option>
            <option value="Entrada">Entrada</option>
            <option value="Pago">Pago</option>
          </select>
        </div>

        </div>

       
        <div className="mt-2 p-1 flex flex-row w-[99.5%] h-[15%] justify-end gap-3 text-white">
          
          <button type="button" className="p-1 rounded bg-[#ff0000]" onClick={() => setOpenWindowEdit(false)}>
            {message.btnCancel}
          </button>
          <button type="submit" className="p-1 rounded bg-[#37A2C2] hover:bg-blue-600">
            {message.btnConfirm}
          </button>
          
        </div>
      </form>
    </div>
  );
}
