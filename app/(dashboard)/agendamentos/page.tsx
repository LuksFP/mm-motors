"use client"

import { useState } from "react"
import { agendamentos, type Agendamento, type AgendamentoStatus } from "@/lib/mock-data"
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Bike,
  X,
  User,
} from "lucide-react"

// Semana atual: 19–25 mai 2026
const WEEK_START = new Date("2026-05-19")
const TODAY = "2026-05-20"

const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

const DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(WEEK_START)
  d.setDate(d.getDate() + i)
  return d.toISOString().split("T")[0]
})

const DAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
const DAY_NUMS = DAYS.map((d) => d.split("-")[2])

const statusConfig: Record<AgendamentoStatus, { label: string; icon: React.ReactNode; cls: string; dot: string }> = {
  agendado: {
    label: "Agendado",
    icon: <Clock size={11} />,
    cls: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-400",
  },
  realizado: {
    label: "Realizado",
    icon: <CheckCircle2 size={11} />,
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-400",
  },
  cancelado: {
    label: "Cancelado",
    icon: <XCircle size={11} />,
    cls: "bg-gray-100 text-gray-400 border-gray-200",
    dot: "bg-gray-300",
  },
  nao_compareceu: {
    label: "Não compareceu",
    icon: <AlertCircle size={11} />,
    cls: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-400",
  },
}

