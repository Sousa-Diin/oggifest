import { useState, useEffect } from "react";
import { useAuth } from "../../provider/AuthContextProvider";
import { X } from "lucide-react";

export default function CustomWindow({message, openWindowEdit, setOpenWindowEdit, appointment}) {
  const { evento, addEvento  } = useAuth();
  const [formData, setFormData] = useState(appointment || {} || evento); // Estado inicial com os dados

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do agendamento:", formData);

    addEvento(formData);
    alert(message.ok);
    setOpenWindowEdit(false);
  };


  useEffect(() => {
    setFormData(appointment || {} || evento);  // Atualiza quando o agendamento muda
  }, [appointment]);
  return (
    <div
      className=' shadow bg-[#EAE8E1] transition-all duration-300 w-[98.5%] h-[98%]'
    >
      <div className="flex  items-center text-[#fcfcfc] justify-between px-2 py-1 bg-[#E59E07]">
        <span className="font-bold">{message.title}</span>
        <div className="flex gap-2">
          <button onClick={() => setOpenWindowEdit(!openWindowEdit)} className="hover:text-[#E52C66] pointer rounded">
            <X size={23} />
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col justify-around items-center w-[588px] h-[70%] p-1">
        <aside className="w-[100%] flex flex-row gap-2 justify-between">
          <input className="w-[25%] p-1 bg-[#fff] rounded shadow "
            type="number" 
            value={formData.Id || ''} 
            disabled
            placeholder="id"
          />
          <input className="w-[75%] p-1 bg-[#fff] rounded shadow "
            type="text" 
            value={formData.Cliente || ''} 
            onChange={(e) => setFormData({ ...formData, Cliente: e.target.value })} 
            placeholder="Nome"
          />
        </aside>
       
       <aside className="w-[100%] flex flex-row gap-2 justify-between">
        <input className="w-[80%] p-1 bg-[#fff] rounded shadow "
            type="date" 
            value={formData.Saida || ''} 
            onChange={(e) => setFormData({ ...formData, Saida: e.target.value })}
          />
        <input className="w-[20%] p-1 bg-[#fff] rounded shadow "
          type="time" 
          value={formData.Horario || ''} 
          onChange={(e) => setFormData({ ...formData, Horario: e.target.value })} 
        />
       </aside>
       <aside className="w-[100%] flex flex-row gap-2 justify-around">
        <input className="w-[30%] p-1 bg-[#fff] rounded shadow "
            type="number" 
            value={formData.Pedido || ''} 
            onChange={(e) => setFormData({ ...formData, Pedido: e.target.value })} 
            placeholder="Pedido"
          />
          <div className="flex justify-between">
          <input className="w-[49%] p-1 bg-[#fff] rounded shadow "
            type="number" 
            value={formData.Quantidade || ''} 
            onChange={(e) => setFormData({ ...formData, Quantidade: e.target.value })} 
            placeholder="Quantidade"
          />
          <input className={`w-[49%] p-1 bg-[#fff] rounded shadow ${formData.Valor < '250' ? 'text-[#ff0000]' : ''}`} 
            type="text" 
            value={formData.Valor || ''} 
            onChange={(e) => setFormData({ ...formData, Valor: e.target.value })} 
            placeholder="Valor"
          />
          </div>
          
       </aside>
        
        
        <input className="p-1 bg-[#fff] rounded shadow w-[100%] text-center"
          type="" 
          value={formData.Status || ''} 
          onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
          placeholder="Status"
        />

        </form>
      <div className="mt-2 p-1 flex flex-row w-[99.5%] h-[15%] justify-end gap-3  text-white">
        <button className="p-1 rounded bg-[#ff0000]" variant="ghost" onClick={() => setOpenWindowEdit(false)}>{message.btnCancel}</button>
        <button type="submit" className="p-1 rounded bg-[#37A2C2] hover:bg-blue-600">{message.btnConfirm}</button>
      </div>
    </div>
  );
}



