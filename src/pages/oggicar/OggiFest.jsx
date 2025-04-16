import { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { LuRefreshCcw } from "react-icons/lu";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './OggiFest.css';
import CustomWindow from "../../components/menumain/CustomWindow";
import { useAuth } from '../../provider/AuthContextProvider';
import Notie from "../../service/notieService";

export default function OggiFest() {
  const { evento, formatarData } = useAuth();

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
    window.location.reload();
    Notie.success("Dados atualizados com sucesso!");
  };

  return (
    <div className="w-full flex h-full">
      <section className="bg-[#EAE8E1] w-[95.3dvw] flex flex-col items-center justify-center ">
        <h1 className="flex-1 text-center font-bold text-xl text-pink-600" style={{ backgroundColor: '#EAE8E1' }}>
          CARRINHO - OGGI FEST
        </h1>
        <div className="w-[100%] flex flex-col  p-1">
          <header className="flex w-[100%] p-1 items-center justify-between border-b">
            <div className="w-[50%] relative bg-blue-50">
              <input 
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                type="text"
                placeholder="Buscar por nome"
                className="w-full border  focus:border-amber-300 sm:font-medium p-1 rounded"
              />
              <FaSearch className="absolute right-3 top-3 text-pink-600 " />
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleOpenMenu(!open)} className="bg-pink-600 text-white p-2 rounded-full">
                <FaPlus />
              </button>
              <button onClick={limparAgendamentos} className="bg-red-500 text-white p-2 rounded-full">
                <LuRefreshCcw className=""/>
              </button>
            </div>
          </header>
          { open ?
             <aside className='flex items-center justify-center w-[94.7dvw]  h-full absolute top-0'
                style={{backgroundColor:"rgba(0,0,0,.5)"}}>
                <div className='flex w-[50%] h-[65%] z-1 items-center justify-center rounded shadow '>
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
            <div className="flex justify-center my-1">
              <Calendar 
                onChange={setSelectedDate} 
                value={selectedDate} 
                className="react-calendar max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl" 
              />
            </div>
          </div>

          <div className="mt-1 agendamento bg-white p-1">
            <p className="text-lg font-semibold">
              {new Date().toDateString() === selectedDate.toDateString() ? 'Hoje' : `Agendamentos para ${selectedDate.toLocaleDateString("pt-BR")}`}
            </p>

            {agendamentosFiltrados.length > 0 ? (
              <ul className="w-full flex flex-col items-center justify-center">
                {agendamentosFiltrados.map((ev) => (
                  <div key={ev.Id} 
                  className="w-full flex flex-row items-center justify-between border-0 p-1 m-1 rounded-lg shadow-sm"
                  style={{ backgroundColor: ev.Status === "Pago" ? "#7CFC50" : "#FEE2E2"}}>
                    <div className="w-2 h-8 rounded-bl rounded-tl bg-yellow-500 "></div>
                    <span className="">⌚{ev.Horario}</span>
                    <span className="">{ev.Cliente}</span>
                    <span className="font-bold">UN: {ev.Quantidade}</span>
                    <span className="font-bold">Pedido: {ev.Pedido}</span>
                    <span className="text-sm text-gray-500">
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
