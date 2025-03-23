import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { getStoredEvents } from '../provider/AuthContextProvider.jsx';
  
  const Agendamentos = ({openPage, setOpenPage}) => {

    const appointments  = getStoredEvents();
    const listCabecalhoSheet = ['Data','Horário','Nome', 'Quantidade','Valor','Pedido','Situação'];
    const count = 0;
    const handleChangePage = () => {
      setOpenPage(!openPage);
    };

    return (
      <div className='flex-col'>
        <aside className='flex gap-3 p-2'>
          <button onClick={handleChangePage}><IoMdArrowBack/></button>
          <h2>Lista de Agendamentos</h2>
        </aside> 
        <header className="flex bg-[#963584]">
          {listCabecalhoSheet.map( (title) => ( <tr className="w-46">{title}</tr>))}
        </header>
        <div className=' flex-col h-96 p-1 justify-between '>
        {appointments.length === 0 ? (
          <p>Nenhum agendamento encontrado.</p>
        ) : (
          appointments.map((appointment) => (
            
            <div key={appointment.id} className="flex  ">
                   {/* <div className="w-2 h-8 bg-yellow-500 mr-2"></div> */}
                  
                   <span className="w-46">{appointment.Saida}</span>
                   <span className="w-46">{appointment.Horario}</span>
                   <span className="w-55 font-bold">{appointment.Cliente}</span>
                   <span className="w-40">{appointment.Quantidade}</span>
                   <span className="w-46">{appointment.Valor}</span>
                   <span className="w-46">{appointment.Pedido}</span>
                   <span className="w-46">{appointment.Status} {appointment.Status === "Pago" ? '✔' : appointment.status === "Entrada" ? '⚠' : '❌'}</span>
            </div>
          ))
        )}
        </div>
        
      </div>
    );
  };

  export default Agendamentos;
