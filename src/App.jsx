import { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa"; 
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './App.css'
import MenuPrincipal from "./components/menumain/MenuPrincipal";

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [termoBusca, setTermoBusca] = useState("");
  const [open, handleOpenMenu] = useState(false);

  const handleClosenMenu = () => {
    handleOpenMenu(!open);
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
        agendamento.titulo.toLowerCase().includes(termo.toLowerCase()) ||
        agendamento.comanda.toString().includes(termo) // Converte número para string e busca
    );
  };

  // Lista de agendamentos com horário
  const agendamentos = [
    { id: 1, data: "2024-12-12", horario: "13:00", status: "Pago", comanda: 32, titulo: "Marcela" },
    { id: 2, data: "2024-12-14", horario: "14:00", status: "Pago", comanda: 0, titulo: "Flávia" },
    { id: 3, data: "2024-12-16", horario: "11:00", status: "Pago", comanda: 29, titulo: "Policia Militar" },
    { id: 4, data: "2024-12-21", horario: "15:00", status: "Pago", comanda: 36, titulo: "Maria Luciana" },
    { id: 5, data: "2025-01-18", horario: "12:00", status: "Pago", comanda: 1, titulo: "Rodrigo" },
    { id: 6, data: "2025-02-22", horario: "10:30", status: "Pago", comanda: 50, titulo: "Rhuan" },
    { id: 7, data: "2025-02-22", horario: "13:30", status: "Entrada", comanda: 50, titulo: "Teste" },
    { id: 8, data: "2025-05-10", horario: "10:30", status: "Agendado", comanda: NaN, titulo: "Maria teste" },
  ];

   // Formatar a data para YYYY-MM-DD
   const formatarData = (date) => date.toISOString().split("T")[0];

   // Filtrar os agendamentos do dia selecionado e ordenar por horário
   const agendamentosFiltrados = agendamentos
     .filter((evento) => evento.data === formatarData(selectedDate))
     .sort((a, b) => a.horario.localeCompare(b.horario)); // Ordena pelo horário
  
   const resultados = buscarAgendamento(agendamentos, termoBusca);

  return (
    <div>
      {/* <h1 className=" flex text-xl items-center font-bold">CARRINHO - OGGI FEST </h1> */}
      <div className="flex-1 container-agender p-1">
        <header className="flex w-full p-1 items-center justify-between border-b ">
          
          <div className="relative ">
            <input value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)}type="text" placeholder="Buscar por nome" className="w-96 border p-2 rounded" />
            <FaSearch className="absolute right-3 top-3 text-gray-500 " />
          </div>
          <button onClick={handleClosenMenu} className="bg-myprimary text-white p-2 rounded-full ">
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
                    <span className="flex-1">{evento.titulo}</span>
                    <span className="font-bold flex-1">Pedido: {evento.comanda}</span>
                    <span className="flex-1">{evento.status} {evento.status === "Pago" ? '✔' : evento.status === "Entrada" ?  '⚠' :'❌'}</span>
                 </div>
                ))}
              </ul>
            
          ):(
            <p className="text-gray-500 text-center mt-2">Nenhum agendamento</p>
          )}
        </div>  
      </div> 
    </div>
  );
}