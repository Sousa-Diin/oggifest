import { useNavigate } from 'react-router-dom';
import CustomWindow  from '../components/menumain/CustomWindow.jsx'
import { IoMdArrowBack } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { useAuth } from '../provider/AuthContextProvider.jsx';
import './Agendamentos.css'
import { useState } from 'react';
  
  const Agendamentos = ({openPage, setOpenPage}) => {

    const {evento, setLocalStorage}  = useAuth();
    const [openWindowEdit, setOpenWindowEdit] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const message = {
      title: "Editar agendamento",
      btnConfirm: "Editar",
      btnCancel: "Cancelar",
      ok: "Agendamento editado com sucesso!",
      error:"Erro ao edidtar.",
    }
    //const listCabecalhoSheet = ['Id', 'Data','Horário','Nome', 'Quantidade','Valor','Pedido','Situação', 'Ações'];
    const count = 0;
    const handleChangePage = () => {
      setOpenPage(!openPage);
    };

    return (
      <div className='container-data z-0'>
        <div className=' flex gap-3 p-1'>
          <button onClick={handleChangePage}><IoMdArrowBack/></button>
          <p>Lista de Agendamentos</p>
        </div> 
        <table className='container-data-table'>
          <thead>
            <tr className="flex title-cabecalho justify-between bg-[#E59E07]">
              <th className="w-12 text-center">Id</th>
              <th className="w-30 text-center">Saída</th>
              <th className="w-19 text-center">Horário</th>
              <th className="w-60 text-center">Cliente</th>
              <th className="w-20 text-center">Quantidade</th>
              <th className="w-35 text-center">Valor</th>
              <th className="w-15 text-center">Pedido</th>
              <th className="w-27 text-center">Status</th>
              <th className="w-25 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {evento.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">Nenhum agendamento encontrado.</td>
              </tr>
            ) : (
              evento.map((appointment) => (
                <tr key={appointment.Id} className="field-table-son text-zinc-700">
                  <td className="w-12 text-center p-1 shadow">{appointment.Id}</td>
                  <td className="w-30 p-1 shadow">{appointment.Saida}</td>
                  <td className="w-19 p-1 shadow">{appointment.Horario}</td>
                  <td className="w-60 p-1 shadow font-bold">{appointment.Cliente}</td>
                  <td className="w-25 p-1 shadow">{appointment.Quantidade}</td>
                  <td className={`w-30 p-1 shadow ${Number(appointment.Valor) < 250 ? 'text-[#ff0000]' : ''}`}>
                    R$ {appointment.Valor}
                  </td>
                  <td className="w-15 p-1 shadow">{appointment.Pedido}</td>
                  <td className="w-29 text-center p-1 shadow">
                    {appointment.Status} {appointment.Status === "Pago" ? '✔' : appointment.Status === "Entrada" ? '⚠' : '❓'}
                  </td>
                  <td className="flex gap-2 justify-center items-center p-1">
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setLocalStorage('editAppointment', appointment); // corrigido para enviar o correto
                        setOpenWindowEdit(true);
                      }}
                      className="btn-edit p-2 bg-[#37A2C2] shadow cursor-pointer"
                    >
                      <MdOutlineModeEditOutline />
                    </button>
                    <button
                      onClick={() => alert('Função desabilitada.')}
                      className="btn-delete p-2 bg-[#37A2C2] shadow cursor-pointer"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        { openWindowEdit  ?
          <aside className='flex items-center justify-center w-[95dvw] z-0 h-[100dvh] absolute top-0'
            style={{backgroundColor:"rgba(0,0,0,.5)"}}>
            <div className='flex w-[600px] h-[400px] z-1 items-center justify-center rounded shadow '>
              <CustomWindow title={'Editar Agendamento'} 
                openWindowEdit={openWindowEdit} 
                setOpenWindowEdit={setOpenWindowEdit}
                appointment={selectedAppointment} // Envia os dados para edição
                message={message}
              /> 
            </div>
          </aside> 
          : ""
        } 
      </div>
    );
  };

  export default Agendamentos;
