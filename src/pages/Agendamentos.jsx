import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { getStoredEvents } from '../provider/AuthContextProvider.jsx';
  
  const Agendamentos = ({openPage, setOpenPage}) => {

    const appointments  = getStoredEvents();
    const listCabecalhoSheet = ['Id', 'Data','Horário','Nome', 'Quantidade','Valor','Pedido','Situação', 'Ações'];
    const count = 0;
    const handleChangePage = () => {
      setOpenPage(!openPage);
    };

    return (
      <div className='flex-col lg:w-full md:dvw items-center'>
        <div className='flex gap-3 p-2'>
          <button onClick={handleChangePage}><IoMdArrowBack/></button>
          <p>Lista de Agendamentos</p>
        </div> 
        <table className='flex-col lg:w-full md:min-w-full'>
          <tr className="flex lg:justify-around lg:w-full md:w-dvw md:justify-between  p-1 bg-[#E59E07]">
            {listCabecalhoSheet.map( (title) => ( <td className="">{title}</td>))}
          </tr>
          <tr className='h-96 overflow-y-auto'>
            <div className=' flex-col p-1 justify-center '>
              {appointments.length === 0 ? (
                <p>Nenhum agendamento encontrado.</p>
              ) : (
                appointments.map((appointment) => (

                  <tr key={appointment.id} className="flex lg:w-full  justify-between lg:mb-1  lg:h-8 items-center text-zinc-700 ">
                         {/* <div className="w-2 h-8 bg-yellow-500 mr-2"></div> */}

                         <td className="bg-[#fcfcfc] lg:w-full md:w-full p-1 shadow ">{appointment.Id}</td>
                         <td className="bg-[#fcfcfc] lg:w-full md:w-full p-1 shadow  ">{appointment.Saida}</td>
                         <td className="bg-[#fcfcfc] lg:w-full md:w-full p-1 shadow ">{appointment.Horario}</td>
                         <td className="bg-[#fcfcfc] lg:w-full md:w-full p-1 shadow  font-bold">{appointment.Cliente}</td>
                         <td className="bg-[#fcfcfc] lg:w-full md:w-full p-1 shadow ">{appointment.Quantidade}</td>
                         <td className="bg-[#fcfcfc] lg:w-full md:w-full p-1 shadow ">{appointment.Valor}</td>
                         <td className="bg-[#fcfcfc] lg:w-full md:w-full p-1 shadow ">{appointment.Pedido}</td>
                         <td className="bg-[#fcfcfc] lg:w-full md:w-full p-1 shadow ">{appointment.Status} {appointment.Status === "Pago" ? '✔' : appointment.status === "Entrada" ? '⚠' : '❌'}</td>
                         <div className=' flex '>
                            <button className='lg:w-13 p-2  bg-[#37A2C2] cursor-pointer'><MdOutlineModeEditOutline /></button>
                            <button className='lg:w-13 p-2  bg-[#37A2C2] cursor-pointer'><RiDeleteBin6Line /></button>
                         </div>
                  </tr>
                ))
              )}
              </div>
          </tr>
         

        </table>
       

        
        
      </div>
    );
  };

  export default Agendamentos;
