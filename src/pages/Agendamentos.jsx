import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import {agendamentos} from '../service/ListAgendar.js'

  
import React, { useAuth } from "../provider/AuthContextProvider.jsx"
  
  const Agendamentos = () => {
    const {getStoredEvents} = useAuth();

    const appointments  = getStoredEvents();
    const navigate = useNavigate();

    const handleChangePage = () => {
      navigate("/oggi/main/car")
    };

    return (
      <div>
        <button onClick={handleChangePage}><IoMdArrowBack/></button>
        <h2>Lista de Agendamentos</h2>
        {appointments.length === 0 ? (
          <p>Nenhum agendamento encontrado.</p>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
              <h3 className='text-[#E59E07] '>{appointment.nome}</h3>
              <p>Data: {appointment.data}</p>
              <p>Hora: {appointment.horario}</p>
              <p>Status: {appointment.status}</p>
              <pre>Pedido: {appointment.pedido}</pre>
              <button onClick={null}>Remover</button>
            </div>
          ))
        )}
      </div>
    );
  };

  export default Agendamentos;
