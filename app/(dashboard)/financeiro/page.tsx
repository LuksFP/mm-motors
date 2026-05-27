"use client"

import { useState } from "react"
import { vendas as initialVendas, despesas as initialDespesas, type Venda, type Despesa } from "@/lib/mock-data"
import { Plus, TrendingUp, TrendingDown, DollarSign, CheckCircle2, Clock, Pencil, Trash2, X, Check } from "lucide-react"

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

const CATEGORIAS_DESPESA = ["Aluguel", "Combustível", "Manutenção", "Impostos", "Marketing", "Salários", "Outros"]
const FORMAS_PAGAMENTO = ["Dinheiro", "Pix", "Cartão de Crédito", "Financiamento", "Transferência"]

type ModalVendaState = { open: false } | { open: true; editing: Venda | null }
type ModalDespesaState = { open: false } | { open: true; editing: Despesa | null }

const mesAtual = new Date().toISOString().slice(0, 7)
const mesLabel = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })

const fluxoHistorico = [
  { mes: "Dez", receita: 32000, despesa: 8200 },
  { mes: "Jan", receita: 18500, despesa: 7900 },
  { mes: "Fev", receita: 41000, despesa: 9100 },
  { mes: "Mar", receita: 27500, despesa: 8600 },
  { mes: "Abr", receita: 35200, despesa: 9400 },
]

