import React from "react";
import { useState } from "react";

import './menuprincipal.css';


const MenuPrincipal = ({open, handleClosenMenu}) => {
  const [nome, setNome] = useState("");
  const [pedido, setPedido] = useState("");
  const [horario, setHorario] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("");
  return (
    <div className={`cantainer-main-menu-principal ${open ? 'open-menu' : ''}`}>
      <section className="cantainer-main-menu-principal-cmd">
      <form className=" flex flex-col p-2 h-80 justify-between bg-mygelowhite">
      <div className="flex flex-row justify-around items-center">
        <label htmlFor="nome" className="p-2">Nome:</label>
        <input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          type="text"
          placeholder="Digite o nome"
          className="w-96 border p-1 rounded"
        />
      </div>

      <div className="flex flex-row justify-around items-center">
        <label htmlFor="order" className="p-2">Pedido:</label>
        <input
          id="order"
          value={pedido}
          onChange={(e) => setPedido(e.target.value)}
          type="number"
          placeholder="Digite número do pedido"
          className="w-96 border p-1 rounded"
        />
      </div>

      <div className="flex flex-row justify-around items-center">
        <label htmlFor="hour" className="p-2">Horário:</label>
        <input
          id="hour"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          type="time"
          className="w-96 border p-1 rounded"
        />
      </div>

      <div className="flex flex-row justify-around items-center">
        <label htmlFor="data" className="p-2">Data:</label>
        <input
          id="data"
          value={data}
          onChange={(e) => setData(e.target.value)}
          type="date"
          className="w-96 border p-1 rounded"
        />
      </div>

      <div className="flex flex-row justify-around items-center">
        <label htmlFor="status" className="p-2">Status:</label>
        <input
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          type="text"
          placeholder="Digite o status"
          className="w-96 border p-1 rounded"
        />
      </div>
    </form>
       <footer className="flex  justify-between m-1 my-px">
          <button className="p-1 bg-teal-400  rounded-sm bg-mysecondary " onClick={{}} >Salvar</button>
          <button className="p-1 bg-teal-400 rounded-sm bg-myprimary " onClick={handleClosenMenu} >Cancelar</button>
       </footer>
      
      </section>
    </div>
  )

}

export default MenuPrincipal;