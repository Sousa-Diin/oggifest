import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { getStoredEvents } from '../provider/AuthContextProvider.jsx';
  
  const Agendamentos = ({openPage, setOpenPage}) => {

    const appointments  = getStoredEvents();

    const handleChangePage = () => {
      setOpenPage(!openPage);
    };

    return (
      <div className='flex-col'>
        <aside className='flex gap-3 p-2'>
          <button onClick={handleChangePage}><IoMdArrowBack/></button>
          <h2>Lista de Agendamentos</h2>
        </aside> 
        <div className=' flex-col h-96 p-1 justify-between '>
        {appointments.length === 0 ? (
          <p>Nenhum agendamento encontrado.</p>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="flex  border ">
                   {/* <div className="w-2 h-8 bg-yellow-500 mr-2"></div> */}
                   <span className="w-30">⌚{appointment.Horario}</span>
                   <span className="w-60 font-bold">{appointment.Cliente}</span>
                   <span className="w-60">{appointment.Quantidade}</span>
                   <span className="w-60">Pedido: {appointment.Pedido}</span>
                   <span className="w-40">{appointment.Status} {appointment.Status === "Pago" ? '✔' : appointment.status === "Entrada" ? '⚠' : '❌'}</span>
            </div>
          ))
        )}
        </div>
        
      </div>
    );
  };

  export default Agendamentos;