export default function FinanceiroPage() {
  const [vendas, setVendas] = useState<Venda[]>(initialVendas)
  const [despesas, setDespesas] = useState<Despesa[]>(initialDespesas)
  const [tabDespesa, setTabDespesa] = useState<"todos" | "pendente" | "pago">("todos")
  const [modalVenda, setModalVenda] = useState<ModalVendaState>({ open: false })
  const [modalDespesa, setModalDespesa] = useState<ModalDespesaState>({ open: false })

  const vendasMes = vendas.filter((v) => v.dataVenda.startsWith(mesAtual))
  const faturamentoMes = vendasMes.reduce((s, v) => s + v.valor, 0)
  const margemMes = vendasMes.reduce((s, v) => s + v.margem, 0)
  const despesasMes = despesas.filter((d) => d.dataVencimento.startsWith(mesAtual)).reduce((s, d) => s + d.valor, 0)
  const despesasPagas = despesas.filter((d) => d.status === "pago").reduce((s, d) => s + d.valor, 0)
  const despesasPendentes = despesas.filter((d) => d.status === "pendente").reduce((s, d) => s + d.valor, 0)

  const fluxo = [...fluxoHistorico, { mes: "Mai", receita: faturamentoMes, despesa: despesasMes }]
  const maxFluxo = Math.max(...fluxo.map((f) => Math.max(f.receita, f.despesa)), 1)

  const despesasFiltradas = despesas.filter((d) =>
    tabDespesa === "todos" ? true : d.status === tabDespesa
  )

  function salvarVenda(venda: Omit<Venda, "id"> & { id?: string }) {
    if (venda.id) {
      setVendas((prev) => prev.map((v) => (v.id === venda.id ? (venda as Venda) : v)))
    } else {
      setVendas((prev) => [{ ...venda, id: uid() }, ...prev])
    }
    setModalVenda({ open: false })
  }

  function excluirVenda(id: string) {
    setVendas((prev) => prev.filter((v) => v.id !== id))
  }

  function salvarDespesa(despesa: Omit<Despesa, "id"> & { id?: string }) {
    if (despesa.id) {
      setDespesas((prev) => prev.map((d) => (d.id === despesa.id ? (despesa as Despesa) : d)))
    } else {
      setDespesas((prev) => [{ ...despesa, id: uid() }, ...prev])
    }
    setModalDespesa({ open: false })
  }

  function marcarPago(id: string) {
    const hoje = new Date().toISOString().slice(0, 10)
    setDespesas((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "pago", dataPagamento: hoje } : d))
    )
  }

  function excluirDespesa(id: string) {
    setDespesas((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-sm text-gray-400 mt-0.5 capitalize">{mesLabel} · receitas, despesas e margem</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModalDespesa({ open: true, editing: null })}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} />
            Nova despesa
          </button>
          <button
            onClick={() => setModalVenda({ open: true, editing: null })}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} />
            Nova venda
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <FinKpi label="Receita do mês" value={fmt(faturamentoMes)} sub="Soma das vendas fechadas" icon={<TrendingUp size={16} />} color="text-emerald-500 bg-emerald-50" />
        <FinKpi label="Margem bruta" value={fmt(margemMes)} sub={faturamentoMes > 0 ? `${Math.round((margemMes / faturamentoMes) * 100)}% sobre faturamento` : "—"} icon={<DollarSign size={16} />} color="text-orange-500 bg-orange-50" />
        <FinKpi label="Total de despesas" value={fmt(despesasMes)} sub={`${fmt(despesasPendentes)} a pagar`} icon={<TrendingDown size={16} />} color="text-red-500 bg-red-50" />
        <FinKpi label="Lucro líquido est." value={fmt(faturamentoMes - despesasMes)} sub="Faturamento menos despesas" icon={<TrendingUp size={16} />} color="text-blue-500 bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Fluxo de caixa */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-5">Fluxo de Caixa — últimos 6 meses</h2>
          <div className="flex items-end gap-3 h-40">
            {fluxo.map((f) => (
              <div key={f.mes} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 items-end" style={{ height: "120px" }}>
                  <div className="flex-1 bg-orange-400 rounded-t-sm" style={{ height: `${(f.receita / maxFluxo) * 100}%` }} title={`Receita: ${fmt(f.receita)}`} />
                  <div className="flex-1 bg-red-200 rounded-t-sm" style={{ height: `${(f.despesa / maxFluxo) * 100}%` }} title={`Despesa: ${fmt(f.despesa)}`} />
                </div>
                <span className="text-[10px] text-gray-400">{f.mes}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-2.5 h-2.5 rounded-sm bg-orange-400" />Receita</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-2.5 h-2.5 rounded-sm bg-red-200" />Despesas</div>
          </div>
        </div>

        {/* Vendas do mês */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 capitalize">Vendas — {mesLabel}</h2>
          {vendasMes.length === 0 ? (
            <p className="text-sm text-gray-300 text-center py-8">Nenhuma venda registrada no mês</p>
          ) : (
            <div className="space-y-3">
              {vendasMes.map((v) => (
                <div key={v.id} className="flex items-start justify-between gap-3 group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{v.clienteNome}</p>
                    <p className="text-xs text-gray-400">{v.motoModelo} · {v.formaPagamento}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">{fmt(v.valor)}</p>
                      <p className="text-xs text-emerald-500">margem {fmt(v.margem)}</p>
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setModalVenda({ open: true, editing: v })} className="p-1 text-gray-400 hover:text-orange-500 rounded transition-colors"><Pencil size={12} /></button>
                      <button onClick={() => excluirVenda(v.id)} className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-xs">
            <span className="text-gray-400">{vendasMes.length} vendas no mês</span>
            <span className="font-semibold text-gray-700">{fmt(faturamentoMes)} total</span>
          </div>
        </div>
      </div>

      {/* Despesas */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Despesas</h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            {(["todos", "pendente", "pago"] as const).map((t) => (
              <button key={t} onClick={() => setTabDespesa(t)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${tabDespesa === t ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"}`}>
                {t === "todos" ? "Todas" : t === "pendente" ? "Pendentes" : "Pagas"}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {despesasFiltradas.length === 0 && (
            <p className="text-sm text-gray-300 text-center py-8">Nenhuma despesa</p>
          )}
          {despesasFiltradas.map((d) => (
            <div key={d.id} className="py-3 flex items-center justify-between gap-4 group">
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-8 rounded-full shrink-0 ${d.status === "pago" ? "bg-emerald-400" : "bg-amber-400"}`} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{d.descricao}</p>
                  <p className="text-xs text-gray-400">
                    {d.categoria} · {d.status === "pago" ? `Pago em ${d.dataPagamento}` : `Vence ${d.dataVencimento}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-sm font-semibold ${d.status === "pago" ? "text-gray-500" : "text-gray-800"}`}>{fmt(d.valor)}</span>
                <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${d.status === "pago" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                  {d.status === "pago" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                  {d.status === "pago" ? "Pago" : "Pendente"}
                </span>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.status === "pendente" && (
                    <button onClick={() => marcarPago(d.id)} className="p-1 text-gray-400 hover:text-emerald-500 rounded transition-colors" title="Marcar como pago"><Check size={12} /></button>
                  )}
                  <button onClick={() => setModalDespesa({ open: true, editing: d })} className="p-1 text-gray-400 hover:text-orange-500 rounded transition-colors"><Pencil size={12} /></button>
                  <button onClick={() => excluirDespesa(d.id)} className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-xs text-gray-500">
          <span>Pendentes: <span className="font-semibold text-amber-600">{fmt(despesasPendentes)}</span></span>
          <span>Pagas: <span className="font-semibold text-emerald-600">{fmt(despesasPagas)}</span></span>
          <span>Total: <span className="font-semibold text-gray-700">{fmt(despesasPagas + despesasPendentes)}</span></span>
        </div>
      </div>

      {/* Modais */}
      {modalVenda.open && (
        <ModalVenda
          editing={modalVenda.editing}
          onSave={salvarVenda}
          onClose={() => setModalVenda({ open: false })}
        />
      )}
      {modalDespesa.open && (
        <ModalDespesa
          editing={modalDespesa.editing}
          onSave={salvarDespesa}
          onClose={() => setModalDespesa({ open: false })}
        />
      )}
    </div>
  )
}

// ── Modal Venda ────────────────────────────────────────────────────────────────

function ModalVenda({
  editing,
  onSave,
  onClose,
}: {
  editing: Venda | null
  onSave: (v: Omit<Venda, "id"> & { id?: string }) => void
  onClose: () => void
}) {
  const hoje = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    clienteNome: editing?.clienteNome ?? "",
    motoModelo: editing?.motoModelo ?? "",
    valor: editing?.valor?.toString() ?? "",
    margem: editing?.margem?.toString() ?? "",
    formaPagamento: editing?.formaPagamento ?? "Pix",
    dataVenda: editing?.dataVenda ?? hoje,
  })

  function set(k: keyof typeof form, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      ...(editing?.id ? { id: editing.id } : {}),
      clienteNome: form.clienteNome.trim(),
      motoModelo: form.motoModelo.trim(),
      valor: parseFloat(form.valor) || 0,
      margem: parseFloat(form.margem) || 0,
      formaPagamento: form.formaPagamento,
      dataVenda: form.dataVenda,
    })
  }

  return (
    <Overlay onClose={onClose}>
      <h2 className="text-base font-semibold text-gray-900 mb-5">{editing ? "Editar venda" : "Nova venda"}</h2>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Cliente">
          <input className={input} placeholder="Nome do cliente" value={form.clienteNome} onChange={(e) => set("clienteNome", e.target.value)} required />
        </Field>
        <Field label="Moto">
          <input className={input} placeholder="Ex: Honda CB 300R 2023" value={form.motoModelo} onChange={(e) => set("motoModelo", e.target.value)} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Valor da venda (R$)">
            <input className={input} type="number" min="0" step="0.01" placeholder="0,00" value={form.valor} onChange={(e) => set("valor", e.target.value)} required />
          </Field>
          <Field label="Margem (R$)">
            <input className={input} type="number" min="0" step="0.01" placeholder="0,00" value={form.margem} onChange={(e) => set("margem", e.target.value)} required />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Forma de pagamento">
            <select className={input} value={form.formaPagamento} onChange={(e) => set("formaPagamento", e.target.value)}>
              {FORMAS_PAGAMENTO.map((f) => <option key={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Data da venda">
            <input className={input} type="date" value={form.dataVenda} onChange={(e) => set("dataVenda", e.target.value)} required />
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
            {editing ? "Salvar" : "Registrar venda"}
          </button>
        </div>
      </form>
    </Overlay>
  )
}

// ── Modal Despesa ──────────────────────────────────────────────────────────────

function ModalDespesa({
  editing,
  onSave,
  onClose,
}: {
  editing: Despesa | null
  onSave: (d: Omit<Despesa, "id"> & { id?: string }) => void
  onClose: () => void
}) {
  const hoje = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    descricao: editing?.descricao ?? "",
    categoria: editing?.categoria ?? "Outros",
    valor: editing?.valor?.toString() ?? "",
    dataVencimento: editing?.dataVencimento ?? hoje,
    status: editing?.status ?? "pendente",
    dataPagamento: editing?.dataPagamento ?? "",
  })

  function set(k: keyof typeof form, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const isPago = form.status === "pago"
    onSave({
      ...(editing?.id ? { id: editing.id } : {}),
      descricao: form.descricao.trim(),
      categoria: form.categoria,
      valor: parseFloat(form.valor) || 0,
      dataVencimento: form.dataVencimento,
      status: form.status as "pendente" | "pago",
      ...(isPago ? { dataPagamento: form.dataPagamento || hoje } : {}),
    })
  }

  return (
    <Overlay onClose={onClose}>
      <h2 className="text-base font-semibold text-gray-900 mb-5">{editing ? "Editar despesa" : "Nova despesa"}</h2>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Descrição">
          <input className={input} placeholder="Ex: Aluguel da loja" value={form.descricao} onChange={(e) => set("descricao", e.target.value)} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Categoria">
            <select className={input} value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
              {CATEGORIAS_DESPESA.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Valor (R$)">
            <input className={input} type="number" min="0" step="0.01" placeholder="0,00" value={form.valor} onChange={(e) => set("valor", e.target.value)} required />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Vencimento">
            <input className={input} type="date" value={form.dataVencimento} onChange={(e) => set("dataVencimento", e.target.value)} required />
          </Field>
          <Field label="Status">
            <select className={input} value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
            </select>
          </Field>
        </div>
        {form.status === "pago" && (
          <Field label="Data de pagamento">
            <input className={input} type="date" value={form.dataPagamento} onChange={(e) => set("dataPagamento", e.target.value)} />
          </Field>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
            {editing ? "Salvar" : "Adicionar despesa"}
          </button>
        </div>
      </form>
    </Overlay>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X size={16} /></button>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  )
}

const input = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-colors"

function FinKpi({ label, value, sub, icon, color }: { label: string; value: string; sub?: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>{icon}</span>
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}
