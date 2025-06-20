import CustomWindow  from '../components/menumain/CustomWindow.jsx'
import { IoMdArrowBack } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
import { useAuth } from '../provider/AuthContextProvider.jsx';
import './Agendamentos.css';
import car from '../assets/carrinho-oggi-front.png'
import PasswordModal from '../components/PasswordModal.jsx';
import Notie from '../service/notieService.js';
import { useState, useEffect } from 'react';

const Agendamentos = ({ setActiveComponent }) => {
  const { setLocalStorage, formatarData } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [openWindowEdit, setOpenWindowEdit] = useState(false);
  const [pendingEdit, setPendingEdit] = useState(null);
  const [evento, setEvento] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState(null);

  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem('agendamentos')) || [];
    setEvento(storedAppointments);
  }, []);

  const updateLocalStorage = (key, setEvento, newList) => {
    localStorage.setItem(key, JSON.stringify(newList));
    setEvento(newList);
  };

  const currentDate = new Date();
  const nomeMes = currentDate.toLocaleString('default', { month: 'long' });

  //Filtra agendamentos por nome cliente e data
  const matchesSearch = (appointment) => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return (
      appointment.Cliente.toLowerCase().includes(search) ||
      appointment.Saida.toLowerCase().includes(search) 
    );
  };

  const matchesFilter = (appointment) => {
    if (!filtroStatus) return true;
    return appointment.Status.toLowerCase() === filtroStatus.toLowerCase();
  };

  const eventFilter = evento
    .filter((ev) => {
      const dataEvento = new Date(ev.Saida);
      return (
        dataEvento.getMonth() === currentDate.getMonth() &&
        dataEvento.getFullYear() === currentDate.getFullYear()
      );
    })
    .filter(matchesSearch)
    .filter(matchesFilter)
    .sort((a, b) => a.Horario.localeCompare(b.Horario));

  const handleDeleteAppointment = (id) => {
    Notie.confirm(
      'Deseja mesmo excluir este agendamento?',
      () => {
        const updatedAppointments = evento.filter(item => item.Id !== id);
        updateLocalStorage('agendamentos', setEvento, updatedAppointments);
        Notie.success('Agendamento removido com sucesso!');
      },
      () => {
        Notie.info('Ação cancelada!');
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

  return (
    <div className='container-data z-0'>
      <div className='flex justify-between items-center p-2'>
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

      <div className="px-4 pb-2">
        <input
          type="text"
          placeholder="Buscar por, Cliente ou dia"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
          className="w-full p-2 border rounded shadow"
        />
      </div>
      {filtroStatus === null 
        ? null 
        : (<div className="text-sm text-gray-600 px-4 pb-2">
            Filtro ativo: <strong>{filtroStatus}</strong>
          </div>)
      }

      <table className='container-data-table'>
        <thead>
          <tr className="w-full flex title-cabecalho justify-between bg-[#E59E07]">
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
      </table>

      <div className='h-[86.8dvh] overflow-y-auto'>
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
                <tr key={appointment.Id} className="field-table-son text-zinc-700">
                  <td className="w-12 text-center p-1 shadow">{appointment.Id}</td>
                  <td className="w-30 p-1 shadow">{appointment.Saida}</td>
                  <td className="w-19 p-1 shadow">{appointment.Horario}</td>
                  <td className="w-60 p-1 shadow font-bold">{appointment.Cliente}</td>
                  <td className="w-25 p-1 shadow">{appointment.Quantidade}</td>
                  <td className={`w-30 p-1 shadow ${Number(appointment.Valor) < 250 ? 'text-[#ff0000]' : ''}`}>R$ {appointment.Valor}</td>
                  <td className="w-15 p-1 shadow">{appointment.Pedido}</td>
                  <td
                    className={`w-29 text-center  p-1 shadow ${
                      appointment.Status === "Pago"
                        ? "text-[#008000]"
                        : appointment.Status === "Entrada"
                        ? "text-[#e9be0b]"
                        : "text-[#1E3A8A]"
                    }`}
                  >
                    {appointment.Status} {appointment.Status === "Pago" ? '✔' : appointment.Status === "Entrada" ? '⚠' : '❔'}
                  </td>
                  <td className="flex gap-2 justify-center items-center p-1">
                    <button
                      onClick={() => {
                        setShowPasswordModal(true);
                        setSearchTerm(appointment.Cliente);
                        setPendingEdit(appointment);
                      }}
                      className="btn-edit p-2 bg-[#37A2C2] shadow cursor-pointer"
                    >
                      <MdOutlineModeEditOutline />
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(appointment.Id)}
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
