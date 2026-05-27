import {
  TrendingUp,
  Bike,
  Users,
  AlertTriangle,
  DollarSign,
  Clock,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react"
import { dashboardData, motos, leads, despesas, vendas, agendamentos } from "@/lib/mock-data"

const TODAY = "2026-05-20"

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

const pct = Math.round((dashboardData.faturamentoMes / dashboardData.metaMes) * 100)

const estagioLabel: Record<string, string> = {
  novo: "Novo",
  contato_feito: "Contato",
  interessado: "Interessado",
  proposta: "Proposta",
  negociacao: "Negociação",
}

const leadsAtivos = leads.filter((l) => !["ganho", "perdido"].includes(l.estagio))
const contasPendentes = despesas.filter(
  (d) => d.status === "pendente" && d.dataVencimento <= "2026-05-27"
)
const testDrivesHoje = agendamentos
  .filter((a) => a.data === TODAY && a.status === "agendado")
  .sort((a, b) => a.hora.localeCompare(b.hora))

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-sm text-gray-400 mt-0.5">Maio de 2026 — resumo do negócio em tempo real</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Faturamento do mês"
          value={fmt(dashboardData.faturamentoMes)}
          sub={`${pct}% da meta de ${fmt(dashboardData.metaMes)}`}
          progress={pct}
          icon={<TrendingUp size={16} />}
          accent="orange"
        />
        <KpiCard
          label="Estoque em loja"
          value={fmt(dashboardData.totalEstoque)}
          sub={`${dashboardData.qtdDisponiveis} motos prontas para venda`}
          icon={<Bike size={16} />}
          accent="blue"
        />
        <KpiCard
          label="Clientes no funil"
          value={String(dashboardData.leadsAtivos)}
          sub={dashboardData.followUpsAtrasados > 0
            ? `⚠ ${dashboardData.followUpsAtrasados} sem contato há 3+ dias`
            : "Todos os contatos em dia"}
          icon={<Users size={16} />}
          accent={dashboardData.followUpsAtrasados > 0 ? "red" : "green"}
        />
        <KpiCard
          label="Saldo disponível"
          value={fmt(dashboardData.saldoCaixa)}
          sub={`${fmt(dashboardData.contasPagar7dias)} vencem nos próximos 7 dias`}
          icon={<DollarSign size={16} />}
          accent="green"
        />
      </div>

      {/* Alertas */}
      {(dashboardData.followUpsAtrasados > 0 || dashboardData.qtdReservadas > 0 || dashboardData.qtdEmConserto > 0) && (
        <div className="flex flex-wrap gap-3">
          {dashboardData.followUpsAtrasados > 0 && (
            <Alert
              icon={<Clock size={14} />}
              text={`${dashboardData.followUpsAtrasados} cliente(s) aguardam retorno há mais de 3 dias — risco de perder a venda`}
              color="orange"
            />
          )}
          {dashboardData.qtdReservadas > 0 && (
            <Alert
              icon={<AlertTriangle size={14} />}
              text={`${dashboardData.qtdReservadas} moto(s) reservada(s) — confirme com o cliente antes de liberar`}
              color="yellow"
            />
          )}
          {dashboardData.qtdEmConserto > 0 && (
            <Alert
              icon={<AlertTriangle size={14} />}
              text={`${dashboardData.qtdEmConserto} moto(s) em conserto — indisponível para venda até ser liberada`}
              color="red"
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Estoque por status */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Situação do Estoque</h2>
          <p className="text-xs text-gray-400 mb-4">Distribuição das motos por status atual</p>
          <div className="space-y-3">
            <StatusRow label="Disponíveis para venda" count={dashboardData.qtdDisponiveis} color="bg-emerald-400" total={motos.length} />
            <StatusRow label="Reservadas (aguard. confirmação)" count={dashboardData.qtdReservadas} color="bg-amber-400" total={motos.length} />
            <StatusRow label="Em conserto (indisponível)" count={dashboardData.qtdEmConserto} color="bg-red-400" total={motos.length} />
            <StatusRow label="Vendidas este mês" count={motos.filter(m => m.status === "vendida").length} color="bg-gray-300" total={motos.length} />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-xs text-gray-400">{motos.length} motos cadastradas · <a href="/estoque" className="text-orange-500 hover:underline">ver estoque completo →</a></p>
          </div>
        </div>

        {/* Leads no funil */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Funil de Vendas</h2>
          <p className="text-xs text-gray-400 mb-4">Clientes em cada etapa do processo de compra</p>
          <div className="space-y-2">
            {Object.entries(estagioLabel).map(([key, label]) => {
              const count = leadsAtivos.filter((l) => l.estagio === key).length
              return (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400 rounded-full"
                        style={{ width: `${(count / leadsAtivos.length) * 100 || 0}%` }}
                      />
                    </div>
                    <span className="text-gray-700 font-medium w-4 text-right">{count}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-xs text-gray-400"><a href="/crm" className="text-orange-500 hover:underline">gerenciar clientes no CRM →</a></p>
          </div>
        </div>

        {/* Últimas vendas */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Últimas Vendas Fechadas</h2>
          <p className="text-xs text-gray-400 mb-4">Valor e margem de lucro de cada venda</p>
          <div className="space-y-3">
            {vendas.slice(0, 4).map((v) => (
              <div key={v.id} className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-800 leading-tight">{v.clienteNome}</p>
                  <p className="text-xs text-gray-400">{v.motoModelo} · {v.formaPagamento}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-800">{fmt(v.valor)}</p>
                  <p className="text-xs text-emerald-500">lucro {fmt(v.margem)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-xs text-gray-400"><a href="/financeiro" className="text-orange-500 hover:underline">ver relatório financeiro completo →</a></p>
          </div>
        </div>
      </div>

      {/* Test Drives hoje */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <CalendarCheck size={15} className="text-orange-400" />
            Test Drives Agendados para Hoje
          </h2>
          <a href="/agendamentos" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
            Ver agenda completa →
          </a>
        </div>
        <p className="text-xs text-gray-400 mb-4">Clientes que virão testar motos hoje — prepare o veículo com antecedência</p>
        {testDrivesHoje.length === 0 ? (
          <p className="text-sm text-gray-400 py-2 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            Nenhum test drive marcado para hoje.
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {testDrivesHoje.map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{a.clienteNome}</p>
                  <p className="text-xs text-gray-400">{a.motoLabel}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-orange-500">{a.hora}</span>
                  <p className="text-[10px] text-gray-400">confirme presença</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contas a pagar */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Contas a Pagar — próximos 7 dias
        </h2>
        <div className="divide-y divide-gray-50">
          {contasPendentes.map((d) => (
            <div key={d.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{d.descricao}</p>
                <p className="text-xs text-gray-400">{d.categoria} · vence {d.dataVencimento}</p>
              </div>
              <span className="text-sm font-semibold text-red-500">{fmt(d.valor)}</span>
            </div>
          ))}
          {contasPendentes.length === 0 && (
            <div className="py-4 flex items-center gap-2 text-sm text-emerald-500">
              <CheckCircle2 size={15} />
              Nenhuma conta vencendo nos próximos 7 dias
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function KpiCard({
  label,
  value,
  sub,
  progress,
  icon,
  accent,
}: {
  label: string
  value: string
  sub: string
  progress?: number
  icon: React.ReactNode
  accent: "orange" | "blue" | "green" | "red"
}) {
  const colors = {
    orange: "text-orange-500 bg-orange-50",
    blue: "text-blue-500 bg-blue-50",
    green: "text-emerald-500 bg-emerald-50",
    red: "text-red-500 bg-red-50",
  }
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${colors[accent]}`}>
          {icon}
        </span>
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full h-1 bg-gray-100 rounded-full">
            <div
              className="h-full bg-orange-400 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">{progress}% da meta</p>
        </div>
      )}
    </div>
  )
}

function StatusRow({
  label,
  count,
  color,
  total,
}: {
  label: string
  count: number
  color: string
  total: number
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color} shrink-0`} />
      <span className="text-sm text-gray-600 flex-1">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{count}</span>
    </div>
  )
}

function Alert({
  icon,
  text,
  color,
}: {
  icon: React.ReactNode
  text: string
  color: "orange" | "yellow" | "red"
}) {
  const cls = {
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    yellow: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
  }
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${cls[color]}`}>
      {icon}
      {text}
    </div>
  )
}
