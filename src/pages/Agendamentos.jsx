import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { useAuth } from '../provider/AuthContextProvider.jsx';
import './Agendamentos.css'
  
  const Agendamentos = ({openPage, setOpenPage}) => {

    const {evento}  = useAuth();
    //const listCabecalhoSheet = ['Id', 'Data','Horário','Nome', 'Quantidade','Valor','Pedido','Situação', 'Ações'];
    const count = 0;
    const handleChangePage = () => {
      setOpenPage(!openPage);
    };

    return (
      <div className='container-data'>
        <div className='flex gap-3 p-1'>
          <button onClick={handleChangePage}><IoMdArrowBack/></button>
          <p>Lista de Agendamentos</p>
        </div> 
        <table className='container-data-table'>
          <tr className="flex  title-cabecalho justify-between  bg-[#E59E07]">
            {/* {listCabecalhoSheet.map( (title) => ( <tr className="">{title}</tr>))} */}
            <td className="w-12 text-center"> Id</td>
            <td className="w-30 text-center"> Saida</td>
            <td className="w-15 text-center"> Horario</td>
            <td className="w-60 text-center"> Cliente</td>
            <td className="w-20 text-center"> Quantidade</td>
            <td className="w-40 text-center"> Valor</td>
            <td className="w-10 text-center"> Pedido</td>
            <td className="w-25 text-center">Status</td>
            <td className="w-25 text-center">Ações</td>
          </tr>
          <tr className='field-table'>
            <div className=''>
              {evento.length === 0 ? (
                <p>Nenhum agendamento encontrado.</p>
              ) : (
                evento.map((appointment) => (

                  <tr key={appointment.id} className="field-table-son  text-zinc-700 ">
                         {/* <div className="w-2 h-8 bg-yellow-500 mr-2"></div> */}

                         <td className="w-12 h-8 p-1 shadow ">{appointment.Id}</td>
                         <td className="w-30 h-8 p-1 shadow  ">{appointment.Saida}</td>
                         <td className="w-15 h-8 p-1 shadow ">{appointment.Horario}</td>
                         <td className="w-60 h-8 p-1 shadow  font-bold">{appointment.Cliente}</td>
                         <td className="w-25 h-8 p-1 shadow ">{appointment.Quantidade}</td>
                         <td className={`w-30 h-8 p-1 shadow ${appointment.Valor <  '250' ? 'text-[#ff0000]': ''}`}>R$ {appointment.Valor}</td>
                         <td className="w-15 h-8 p-1 shadow ">{appointment.Pedido}</td>
                         <td className="w-29 h-8 p-1 shadow ">{appointment.Status} {appointment.Status === "Pago" ? '✔' : appointment.Status === "Entrada" ? '⚠' : '❓'}</td>
                         <div className=' flex '>
                            <button onClick={()=> alert('Função desabilitada.')} className=' btn-edit p-2 bg-[#37A2C2] shadow cursor-pointer'><MdOutlineModeEditOutline /></button>
                            <button onClick={()=> alert('Função desabilitada.')} className=' btn-delete p-2 bg-[#37A2C2] shadow cursor-pointer'><RiDeleteBin6Line /></button>
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
