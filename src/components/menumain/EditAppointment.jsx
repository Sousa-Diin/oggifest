import React, { useState, useEffect } from "react";
import { useAuth } from "../../provider/AuthContextProvider";
import StatusCheckpoint from "../check/StatusCheckPoint";
import { formattedDate } from "../../util/FormattedDate.js"; // Importando a função de formatação de hora

/* import "./menuprincipal.css"; */

const EditAppoitment = ({ message, appointment,handleClosenMenu }) => {
  const {  addEvento, formatarData  } = useAuth();

  const [formData, setFormData] = useState(appointment || {});

  const handleStatusChange = (newStatus) => {
    setFormData((prev) => ({ ...prev, Status: newStatus }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do agendamento:", formData);

    formData.Saida = formatarData(formData.saida);

    addEvento(formData,'edit');
    alert(message.ok);
    handleClosenMenu();
  };


  useEffect(() => {
    setFormData(appointment || {});  // Atualiza quando o agendamento muda
  }, [appointment]);

  return (
   
    <div className='cantainer-main-menu-principal '>
      
      <section className="">
        
        <h5 className="text-2xl text-center text-purple-600">
         {message.title}
        </h5>
        
        <form
          className="flex flex-col p-2 justify-between bg-mygelowhite h-72"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-row justify-between items-center">
            <label htmlFor="nome" className="  w-25 p-2 ">
              Nome:
            </label> 
            <input
              id="nome"
              value={formData.Cliente}
              onChange={(e) =>
                setFormData({ ...formData, Cliente: e.target.value })
              }
              type="text"
              placeholder="Digite o nome"
              className="w-96 border p-1 rounded"
            />
          </div>

          <div className="flex flex-row justify-around items-center">
            <label htmlFor="order" className="p-2  w-25 ">
              Pedido:
            </label>
            <input
              id="order"
              value={formData.Pedido}
              onChange={(e) =>
                setFormData({ ...formData, Pedido: Number(e.target.value) })
              }
              type="number"
              placeholder="Digite número do pedido"
              className="w-96 border p-1 rounded"
            />
          </div>

          <div className="flex flex-row justify-around items-center">
            <label htmlFor="hour" className="p-2  w-25 ">
              Horário:
            </label>
            <input
              id="hour"
              value={formattedDate(formData.Horario)}
              onChange={(e) =>
                setFormData({ ...formData, Horario: e.target.value })
              }
              type="time"
              className="w-96 border p-1 rounded"
            />
          </div>

          <div className="flex flex-row justify-around items-center">
            <label htmlFor="data" className="p-2 w-25 ">
              Data:
            </label>
            <input
              id="data"
              value={formData.Saida}
              onChange={(e) =>
                setFormData({ ...formData, Saida: e.target.value })
              }
              type="date"
              className="w-96 border p-1 rounded"
            />
          </div>
          <StatusCheckpoint onChange={ handleStatusChange} />
          <footer className="flex justify-around w-80 m-1 my-px">
            <button type="submit" className="p-1 bg-teal-400 rounded-sm">
              {message.btnConfirm}
            </button>
            <button
              type="button"
              className="p-1 rounded-sm bg-pink-800"
              onClick={handleClosenMenu}
            >
              {message.btnCancel}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default EditAppoitment; 