import React, { useState, useEffect } from "react";
import { useAuth } from "../../provider/AuthContextProvider";
import StatusCheckpoint from "../check/StatusCheckPoint";

import { X, Minus, Square } from "lucide-react";

import "./menuprincipal.css";

const MenuPrincipal = ({ open, handleClosenMenu }) => {
  const { evento, addEvento } = useAuth();

  const [formData, setFormData] = useState({
    nome: "",
    pedido: "",
    horario: "",
    data: "",
    status: "",
  });

  const handleStatusChange = (newStatus) => {
    setFormData((prev) => ({ ...prev, status: newStatus }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do agendamento:", formData);

    addEvento(formData);
    alert("Carrinho agendado!");
    handleClosenMenu();
  };

  useEffect(() => {
    setFormData({
      nome: "",
      pedido: "",
      horario: "",
      data: "",
      status: "",
    });
  }, [evento]);

  return (
   
    <div className={`cantainer-main-menu-principal ${open ? "open-menu" : ""}`}>
      
      <section className="cantainer-main-menu-principal-cmd">
        
        <h5 className="text-2xl text-center text-purple-600">
          Agendar carrinho
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
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
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
              value={formData.pedido}
              onChange={(e) =>
                setFormData({ ...formData, pedido: Number(e.target.value) })
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
              value={formData.horario}
              onChange={(e) =>
                setFormData({ ...formData, horario: e.target.value })
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
              value={formData.data}
              onChange={(e) =>
                setFormData({ ...formData, data: e.target.value })
              }
              type="date"
              className="w-96 border p-1 rounded"
            />
          </div>
          <StatusCheckpoint onChange={ handleStatusChange} />
          <footer className="flex justify-around w-80 m-1 my-px">
            <button type="submit" className="p-1 bg-teal-400 rounded-sm">
              Salvar
            </button>
            <button
              type="button"
              className="p-1 rounded-sm bg-pink-800"
              onClick={handleClosenMenu}
            >
              Cancelar
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default MenuPrincipal; 