function fmt(dateStr: string) {
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

export default function AgendamentosPage() {
  const [view, setView] = useState<"semana" | "lista">("semana")
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Agendamento | null>(null)

  const proximos = agendamentos
    .filter((a) => a.status === "agendado" && a.data >= TODAY)
    .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora))

  const hoje = agendamentos.filter((a) => a.data === TODAY)
  const totalMes = agendamentos.length
  const realizados = agendamentos.filter((a) => a.status === "realizado").length

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agendamentos de Test Drive</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {proximos.length} confirmados · {hoje.length} hoje · {realizados} de {totalMes} realizados no mês
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {(["semana", "lista"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                  view === v ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"
                }`}
              >
                {v === "semana" ? "Semana" : "Lista"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} />
            Agendar test drive
          </button>
        </div>
      </div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Test drives hoje", value: hoje.length, color: "text-orange-500" },
          { label: "Restantes esta semana", value: proximos.filter(a => DAYS.includes(a.data)).length, color: "text-blue-500" },
          { label: "Realizados no mês", value: realizados, color: "text-emerald-500" },
          { label: "Não compareceram", value: agendamentos.filter(a => a.status === "nao_compareceu").length, color: "text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-400">{label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {view === "semana" ? (
        <WeekView onSelect={setSelected} />
      ) : (
        <ListView onSelect={setSelected} />
      )}

      {/* Detalhe lateral */}
      {selected && (
        <DetailSheet agendamento={selected} onClose={() => setSelected(null)} />
      )}

      {/* Modal novo agendamento */}
      {modalOpen && <NovoAgendamentoModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}

function WeekView({ onSelect }: { onSelect: (a: Agendamento) => void }) {
  const byDayHour = (day: string, hour: string) =>
    agendamentos.filter((a) => a.data === day && a.hora.startsWith(hour.split(":")[0]))

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Week header */}
      <div className="flex border-b border-gray-100">
        <div className="w-14 shrink-0 border-r border-gray-100" />
        {DAYS.map((day, i) => {
          const isToday = day === TODAY
          return (
            <div
              key={day}
              className={`flex-1 text-center py-3 border-r border-gray-50 last:border-r-0 ${isToday ? "bg-orange-50" : ""}`}
            >
              <p className={`text-[10px] font-medium uppercase ${isToday ? "text-orange-500" : "text-gray-400"}`}>
                {DAY_LABELS[i]}
              </p>
              <p className={`text-sm font-bold mt-0.5 ${isToday ? "text-orange-600" : "text-gray-700"}`}>
                {DAY_NUMS[i]}
              </p>
            </div>
          )
        })}
      </div>

      {/* Grid */}
      <div className="overflow-y-auto max-h-[520px]">
        {HOURS.map((hour) => (
          <div key={hour} className="flex border-b border-gray-50 last:border-b-0">
            <div className="w-14 shrink-0 border-r border-gray-100 flex items-start pt-2 justify-center">
              <span className="text-[10px] text-gray-300 font-medium">{hour}</span>
            </div>
            {DAYS.map((day) => {
              const items = byDayHour(day, hour)
              const isToday = day === TODAY
              return (
                <div
                  key={day}
                  className={`flex-1 border-r border-gray-50 last:border-r-0 min-h-14 p-1 ${isToday ? "bg-orange-50/40" : ""}`}
                >
                  {items.map((ag) => {
                    const st = statusConfig[ag.status]
                    return (
                      <button
                        key={ag.id}
                        onClick={() => onSelect(ag)}
                        className={`w-full text-left rounded-md border px-2 py-1.5 mb-1 text-[10px] leading-tight transition-all hover:shadow-sm ${st.cls}`}
                      >
                        <div className="flex items-center gap-1 font-semibold truncate">
                          {st.icon}
                          <span className="truncate">{ag.clienteNome}</span>
                        </div>
                        <p className="text-[9px] opacity-70 truncate mt-0.5">{ag.motoLabel}</p>
                        <p className="text-[9px] opacity-60 mt-0.5">{ag.hora}</p>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function ListView({ onSelect }: { onSelect: (a: Agendamento) => void }) {
  const sorted = [...agendamentos].sort((a, b) =>
    (a.data + a.hora).localeCompare(b.data + b.hora)
  )

  const grouped = sorted.reduce<Record<string, Agendamento[]>>((acc, a) => {
    acc[a.data] = acc[a.data] ?? []
    acc[a.data].push(a)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([date, items]) => {
        const isToday = date === TODAY
        return (
          <div key={date}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold ${isToday ? "text-orange-500" : "text-gray-500"}`}>
                {isToday ? "HOJE" : fmt(date)}
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="space-y-2">
              {items.map((ag) => {
                const st = statusConfig[ag.status]
                return (
                  <button
                    key={ag.id}
                    onClick={() => onSelect(ag)}
                    className="w-full bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all p-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-1 h-12 rounded-full shrink-0 ${st.dot}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-800">{ag.clienteNome}</p>
                            <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${st.cls}`}>
                              {st.icon} {st.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{ag.motoLabel}</p>
                          {ag.observacoes && (
                            <p className="text-xs text-gray-400 mt-1 italic">"{ag.observacoes}"</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-700">{ag.hora}</p>
                        <p className="text-xs text-gray-400">{fmt(ag.data)}</p>
                        <div className="flex gap-2 mt-2 justify-end">
                          <span className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">
                            <Phone size={13} />
                          </span>
                          <span className="text-gray-300 hover:text-emerald-500 transition-colors cursor-pointer">
                            <MessageCircle size={13} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DetailSheet({
  agendamento,
  onClose,
}: {
  agendamento: Agendamento
  onClose: () => void
}) {
  const st = statusConfig[agendamento.status]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Detalhes do Agendamento</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Status */}
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${st.cls}`}>
            {st.icon} {st.label}
          </span>

          {/* Data e hora */}
          <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-4">
            <Calendar size={20} className="text-orange-500 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Data e hora</p>
              <p className="font-bold text-gray-800">
                {new Date(agendamento.data + "T12:00:00").toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                })}{" "}
                às {agendamento.hora}
              </p>
            </div>
          </div>

          {/* Cliente */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Cliente</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                  <User size={15} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{agendamento.clienteNome}</p>
                  <p className="text-xs text-gray-400">{agendamento.clienteTelefone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-200 transition-all">
                  <Phone size={13} />
                </button>
                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:border-emerald-200 transition-all">
                  <MessageCircle size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Moto */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Moto</p>
            <div className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
                <Bike size={15} className="text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700">{agendamento.motoLabel}</p>
            </div>
          </div>

          {/* Observações */}
          {agendamento.observacoes && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Observações</p>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 italic">
                "{agendamento.observacoes}"
              </p>
            </div>
          )}
        </div>

        {/* Ações */}
        {agendamento.status === "agendado" && (
          <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-2">
            <button className="py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button className="py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors">
              Marcar realizado
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function NovoAgendamentoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Novo Test Drive</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400"
              placeholder="Nome do cliente"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Telefone</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400"
              placeholder="(13) 99999-9999"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Moto</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-white">
              <option value="">Selecione a moto...</option>
              <option>Honda CB 300R 2023</option>
              <option>Yamaha MT-07 2022</option>
              <option>Kawasaki Z400 2023</option>
              <option>Honda CG 160 Fan 2021</option>
              <option>Honda Biz 125 2023</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Data</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400"
                defaultValue="2026-05-21"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Horário</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-white">
                {HOURS.map((h) => <option key={h}>{h}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Observações</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 resize-none"
              rows={2}
              placeholder="Informações adicionais..."
            />
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
          >
            Confirmar agendamento
          </button>
        </div>
      </div>
    </div>
  )
}
