"use client"

import { useState } from "react"
import { leads, type Lead, type LeadEstagio } from "@/lib/mock-data"
import { Plus, Phone, MessageCircle, Clock, ChevronRight, AlertCircle } from "lucide-react"

const estagios: { key: LeadEstagio; label: string; cor: string }[] = [
  { key: "novo", label: "Novo Lead", cor: "border-t-slate-400" },
  { key: "contato_feito", label: "Contato Feito", cor: "border-t-blue-400" },
  { key: "interessado", label: "Interessado", cor: "border-t-indigo-400" },
  { key: "proposta", label: "Proposta", cor: "border-t-amber-400" },
  { key: "negociacao", label: "Negociação", cor: "border-t-orange-400" },
]

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

function daysSince(date: string) {
  const d = new Date(date)
  const now = new Date("2026-05-20")
  return Math.floor((now.getTime() - d.getTime()) / 86400000)
}

export default function CrmPage() {
  const [view, setView] = useState<"kanban" | "lista">("kanban")

  const ativos = leads.filter((l) => !["ganho", "perdido"].includes(l.estagio))
  const ganhos = leads.filter((l) => l.estagio === "ganho")
  const perdidos = leads.filter((l) => l.estagio === "perdido")

  return (
    <div className="p-6 max-w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Clientes & Funil de Vendas</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {ativos.length} clientes em negociação · {ganhos.length} vendas fechadas · {perdidos.length} perdidos este mês
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Toggle view */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                view === "kanban" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView("lista")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                view === "lista" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"
              }`}
            >
              Lista
            </button>
          </div>
          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus size={15} />
            Novo lead
          </button>
        </div>
      </div>

      {view === "kanban" ? (
        <KanbanView leads={ativos} />
      ) : (
        <ListView leads={leads} />
      )}
    </div>
  )
}

function KanbanView({ leads }: { leads: Lead[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {estagios.map(({ key, label, cor }) => {
        const col = leads.filter((l) => l.estagio === key)
        const total = col.reduce((s, l) => s + (l.valorEsperado ?? 0), 0)
        return (
          <div key={key} className="flex-shrink-0 w-68">
            <div className={`bg-white rounded-xl border border-gray-100 border-t-2 ${cor} overflow-hidden`}>
              {/* Column header */}
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-700">{label}</p>
                  {total > 0 && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
                    </p>
                  )}
                </div>
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center">
                  {col.length}
                </span>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 min-h-24">
                {col.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
                {col.length === 0 && (
                  <p className="text-center text-xs text-gray-300 py-6">Vazio</p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LeadCard({ lead }: { lead: Lead }) {
  const dias = daysSince(lead.ultimoContato)
  const atrasado = dias >= 3

  return (
    <div className="bg-gray-50 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 rounded-lg p-3 cursor-pointer transition-all group">
      <div className="flex items-start justify-between gap-1 mb-2">
        <p className="text-sm font-semibold text-gray-800 leading-tight">{lead.cliente.nome}</p>
        {atrasado && <AlertCircle size={13} className="text-orange-400 shrink-0 mt-0.5" />}
      </div>
      {lead.motoInteresse && (
        <p className="text-xs text-gray-500 mb-2">{lead.motoInteresse}</p>
      )}
      {lead.valorEsperado && (
        <p className="text-xs font-semibold text-gray-700">
          {lead.valorEsperado.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
        </p>
      )}
      {lead.notas && (
        <p className="text-[10px] text-gray-400 mt-1.5 line-clamp-2">{lead.notas}</p>
      )}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100">
        <span className={`text-[10px] font-medium flex items-center gap-1 ${atrasado ? "text-orange-500" : "text-gray-400"}`}>
          <Clock size={9} />
          {dias === 0 ? "Hoje" : `${dias}d atrás`}
        </span>
        <div className="flex gap-1.5">
          <button className="text-gray-300 hover:text-blue-400 transition-colors">
            <Phone size={12} />
          </button>
          <button className="text-gray-300 hover:text-emerald-500 transition-colors">
            <MessageCircle size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

function ListView({ leads }: { leads: Lead[] }) {
  const estagioLabel: Record<string, string> = {
    novo: "Novo",
    contato_feito: "Contato",
    interessado: "Interessado",
    proposta: "Proposta",
    negociacao: "Negociação",
    ganho: "Ganho",
    perdido: "Perdido",
  }
  const estagioColor: Record<string, string> = {
    novo: "bg-slate-100 text-slate-600",
    contato_feito: "bg-blue-50 text-blue-600",
    interessado: "bg-indigo-50 text-indigo-600",
    proposta: "bg-amber-50 text-amber-600",
    negociacao: "bg-orange-50 text-orange-600",
    ganho: "bg-emerald-50 text-emerald-600",
    perdido: "bg-red-50 text-red-600",
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs text-gray-400 font-medium">
            <th className="text-left px-5 py-3">Cliente</th>
            <th className="text-left px-4 py-3 hidden sm:table-cell">Moto</th>
            <th className="text-left px-4 py-3">Estágio</th>
            <th className="text-right px-4 py-3 hidden md:table-cell">Valor</th>
            <th className="text-right px-4 py-3 hidden lg:table-cell">Último contato</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {leads.map((lead) => {
            const dias = daysSince(lead.ultimoContato)
            const atrasado = dias >= 3 && !["ganho", "perdido"].includes(lead.estagio)
            return (
              <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer transition-colors group">
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-800">{lead.cliente.nome}</p>
                  <p className="text-xs text-gray-400">{lead.cliente.telefone}</p>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{lead.motoInteresse ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${estagioColor[lead.estagio]}`}>
                    {estagioLabel[lead.estagio]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right hidden md:table-cell">
                  {lead.valorEsperado
                    ? <span className="font-medium text-gray-700">{fmt(lead.valorEsperado)}</span>
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3 text-right hidden lg:table-cell">
                  <span className={`text-xs ${atrasado ? "text-orange-500 font-medium" : "text-gray-400"}`}>
                    {dias === 0 ? "Hoje" : `${dias}d atrás`}
                    {atrasado && " ⚠"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-400 inline" />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
