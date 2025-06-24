import CustomWindow  from '../components/menumain/CustomWindow.jsx';
import { IoMdArrowBack } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdOutlineFilterListOff } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
import { useAuth } from '../provider/AuthContextProvider.jsx';
import './Agendamentos.css';
import car from '../assets/carrinho-oggi-front.png'
import PasswordModal from '../components/PasswordModal.jsx';
import Notie from '../service/notieService.js';
import { useState } from 'react';
import { FormattedDate, FormattedHour } from "../util/FormattedDate.js"; // Importando a função de formatação de hora
import { deleteAppointment } from '../service/AppointmentsService.js'; // Importando a função de exclusão de agendamento

const Agendamentos = ({ setActiveComponent }) => {
  const { setLocalStorage, evento } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [openWindowEdit, setOpenWindowEdit] = useState(false);
  const [pendingEdit, setPendingEdit] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState(null);


  const currentDate = new Date();
  const nomeMes = currentDate.toLocaleString('default', { month: 'long' });

  //Filtra agendamentos por nome cliente e data
  const matchesSearch = (appointment) => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return (
      appointment.cliente.toLowerCase().includes(search) ||
      appointment.saida.toLowerCase().includes(search) 
    );
  };

  const matchesFilter = (appointment) => {
    if (!filtroStatus) return true;
    return appointment.status.toLowerCase() === filtroStatus.toLowerCase();
  };

  const eventFilter = evento
    .filter((ev) => {
      const dataEvento = new Date(ev.saida);
      return (
        dataEvento.getMonth() === currentDate.getMonth() &&
        dataEvento.getFullYear() === currentDate.getFullYear()
      );
    })
    .filter(matchesSearch)
    .filter(matchesFilter)
    .sort((a, b) => a.horario.localeCompare(b.horario));

  const handleDeleteAppointment = (id) => {
    Notie.confirm(
      'Deseja mesmo excluir este agendamento?',
      () => {
        const cleanId = String(id).trim();
        const appointmentDeleted = deleteAppointment(cleanId);
        console.log('ID do agendamentos excluido:', cleanId);
        console.log('ID do agendamentos RETORNADO API:', appointmentDeleted.id);
        appointmentDeleted.then((res)=> {
          (res.status === 200) ? Notie.success(res.message) : Notie.error(res.message);
          setSearchTerm('');
        });
      },
      () => {
        Notie.info('Ação cancelada!');
        setSearchTerm('');
      }
    );
  };

  const handleChangePage = () => {
    setActiveComponent('oggifest');
  };

  const message = {
    title: "Editar agendamento",
    btnConfirm: "Editar",
    btnCancel: "Cancelar",
    ok: "Agendamento editado com sucesso!",
    error: "Erro ao editar."
  };

  console.log("Eventos.: ", evento);

  return (
    <div className='container-data z-0 '>
      <div className='flex w-full  justify-between p-2'>
        <section className='flex gap-2 items-center w-[90%]'>
          <button onClick={handleChangePage}><IoMdArrowBack /></button>
          <p>Lista de Agendamentos em</p>
          <p className='font-bold text-[#963584] capitalize'>{nomeMes}</p>
        </section>
        <IoFilter
          onClick={() => {
            Notie.select("Filtrar por status...",[
              { label: 'Todos', value: null },
              { label: 'Pago', value: 'Pago' },
              { label: 'Entrada', value: 'Entrada' },
              { label: 'Agendado', value: 'Agendado' }
            ],
              (selected) => setFiltroStatus(selected.value)
            );
          }}
          className='hover:text-[#E52C66]'
        />
      </div>

      <div className="flex w-full px-4 pb-2">
        <input
          type="text"
          placeholder="Buscar por, Cliente ou dia"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
          className="w-full p-2 border rounded shadow"
        />
         { searchTerm ? <MdClose className="relative right-7 top-3 text-pink-600 " onClick={()=>{setSearchTerm('')}} /> : ""}
      </div>
      {filtroStatus === null 
        ? null 
        : (<div className=" flex items-center gap-2 text-sm text-gray-600 px-4 pb-2">
            Filtro ativo: <strong>{filtroStatus}</strong>
            <MdOutlineFilterListOff onClick={()=> setFiltroStatus(null)} className='text-pink-600'/>
          </div>)
      }

      <table className='container-data-table'>
        <thead>
          <tr className=" flex title-cabecalho justify-between bg-[#E59E07]">
            <th className="w-30 text-center">Telefone</th>
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
      </table>

      <div className='h-[90dvh] p-0.3 overflow-y-auto'>
        <table className='container-data-table'>
          <tbody className='flex flex-col'>
            {eventFilter.length === 0 ? (
              <tr>
               <td colSpan="9" className="bg-image-car no-items-animation h-[86.5dvh] flex flex-col gap-2 items-center justify-center text-center">
                  <img src={car} alt="" className="w-20 opacity-70" />
                  Nenhum agendamento encontrado.
                </td>

              </tr>
            ) : (
              eventFilter.map((appointment) => (
                <tr key={appointment.id} className="field-table-son text-zinc-700">
                  <td className="w-30 text-center p-1 shadow">{appointment.telefone}</td>
                  <td className="w-30 p-1 shadow">  {FormattedDate(appointment.saida)}</td>
                  <td className="w-19 p-1 shadow">{FormattedHour(appointment.horario)}</td>
                  <td className="w-60 p-1 shadow font-bold">{appointment.cliente}</td>
                  <td className="w-25 p-1 shadow">{appointment.quantidade}</td>
                  <td className={`w-30 p-1 shadow ${Number(appointment.valor) < 250 ? 'text-[#ff0000]' : ''}`}>R$ {appointment.valor}</td>
                  <td className="w-15 p-1 shadow">{appointment.pedido}</td>
                  <td
                    className={`w-29 text-center  p-1 shadow ${
                      appointment.status === "pago"
                        ? "text-[#008000]"
                        : appointment.status === "entrada"
                        ? "text-[#e9be0b]"
                        : "text-[#1E3A8A]"
                    }`}
                  >
                    {appointment.status} {appointment.status === "Pago" ? '✔' : appointment.status === "Entrada" ? '⚠' : '❔'}
                  </td>
                  <td className="flex gap-2 justify-center items-center p-1">
                    <button
                      onClick={() => {
                        setShowPasswordModal(true);
                        setSearchTerm(appointment.cliente);
                        setPendingEdit(appointment);
                      }}
                      className="btn-edit p-2 bg-[#37A2C2] shadow cursor-pointer"
                    >
                      <MdOutlineModeEditOutline />
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)}
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
      </div>

      {openWindowEdit && (
        <aside className='flex items-center justify-center w-[96dvw] z-0 h-[100dvh] absolute top-0' style={{ backgroundColor: "rgba(0,0,0,.5)" }}>
          <div className='flex w-[50%] h-[65%] z-1 items-center justify-center rounded shadow'>
            <CustomWindow
              title={'Editar Agendamento'}
              openWindowEdit={openWindowEdit}
              setOpenWindowEdit={setOpenWindowEdit}
              appointment={selectedAppointment}
              message={message}
              action={'edit'}
            />
          </div>
        </aside>
      )}

      {showPasswordModal && (
        <PasswordModal
          onClose={() => {setShowPasswordModal(false);setSearchTerm("");}}
          onConfirm={(value) => {
            if (value === 'oggi4321') {
              setSelectedAppointment(pendingEdit);
              setLocalStorage('editAppointment', pendingEdit);
              setOpenWindowEdit(true);
            } else {
              Notie.error('Senha incorreta!');
            }
            setShowPasswordModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Agendamentos;
