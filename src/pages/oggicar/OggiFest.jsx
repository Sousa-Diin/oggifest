import { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { LuRefreshCcw } from "react-icons/lu";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './OggiFest.css';
import CustomWindow from "../../components/menumain/CustomWindow";
import { useAuth } from '../../provider/AuthContextProvider';
import Notie from "../../service/notieService";
import { FormattedDate } from "../../util/FormattedDate"; // Importando a função de formatação de hora

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
  .filter((ev) => {
    const termoLower = (termoBusca || "").toLowerCase();

    // Garante que ev.Saida e selectedDate sejam datas válidas
    const dataSaida = ev?.saida ? new Date(ev.saida) : null;
    const dataSelecionada = selectedDate ? new Date(selectedDate) : null;

    const dataFormatada = dataSaida ? formatarData(dataSaida) : "";
    const dataSelecionadaFormatada = dataSelecionada ? formatarData(dataSelecionada) : "";

    const correspondeDataSelecionada = dataFormatada === dataSelecionadaFormatada;
    const correspondeCliente = (ev?.cliente || "").toLowerCase().includes(termoLower);
    const correspondeDataBusca = dataFormatada.includes(termoLower);

    if (termoLower.trim() === "") {
      return correspondeDataSelecionada;
    } else {
      return correspondeCliente || correspondeDataBusca;
    }
  })
  .sort((a, b) => {
    const horaA = a?.horario?.toString() || "";
    const horaB = b?.horario?.toString() || "";
    return horaA.localeCompare(horaB);
  });


  
  // 🗑 Função para limpar agendamentos
  const limparAgendamentos = () => {
    localStorage.removeItem('agendamentos');
    window.location.reload();
    Notie.success("Dados atualizados com sucesso!");
  };

  return (
    <div className="bg-[#EAE8E1] flex h-dvh p-2">
      <section className=" w-[94dvw] flex flex-col items-center  ">
        <h1 className=" text-center font-bold text-xl text-pink-600" style={{ backgroundColor: '#EAE8E1' }}>
          CARRINHO - OGGI FEST
        </h1>
        <div className="w-[100%] flex flex-col  p-1">
          <header className="flex w-[100%] p-1 items-center justify-between border-b">
            <div className="w-[50%] relative bg-blue-50">
            <input 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              type="text"
              placeholder="Buscar por, Cliente ou dia"
              className="w-full border focus:border-amber-300 sm:font-medium p-1 rounded"
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
             <aside className='inset-0  bg-opacity-50 z-50 flex items-center justify-center w-[94dvw]  min-h-full absolute top-0'
                style={{backgroundColor:"rgba(0,0,0,.5)", width:"100%"}}>
                <div className='flex w-[50%] min-h-[100dvh]  items-center justify-center rounded shadow '>
                  <CustomWindow 
                    openWindowEdit={open} 
                    setOpenWindowEdit={handleOpenMenu}
                    appointment={evento} // Envia os dados para edição
                    message={message}
                  /> 
                </div>
            </aside> : ''
          }
          
          <div className="w-full flex flex-col bg-white mt-1 p-1 shadow">
            <aside className="flex w-3/4 justify-between">
              <p className="text-purple-600 italic">{formattedDate}</p>
              <p className="count">Alugados: {agendamentosFiltrados.length}</p>
            </aside>
            <div className="flex h-[90%] min-h-[15dvw] justify-center my-1">
              <Calendar 
                onChange={setSelectedDate} 
                value={selectedDate} 
                className="react-calendar max-w-full " 
              />
            </div>
          </div>

          <div className="mt-1 agendamento bg-white p-1">
            <p className="text-lg font-semibold">
              {termoBusca
                ? `Resultados para: "${termoBusca}"`
                : new Date().toDateString() === selectedDate.toDateString()
                  ? 'Hoje'
                  : `Agendamentos para ${selectedDate.toLocaleDateString("pt-BR")}`}
            </p>


            {agendamentosFiltrados.length > 0 ? (
              <ul className="w-full flex flex-col items-center justify-center">
                {agendamentosFiltrados.map((ev) => (
                  <div key={ev.id} 
                  className="w-full flex flex-row items-center justify-between border-0 p-1 m-1 rounded-lg shadow-sm"
                  style={{ backgroundColor: ev.status === "Pago" ? "#7CFC50" : "#FEE2E2"}}>
                    <div className="w-2 h-8 rounded-bl rounded-tl bg-yellow-500 "></div>
                    <span className="">⌚{FormattedDate(ev.horario)}</span>
                    <span className="">{ev.cliente}</span>
                    <span className="font-bold">UN: {ev.quantidade}</span>
                    <span className="font-bold">Pedido: {ev.pedido}</span>
                    <span className="text-sm text-gray-500">
                      {ev.status} {ev.status === "Pago" ? '✔' : ev.status === "Entrada" ? '⚠' : '❓'}
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
