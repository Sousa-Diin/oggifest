// OggiFest.jsx
import React, { useEffect, useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { LuRefreshCcw } from "react-icons/lu";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import Calendar from "react-calendar";
import { motion, AnimatePresence } from "framer-motion";
import "react-calendar/dist/Calendar.css";
import "./OggiFest.css";
import { FormattedDate } from "../../util/FormattedDate";

import CustomWindow from "../../components/menumain/CustomWindow";
import LoadSplash from "../splash/LoadSplash.jsx"
import { useAuth } from "../../provider/AuthContextProvider";
import Notie from "../../service/notieService";
import { FormattedHour } from "../../util/FormattedDate";

export default function OggiFest() {
  const { evento, formatarData } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [termoBusca, setTermoBusca] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const mountedRef = useRef(false);

  // --- Tema global
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("oggi-theme", theme);
  }, [theme]);

  // --- Controla splash até dados carregarem
  useEffect(() => setLoading(!evento), [evento]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // --- Config modal
  const message = {
    title: "Agendar Carrinho",
    btnConfirm: "Salvar",
    btnCancel: "Cancelar",
    ok: "Carrinho agendado!",
    error: "Erro ao agendar o carrinho.",
  };

  // --- Marcações no calendário
  const diasComAgendamento = (evento || [])
    .map((ev) => (ev?.saida ? formatarData(new Date(ev.saida)) : null))
    .filter(Boolean);

  // --- Filtro de busca e data
  const agendamentosFiltrados = (evento || [])
    .filter((ev) => {
    const termo = (termoBusca || "").toLowerCase();
    const dataSaida = ev?.saida ? new Date(ev.saida) : null;
    const dataSelecionada = selectedDate ? new Date(selectedDate) : null;
    const dataFormatada = dataSaida ? formatarData(dataSaida) : "";
    const dataSelecionadaFormatada = dataSelecionada
      ? formatarData(dataSelecionada)
      : "";

    const mesmaData = dataFormatada === dataSelecionadaFormatada;

    // Conversões seguras
    const cliente = String(ev?.cliente ?? "").toLowerCase();
    const pedido = String(ev?.pedido ?? "").toLowerCase();
    const id = String(ev?.id ?? "").toLowerCase();

    const matchBusca =
      cliente.includes(termo) ||
      pedido.includes(termo) ||
      id.includes(termo);

    return termo ? matchBusca : mesmaData;
  })
   .sort((a, b) => {
      const [haH, haM] = (a.horario || "00:00").split(":").map(Number);
      const [hbH, hbM] = (b.horario || "00:00").split(":").map(Number);
      return haH === hbH ? haM - hbM : haH - hbH;
    });

  // --- Limpa localStorage e aciona atualização
  const limparAgendamentos = () => {
    try {
      localStorage.removeItem("agendamentos");
      window.dispatchEvent(new CustomEvent("agendamentos:updated"));
      setLoading(true);
      setTimeout(() => {
        if (mountedRef.current) setLoading(false);
        Notie.success("Dados atualizados com sucesso!");
      }, 650);
    } catch (err) {
      console.error(err);
      Notie.error("Erro ao limpar agendamentos.");
    }
  };

  return (
    <main className="oggiFest">
      {/* Header fixo */}
      <header className="oggiFest-header">
        <h1 className="text-2xl pl-10">CARRINHO DE PICOLÉ - OGGI FEST</h1>

        <div className="header-actions">
          <div className="search-box">
            <input
              type="search"
              placeholder="Buscar cliente, pedido ou id"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
            {termoBusca && (
              <button onClick={() => setTermoBusca("")} aria-label="Limpar">
                <MdClose />
              </button>
            )}
          </div>

          <div className="btn-group">
            <button
              className="btn-circle"
              onClick={() =>
                setTheme((t) => (t === "light" ? "dark" : "light"))
              }
              title="Alternar tema"
            >
              {theme === "light" ? <HiOutlineMoon /> : <HiOutlineSun />}
            </button>

            <button
              onClick={() => setOpen(true)}
              className="btn-circle btn-primary"
              title="Novo agendamento"
            >
              <FaPlus />
            </button>

            <button
              onClick={limparAgendamentos}
              className="btn-circle btn-danger"
              title="Limpar agendamentos"
            >
              <LuRefreshCcw />
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <section className="oggiFest-body">
        <div className="oggiFest-grid">
          {/* Calendário */}
          <article className="oggiFest-calendar ">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="custom-calendar"
              tileContent={({ date, view }) =>
                view === "month" &&
                diasComAgendamento.includes(formatarData(date)) ? (
                  <span className="dot-indicator" aria-hidden></span>
                ) : null
              }
              minDetail="month"
              showNeighboringMonth={false}
            />
          </article>

          {/* Lista de agendamentos */}
          <aside className="oggiFest-list">
            <p className="list-title">
              {termoBusca
                ? `Resultados para: "${termoBusca}"`
                : `Agendamentos em ${selectedDate.toLocaleDateString("pt-BR")}`}
            </p>

            {loading ? (
              <div className="loading">
                <LoadSplash />
              </div>
            ) : agendamentosFiltrados.length ? (
              <ul>
                {agendamentosFiltrados.map((ev) => (
                  <motion.li
                    key={ev.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`item status-${ev.status?.toLowerCase() || "pendente"}`}
                  >
                    <div className="left">
                      <span className="time">{FormattedHour(ev.horario)}</span>
                      <div className="client">
                        <strong>{ev.cliente}</strong>
                        <small>Pedido: {ev.pedido || "—"}</small>
                      </div>
                    </div>
                    <div className="right p-2 flex gap-4">
                      <span>Entrega: {FormattedDate(ev.entrega)}</span>
                      <span>UN: {ev.quantidade}</span>
                      <span className="status">{ev.status}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="empty">Nenhum agendamento</p>
            )}
          </aside>
        </div>
      </section>

      {/* Modal animado */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="oggiFest-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="modal-content">
              <button
                className="modal-close"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
              >
                <MdClose />
              </button>
              <CustomWindow
                action="insert"
                message={message}
                openWindowEdit={open}
                setOpenWindowEdit={setOpen}
                appointment={evento}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
