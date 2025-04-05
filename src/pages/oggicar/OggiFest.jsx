import { useState } from "react";
import { FaSearch, FaPlus, FaTrash } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './OggiFest.css';
import CustomWindow from "../../components/menumain/CustomWindow";
import { useAuth } from '../../provider/AuthContextProvider';

export default function OggiFest() {
  const { evento, setEvento, addEvento } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [termoBusca, setTermoBusca] = useState("");
  const [open, handleOpenMenu] = useState(false);

  const message = {
    title: "Agendar Carrinho",
    btnConfirm: "Salvar",
    btnCancel: "Cancelar",
    ok: "Carrinho agendado!",
    error:"Erro ao agendar o carrinho.",
  }

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(selectedDate);

  const formatarData = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      console.error("Data inválida:", date);
      return ""; // Retorna uma string vazia para evitar erro
    }
    return date.toISOString().split("T")[0];
  };

  // 🔍 Filtro por data e termo de busca
  const agendamentosFiltrados = evento
    .filter(
      (ev) =>
        formatarData(new Date(ev.Saida)) === formatarData(selectedDate) &&
        ev.Cliente.toLowerCase().includes(termoBusca.toLowerCase())
    )
    .sort((a, b) => a.Horario.localeCompare(b.Horario));

  // 🗑 Função para limpar agendamentos
  const limparAgendamentos = () => {
    localStorage.removeItem('agendamentos');
    setEvento([]);
    
  };

  /* const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do agendamento:", formData);
    
    const convertData = Object.fromEntries(formData.entries());
    addEvento(convertData);
    alert(message.ok);
    handleOpenMenu();
  };
 */
  return (
    <div className="flex h-full lg:h-dvh">
      <section className="flex-1 section-agender">
        <h1 className="flex-1 text-center font-bold p-2 text-xl text-pink-600" style={{ backgroundColor: '#EAE8E1' }}>
          CARRINHO - OGGI FEST
        </h1>
        <div className="flex-1 container-agender p-1">
          <header className="flex w-full p-1 items-center justify-between border-b">
            <div className="relative bg-blue-50">
              <input 
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                type="text"
                placeholder="Buscar por nome"
                className="w-96 border p-2 rounded"
              />
              <FaSearch className="absolute right-3 top-3 text-pink-600 " />
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleOpenMenu(!open)} className="bg-pink-600 text-white p-2 rounded-full">
                <FaPlus />
              </button>
              <button onClick={limparAgendamentos} className="bg-red-500 text-white p-2 rounded-full">
                <FaTrash />
              </button>
            </div>
          </header>
          { open ?
             <aside className='flex items-center justify-center w-[94.5dvw]  h-[100%] absolute top-0'
                style={{backgroundColor:"rgba(0,0,0,.5)"}}>
                <div className='flex w-[600px] h-[400px] z-1 items-center justify-center rounded shadow '>
                  <CustomWindow 
                    openWindowEdit={open} 
                    setOpenWindowEdit={handleOpenMenu}
                    appointment={evento} // Envia os dados para edição
                    message={message}
                  /> 
                </div>
            </aside> : ''
          }
          

          <div className="flex-col bg-white mt-1 p-1 shadow">
            <aside className="flex w-3/4 justify-between">
              <p className="text-purple-600 italic">{formattedDate}</p>
              <p className="count">Alugados: {agendamentosFiltrados.length}</p>
            </aside>
            <Calendar onChange={setSelectedDate} value={selectedDate} className="calendar" />
          </div>

          <div className="mt-2 agendamento bg-white p-1">
            <h2 className="text-lg font-semibold">
              {new Date().toDateString() === selectedDate.toDateString() ? 'Hoje' : `Agendamentos para ${selectedDate.toLocaleDateString("pt-BR")}`}
            </h2>

            {agendamentosFiltrados.length > 0 ? (
              <ul className="mt-2">
                {agendamentosFiltrados.map((ev) => (
                  <div key={ev.Id} className="flex items-center border-b py-2">
                    <div className="w-2 h-8 bg-yellow-500 mr-2"></div>
                    <span className="mr-2 flex-1">⌚{ev.Horario}</span>
                    <span className="flex-1">{ev.Cliente}</span>
                    <span className="flex-1">{ev.Quantidade}</span>
                    <span className="font-bold flex-1">Pedido: {ev.Pedido}</span>
                    <span className="flex-1">
                      {ev.Status} {ev.Status === "Pago" ? '✔' : ev.Status === "Entrada" ? '⚠' : '❓'}
                    </span>
                  </div>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center mt-2">Nenhum agendamento</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
