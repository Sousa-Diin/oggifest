import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { getStoredEvents } from '../provider/AuthContextProvider.jsx';
  
import React, { useAuth } from "../provider/AuthContextProvider.jsx"
  
  const Agendamentos = () => {

    const appointments  = getStoredEvents();
    const navigate = useNavigate();

    const handleChangePage = () => {
      navigate("/oggifest/")
    };

    return (
      <div className='flex flex-wrap'>
        <button onClick={handleChangePage}><IoMdArrowBack/></button>
        <h2>Lista de Agendamentos</h2>
        {appointments.length === 0 ? (
          <p>Nenhum agendamento encontrado.</p>
        ) : (
          appointments.map((appointment) => (
            <div className='w-50' key={appointment.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
              <h3 className='text-[#E59E07] '>{appointment.Cliente}</h3>
              <p>Data: {appointment.Saida}</p>
              <p>Hora: {appointment.Horario}</p>
              <p>Status: {appointment.Status}</p>
              <pre>Pedido: {appointment.Pedido}</pre>
              <button onClick={null}>Remover</button>
            </div>
          ))
        )}
      </div>
    );
  };

  export default Agendamentos;
