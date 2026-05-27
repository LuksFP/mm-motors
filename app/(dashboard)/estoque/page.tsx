"use client"

import { useState } from "react"
import { motos, type MotoStatus } from "@/lib/mock-data"
import { Search, Plus, Filter, Bike } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const statusConfig: Record<MotoStatus, { label: string; cls: string }> = {
  disponivel: { label: "Disponível", cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  reservada: { label: "Reservada", cls: "bg-amber-50 text-amber-700 border-amber-100" },
  vendida: { label: "Vendida", cls: "bg-gray-100 text-gray-500 border-gray-100" },
  em_conserto: { label: "Em conserto", cls: "bg-red-50 text-red-700 border-red-100" },
}

const statuses: (MotoStatus | "todos")[] = ["todos", "disponivel", "reservada", "em_conserto", "vendida"]

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

export default function EstoquePage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<MotoStatus | "todos">("todos")

  const filtered = motos.filter((m) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      m.marca.toLowerCase().includes(q) ||
      m.modelo.toLowerCase().includes(q) ||
      m.placa.toLowerCase().includes(q) ||
      m.cor.toLowerCase().includes(q)
    const matchStatus = statusFilter === "todos" || m.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Estoque de Motos</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {motos.filter(m => m.status === "disponivel").length} disponíveis ·{" "}
            {motos.filter(m => m.status === "reservada").length} reservadas ·{" "}
            {motos.filter(m => m.status === "em_conserto").length} em conserto
          </p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} />
          Cadastrar moto
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400"
            placeholder="Buscar por marca, modelo, cor ou placa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                statusFilter === s
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {s === "todos" ? "Todos" : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((moto) => {
          const st = statusConfig[moto.status]
          const margem = moto.precoVenda - moto.precoCusto
          const margemPct = Math.round((margem / moto.precoCusto) * 100)
          return (
            <div
              key={moto.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-sm transition-all group cursor-pointer"
            >
              {/* Foto placeholder */}
              <div className="h-40 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                <Bike size={48} className="text-orange-500/40" />
                <span
                  className={`absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${st.cls}`}
                >
                  {st.label}
                </span>
                <span className="absolute bottom-2 left-2.5 text-[10px] font-medium text-white/50 bg-black/30 px-2 py-0.5 rounded">
                  {moto.tipo === "nova" ? "0km" : `${moto.km.toLocaleString("pt-BR")} km`}
                </span>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-400 font-medium">{moto.marca}</p>
                <p className="font-bold text-gray-900 leading-tight">{moto.modelo}</p>
                <p className="text-xs text-gray-400 mt-0.5">{moto.ano} · {moto.cor} · {moto.placa}</p>

                <div className="mt-3 pt-3 border-t border-gray-50 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Preço de venda</p>
                    <p className="font-bold text-gray-900">{fmt(moto.precoVenda)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Margem bruta</p>
                    <p className="text-sm font-semibold text-emerald-500">
                      {margemPct}% · {fmt(margem)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Bike size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhuma moto encontrada</p>
        </div>
      )}
    </div>
  )
}
