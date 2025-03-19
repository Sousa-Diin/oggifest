import { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa"; 
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './OggiFest.css'
import MenuPrincipal from "../../components/menumain/MenuPrincipal";
import { useAuth } from '../../provider/AuthContextProvider'
import {agendamentos} from '../../service/ListAgendar'
import { SideBar } from "../../components/siderBar/SideBar";

export default function OggiFest() {

  const { getStoredEvents } = useAuth();
  const listLocalStorageAgender = [];/* getStoredEvents(); */
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [termoBusca, setTermoBusca] = useState("");
  const [open, handleOpenMenu] = useState(false);
  const [openSide, handleOpenSide] = useState(false);
  const [writeTitle, setWriteTitle] = useState(false);
  
  

  const handleClosenMenu = () => {
    handleOpenMenu(!open);
  }

  const handleCloseSideBar = () => {
    handleOpenSide(!openSide);
    setWriteTitle(!writeTitle);
  }
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long", // Nome do dia da semana (ex: "terça-feira")
    day: "2-digit",  // Dia com dois dígitos (ex: "19")
    month: "long",   // Nome do mês (ex: "fevereiro")
    year: "numeric"  // Ano completo (ex: "2025")
  }).format(selectedDate);

  // Função para buscar agendamentos pelo nome ou número do pedido
  const buscarAgendamento = (lista, termo) => {
    if (!termo) return lista; // Se não houver termo, retorna a lista completa

    return lista.filter(
      (agendamento) =>
        agendamento.nome.toLowerCase().includes(termo.toLowerCase()) ||
        agendamento.pedido.toString().includes(termo) // Converte número para string e busca
    );
  };

  // Lista de agendamentos com horário

   // Formatar a data para YYYY-MM-DD
   const formatarData = (date) => date.toISOString().split("T")[0];

   // Filtrar os agendamentos do dia selecionado e ordenar por horário
   const agendamentosFiltrados = listLocalStorageAgender
     .filter((evento) => evento.data === formatarData(selectedDate))
     .sort((a, b) => a.horario.localeCompare(b.horario)); // Ordena pelo horário
  
   const resultados = buscarAgendamento(agendamentos, termoBusca);

  return (
    <div className="flex ">
      <SideBar 
        openSide={openSide}
        writeTitle={writeTitle}
        handleCloseSideBar={handleCloseSideBar}
        
      />
      <section className=" flex-1  section-agender">
        <h1 className=" flex-1 text-center font-bold p-2 text-xl text-pink-600" style={{backgroundColor:'#EAE8E1'}}>CARRINHO - OGGI FEST </h1>
        <div className="flex-1 container-agender p-1">
          <header className="flex w-full p-1 items-center justify-between border-b ">
            
            <div className="relative bg-blue-50">
              <input value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)}type="text" placeholder="Buscar por nome" className="w-96 border p-2 rounded" />
              <FaSearch className="absolute right-3 top-3 text-pink-600 " />
            </div>
            <button onClick={handleClosenMenu} className="bg-pink-600 text-white p-2 rounded-full ">
              <FaPlus />
            </button>
          </header>
          <MenuPrincipal open={open} handleClosenMenu={handleClosenMenu}/>
        
          <div className="flex-col  bg-white mt-1  p-1  shadow">
            <aside className="flex w-3/4 justify-between">
              <p className="text-purple-600 italic">{formattedDate} </p> 
              <p className="count"> Alugados: { agendamentosFiltrados.length}</p></aside>
            <Calendar onChange={setSelectedDate} value={selectedDate} className="calendar " />
          </div>

          {/* Agendamentos */}
          <div className="mt- agendamento bg-white p-1  shadow">
            <h2 className="text-lg font-semibold ">
              {new Date().toDateString() === selectedDate.toDateString() ? 'Hoje' : `Agendamentos para ${selectedDate.toLocaleDateString("pt-BR")}`}
            </h2>

            {agendamentosFiltrados.length > 0 ? (
                <ul className="mt-2">
                  {agendamentosFiltrados.map((evento) => (
                    <div key={evento.id} className="flex items-center border-b py-2">
                      <div className="w-2 h-8 bg-yellow-500 mr-2"></div>
                      <span className="mr-2 flex-1">⌚{evento.horario}</span>
                      <span className="flex-1">{evento.nome}</span>
                      <span className="font-bold flex-1">Pedido: {evento.pedido}</span>
                      <span className="flex-1">{evento.status} {evento.status === "Pago" ? '✔' : evento.status === "Entrada" ?  '⚠' :'❌'}</span>
                  </div>
                  ))}
                </ul>
              
            ):(
              <p className="text-gray-500 text-center mt-2">Nenhum agendamento</p>
            )}
          </div>  
        </div> 
      </section>
    </div>
  );
}