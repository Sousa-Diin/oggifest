import { useState, useEffect } from 'react';
import CustomWindow from '../components/menumain/CustomWindow.jsx';
import { IoMdArrowBack } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline, MdOutlineFilterListOff, MdClose } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
import { Sun, Moon } from "lucide-react"; // Ícones para toggle
import { useAuth } from '../provider/AuthContextProvider.jsx';
import './Agendamentos.css';
import car from '../assets/carrinho-oggi-front.png';
import PasswordModal from '../components/PasswordModal.jsx';
import LoadSplash from "../pages/splash/LoadSplash.jsx";
import Notie from '../service/notieService.js';
import { FormattedDate, FormattedHour, formatarTelefone } from "../util/FormattedDate.js";
import { deleteAppointment } from '../service/AppointmentsService.js';
import { PASSWORD_DELETE, PASSWORD_EDIT } from '../service/authSheets.js';
import monthOfYear from '../util/date.js';

const Agendamentos = ({ setActiveComponent }) => {
  const { evento } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [atributePassword, setAtributePassword] = useState("");
  const [openWindowEdit, setOpenWindowEdit] = useState(false);
  const [pendingEdit, setPendingEdit] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sortConfig, setSortConfig] = useState({ key: "saida", direction: "asc" });


  // Tema dark/light
  const [theme, setTheme] = useState("light");

  // Carrega tema do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // alterna entre asc e desc
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };


  // Alternar tema
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

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
    /* .sort((a, b) => a.horario.localeCompare(b.horario)); */
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      let valA, valB;
      if (sortConfig.key === "saida") {
        valA = new Date(a.saida);
        valB = new Date(b.saida);
      } else if (sortConfig.key === "horario") {
        valA = a.horario;
        valB = b.horario;
      }
    
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });


  useEffect(() => {
    // Se evento ainda não veio ou é indefinido, mantemos carregando
    if (!evento || evento.length === 0) {
      setLoading(true);
    } else {
      // Quando já temos dados, desativa o loading
      setLoading(false);
    }
  }, [evento]);


  const handleDeleteAppointment = () => {
    const id = pendingDelete;
    Notie.confirm(
      'Deseja mesmo excluir este agendamento?',
      () => {
        const cleanId = String(id).trim();
        const appointmentDeleted = deleteAppointment(cleanId);
        appointmentDeleted.then((res) => {
          res.status === 200 ? Notie.success(res.message) : Notie.error(res.message);
          setSearchTerm('');
          setPendingDelete(null);
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

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"} container-data min-h-screen`}>
      
      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center h-[96dvh]">
          <LoadSplash />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-wrap w-full justify-between items-center gap-2 p-2">
            <section className="flex flex-wrap gap-2 items-center">
              <button 
                onClick={handleChangePage} 
                className="text-lg hover:text-[#E52C66]"
              >
                <IoMdArrowBack />
              </button>
              <label htmlFor="months" className="font-medium">Agendamentos de</label>
              <select
                className="font-bold text-[#963584] capitalize border rounded px-2 py-1"
                defaultValue={monthOfYear()[currentDate.getMonth()]}
                onChange={(e) => {
                  const monthIndex = monthOfYear().indexOf(e.target.value);
                  setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
                }}
              >
                {monthOfYear().map((month, index) => (
                  <option key={index} className="capitalize" value={month}>
                    {month}
                  </option>
                ))}
              </select>

              {/* Seleção de Ano */}
              <select
                className="ml-2 font-bold text-[#963584] border rounded px-2 py-1"
                value={currentDate.getFullYear()}
                onChange={(e) =>
                  setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1))
                }
              >
                {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </section>

            <div className="flex items-center gap-3">
              {/* Toggle Dark/Light */}
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Filtro */}
              <IoFilter
                onClick={() => {
                  Notie.select("Filtrar por status...", [
                    { label: 'Todos', value: null },
                    { label: 'Pago', value: 'Pago' },
                    { label: 'Entrada', value: 'Entrada' },
                    { label: 'Agendado', value: 'Agendado' },
                    { label: 'Cancelado', value: 'Cancelado' }
                  ], (selected) => setFiltroStatus(selected.value));
                }}
                className="text-xl hover:text-[#E52C66] cursor-pointer"
              />
            </div>
          </div>

          {/* Campo de busca */}
          <div className="flex w-full gap-2 px-2 mb-3">
            <input
              type="text"
              placeholder="Buscar cliente ou dia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              className="w-full p-2 border rounded shadow-sm"
            />
            {searchTerm && (
              <MdClose 
                className="text-xl text-pink-600 cursor-pointer self-center" 
                onClick={() => setSearchTerm('')} 
              />
            )}
          </div>

          {/* Filtro ativo */}
          {filtroStatus && (
            <div className="flex items-center gap-2 text-sm text-gray-600 px-4 pb-2">
              Filtro ativo: <strong>{filtroStatus}</strong>
              <MdOutlineFilterListOff onClick={() => setFiltroStatus(null)} className='text-pink-600 cursor-pointer' />
            </div>
          )}

          {/* Tabela */}
          <div className="overflow-x-auto px-2 pb-4">
            <table className="w-[93dvw] border-collapse rounded-lg overflow-hidden shadow-sm">
              <thead className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-800"} text-white text-sm uppercase tracking-wider`}>
                <tr >
                  <th className="px-4 py-2 text-center min-w-[120px]">Telefone</th>
                  <th className="px-4 py-2 text-center min-w-[120px] cursor-pointer select-none"
                    onClick={() => handleSort("saida")}
                  >
                    Saída {sortConfig.key === "saida" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th 
                    className="px-4 py-2 text-center min-w-[100px] cursor-pointer select-none"
                    onClick={() => handleSort("horario")}
                  >
                    Horário {sortConfig.key === "horario" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>

                  <th className="px-4 py-2 text-center min-w-[160px]">Cliente</th>
                  <th className="px-4 py-2 text-center min-w-[80px]">Qtd</th>
                  <th className="px-4 py-2 text-center min-w-[120px]">Valor</th>
                  <th className="px-4 py-2 text-center min-w-[120px]">Pedido</th>
                  <th className="px-4 py-2 text-center min-w-[140px]">Status</th>
                  <th className="px-4 py-2 text-center min-w-[120px]">Ações</th>
                </tr>
              </thead>

              <tbody className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} divide-y`}>
                {eventFilter.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-gray-500">
                      <img src={car} alt="" className="w-16 mx-auto opacity-50 mb-2" />
                      Nenhum agendamento encontrado.
                    </td>
                  </tr>
                ) : (
                  eventFilter.map((appointment) => (
                    <tr key={appointment.id} className="content-table text-sm">
                      <td className="px-4 py-2 text-center">{formatarTelefone(appointment.telefone)}</td>
                      <td className="px-4 py-2 text-center">{FormattedDate(appointment.saida)}</td>
                      <td className="px-4 py-2 text-center">{FormattedHour(appointment.horario)}</td>
                      <td className="px-4 py-2 font-medium">{appointment.cliente}</td>
                      <td className="px-4 py-2 text-center">{appointment.quantidade}</td>
                      <td className={`px-4 py-2 text-center font-semibold ${Number(appointment.valor) < 250 ? 'text-red-600': Number(appointment.valor) > 250 ?'text-': 'text-white'}`}>
                        R$ {appointment.valor}
                      </td>
                      <td className="px-4 py-2 text-center">{appointment.pedido}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          appointment.status === "Pago" ? "bg-green-100 text-green-700" :
                          appointment.status === "Entrada" ? "bg-yellow-100 text-yellow-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex gap-2 justify-center">
                        <button 
                          onClick={() => { setShowPasswordModal(true); setAtributePassword('editar'); setPendingEdit(appointment); }}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          <MdOutlineModeEditOutline />
                        </button>
                        <button 
                          onClick={() => { setShowPasswordModal(true); setAtributePassword('deletar'); setPendingDelete(appointment.id); }}
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
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
        </>
      )}

      {/* Modal edição */}
      {openWindowEdit && (
        <aside className='flex items-center justify-center w-[96dvw] z-50 h-[100dvh] absolute top-0 left-0 bg-black/50'>
          <div className='flex w-[95%] md:w-[50%] h-[65%] items-center justify-center rounded shadow bg-white'>
            <CustomWindow
              message={message}
              action={'edit'}
              title={'Editar Agendamento'}
              openWindowEdit={openWindowEdit}
              setOpenWindowEdit={setOpenWindowEdit}
              appointment={selectedAppointment}
            />
          </div>
        </aside>
      )}

      {/* Modal senha */}
      {showPasswordModal && (
        <PasswordModal
          message={{ title: `Digite a senha para ${atributePassword} o agendamento` }}
          onClose={() => {
            setShowPasswordModal(false);
            setSearchTerm("");
          }}
          onConfirm={(value) => {
            try {
              if (atributePassword === 'editar' && value === PASSWORD_EDIT) {
                setOpenWindowEdit(true);
                setSelectedAppointment(pendingEdit);
                setShowPasswordModal(false);
              } else if (atributePassword === 'deletar' && value === PASSWORD_DELETE) {
                handleDeleteAppointment();
              } else if (!value || value.trim() === '') {
                throw new Error("Senha não pode ser vazia!");
              } else {
                throw new Error('Senha incorreta!');
              }
            } catch (error) {
              Notie.error(error.message);
            }
            setShowPasswordModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Agendamentos;
