export type MotoStatus = "disponivel" | "reservada" | "vendida" | "em_conserto"
export type MotoTipo = "nova" | "usada"

export interface Moto {
  id: string
  placa: string
  chassi: string
  marca: string
  modelo: string
  ano: number
  cor: string
  km: number
  tipo: MotoTipo
  status: MotoStatus
  precoCusto: number
  precoVenda: number
  observacoes?: string
  foto?: string
  createdAt: string
}

export type LeadEstagio =
  | "novo"
  | "contato_feito"
  | "interessado"
  | "proposta"
  | "negociacao"
  | "ganho"
  | "perdido"

export interface Cliente {
  id: string
  nome: string
  cpf?: string
  telefone: string
  email?: string
  source?: string
}

export interface Lead {
  id: string
  cliente: Cliente
  motoInteresse?: string
  estagio: LeadEstagio
  valorEsperado?: number
  notas?: string
  ultimoContato: string
  proximoContato?: string
  createdAt: string
}

export interface Venda {
  id: string
  clienteNome: string
  motoModelo: string
  valor: number
  formaPagamento: string
  dataVenda: string
  margem: number
}

export interface Despesa {
  id: string
  descricao: string
  categoria: string
  valor: number
  dataVencimento: string
  dataPagamento?: string
  status: "pendente" | "pago"
}

// ── MOTOS ──────────────────────────────────────────────────────────
export const motos: Moto[] = [
  {
    id: "1",
    placa: "ABC-1234",
    chassi: "9BWZZZ377VT004251",
    marca: "Honda",
    modelo: "CB 300R",
    ano: 2023,
    cor: "Preto",
    km: 0,
    tipo: "nova",
    status: "disponivel",
    precoCusto: 18500,
    precoVenda: 22900,
    foto: "https://placehold.co/400x280/1e293b/f97316?text=CB+300R",
    createdAt: "2026-04-10",
  },
  {
    id: "2",
    placa: "DEF-5678",
    chassi: "9C2JC3110RR000123",
    marca: "Yamaha",
    modelo: "MT-07",
    ano: 2022,
    cor: "Azul",
    km: 12400,
    tipo: "usada",
    status: "disponivel",
    precoCusto: 32000,
    precoVenda: 38500,
    foto: "https://placehold.co/400x280/1e293b/f97316?text=MT-07",
    createdAt: "2026-04-15",
  },
  {
    id: "3",
    placa: "GHI-9012",
    chassi: "9BWZZZ377VT009988",
    marca: "Kawasaki",
    modelo: "Z400",
    ano: 2023,
    cor: "Verde",
    km: 0,
    tipo: "nova",
    status: "reservada",
    precoCusto: 26000,
    precoVenda: 31200,
    foto: "https://placehold.co/400x280/1e293b/f97316?text=Z400",
    createdAt: "2026-04-20",
  },
  {
    id: "4",
    placa: "JKL-3456",
    chassi: "9C2JC3110RR004567",
    marca: "Honda",
    modelo: "CG 160 Fan",
    ano: 2021,
    cor: "Vermelho",
    km: 28700,
    tipo: "usada",
    status: "disponivel",
    precoCusto: 7800,
    precoVenda: 10500,
    foto: "https://placehold.co/400x280/1e293b/f97316?text=CG+160",
    createdAt: "2026-04-25",
  },
  {
    id: "5",
    placa: "MNO-7890",
    chassi: "9BWZZZ377VT001122",
    marca: "Yamaha",
    modelo: "Fazer 250",
    ano: 2020,
    cor: "Branco",
    km: 41200,
    tipo: "usada",
    status: "vendida",
    precoCusto: 10200,
    precoVenda: 14000,
    foto: "https://placehold.co/400x280/1e293b/f97316?text=Fazer+250",
    createdAt: "2026-03-01",
  },
  {
    id: "6",
    placa: "PQR-2345",
    chassi: "9C2JC3110RR008901",
    marca: "Suzuki",
    modelo: "GSX-S750",
    ano: 2022,
    cor: "Cinza",
    km: 8900,
    tipo: "usada",
    status: "em_conserto",
    precoCusto: 28500,
    precoVenda: 34000,
    foto: "https://placehold.co/400x280/1e293b/f97316?text=GSX-S750",
    createdAt: "2026-05-01",
  },
  {
    id: "7",
    placa: "STU-6789",
    chassi: "9BWZZZ377VT005566",
    marca: "Honda",
    modelo: "Biz 125",
    ano: 2023,
    cor: "Prata",
    km: 0,
    tipo: "nova",
    status: "disponivel",
    precoCusto: 8900,
    precoVenda: 11200,
    foto: "https://placehold.co/400x280/1e293b/f97316?text=Biz+125",
    createdAt: "2026-05-10",
  },
]

// ── LEADS ──────────────────────────────────────────────────────────
export const leads: Lead[] = [
  {
    id: "1",
    cliente: { id: "c1", nome: "Rafael Souza", telefone: "(13) 99812-3456", source: "Instagram" },
    motoInteresse: "Honda CB 300R",
    estagio: "novo",
    valorEsperado: 22900,
    ultimoContato: "2026-05-20",
    createdAt: "2026-05-20",
  },
  {
    id: "2",
    cliente: { id: "c2", nome: "Amanda Costa", telefone: "(13) 99723-4567", source: "Indicação" },
    motoInteresse: "Yamaha MT-07",
    estagio: "contato_feito",
    valorEsperado: 38500,
    ultimoContato: "2026-05-18",
    proximoContato: "2026-05-22",
    createdAt: "2026-05-15",
  },
  {
    id: "3",
    cliente: { id: "c3", nome: "Lucas Ferreira", telefone: "(13) 99634-5678", source: "Walk-in" },
    motoInteresse: "Kawasaki Z400",
    estagio: "interessado",
    valorEsperado: 31200,
    ultimoContato: "2026-05-17",
    proximoContato: "2026-05-21",
    notas: "Quer financiar 60x. Aguardando retorno do banco.",
    createdAt: "2026-05-12",
  },
  {
    id: "4",
    cliente: { id: "c4", nome: "Mariana Lima", telefone: "(13) 99545-6789", source: "WhatsApp" },
    motoInteresse: "Honda CG 160",
    estagio: "proposta",
    valorEsperado: 10500,
    ultimoContato: "2026-05-19",
    proximoContato: "2026-05-21",
    createdAt: "2026-05-10",
  },
  {
    id: "5",
    cliente: { id: "c5", nome: "Paulo Mendes", telefone: "(13) 99456-7890", source: "Instagram" },
    motoInteresse: "Honda CB 300R",
    estagio: "negociacao",
    valorEsperado: 21500,
    ultimoContato: "2026-05-20",
    notas: "Quer desconto de R$1.400. Verificar margem.",
    createdAt: "2026-05-05",
  },
  {
    id: "6",
    cliente: { id: "c6", nome: "Fernanda Rocha", telefone: "(13) 99367-8901", source: "Indicação" },
    motoInteresse: "Yamaha Fazer 250",
    estagio: "ganho",
    valorEsperado: 14000,
    ultimoContato: "2026-05-15",
    createdAt: "2026-04-28",
  },
  {
    id: "7",
    cliente: { id: "c7", nome: "Bruno Alves", telefone: "(13) 99278-9012", source: "Google" },
    motoInteresse: "Suzuki GSX-S750",
    estagio: "perdido",
    valorEsperado: 34000,
    ultimoContato: "2026-05-10",
    notas: "Comprou na concorrência. Preço.",
    createdAt: "2026-04-20",
  },
  {
    id: "8",
    cliente: { id: "c8", nome: "Carla Santos", telefone: "(13) 99189-0123", source: "Walk-in" },
    motoInteresse: "Honda Biz 125",
    estagio: "interessado",
    valorEsperado: 11200,
    ultimoContato: "2026-05-14",
    createdAt: "2026-05-13",
  },
]

// ── VENDAS ─────────────────────────────────────────────────────────
export const vendas: Venda[] = [
  { id: "v1", clienteNome: "Fernanda Rocha", motoModelo: "Yamaha Fazer 250", valor: 14000, formaPagamento: "Financiamento", dataVenda: "2026-05-15", margem: 3800 },
  { id: "v2", clienteNome: "Rodrigo Nunes", motoModelo: "Honda CG 160 Fan", valor: 10200, formaPagamento: "Pix", dataVenda: "2026-05-08", margem: 2200 },
  { id: "v3", clienteNome: "Tatiane Vieira", motoModelo: "Honda CB 300R", valor: 22900, formaPagamento: "Dinheiro", dataVenda: "2026-04-28", margem: 4400 },
  { id: "v4", clienteNome: "Diego Castro", motoModelo: "Kawasaki Z400", valor: 30500, formaPagamento: "Financiamento", dataVenda: "2026-04-15", margem: 4500 },
  { id: "v5", clienteNome: "Patricia Gomes", motoModelo: "Yamaha MT-07", valor: 37000, formaPagamento: "Pix", dataVenda: "2026-03-22", margem: 5000 },
]

// ── DESPESAS ───────────────────────────────────────────────────────
export const despesas: Despesa[] = [
  { id: "d1", descricao: "Aluguel da loja", categoria: "Aluguel", valor: 3500, dataVencimento: "2026-05-25", status: "pendente" },
  { id: "d2", descricao: "Combustível frota", categoria: "Combustível", valor: 380, dataVencimento: "2026-05-20", dataPagamento: "2026-05-20", status: "pago" },
  { id: "d3", descricao: "Revisão Honda CG (estoque)", categoria: "Manutenção", valor: 650, dataVencimento: "2026-05-22", status: "pendente" },
  { id: "d4", descricao: "Imposto DAS (Simples)", categoria: "Impostos", valor: 1240, dataVencimento: "2026-05-20", dataPagamento: "2026-05-18", status: "pago" },
  { id: "d5", descricao: "Impulsionamento Instagram", categoria: "Marketing", valor: 500, dataVencimento: "2026-05-15", dataPagamento: "2026-05-15", status: "pago" },
  { id: "d6", descricao: "Aluguel da loja", categoria: "Aluguel", valor: 3500, dataVencimento: "2026-06-25", status: "pendente" },
  { id: "d7", descricao: "Seguro loja", categoria: "Outros", valor: 290, dataVencimento: "2026-05-28", status: "pendente" },
]

// ── AGENDAMENTOS ───────────────────────────────────────────────────
export type AgendamentoStatus = "agendado" | "realizado" | "cancelado" | "nao_compareceu"

export interface Agendamento {
  id: string
  clienteNome: string
  clienteTelefone: string
  motoId: string
  motoLabel: string
  data: string       // YYYY-MM-DD
  hora: string       // HH:MM
  status: AgendamentoStatus
  observacoes?: string
  leadId?: string
}

export const agendamentos: Agendamento[] = [
  {
    id: "a1",
    clienteNome: "Rafael Souza",
    clienteTelefone: "(13) 99812-3456",
    motoId: "1",
    motoLabel: "Honda CB 300R 2023",
    data: "2026-05-20",
    hora: "09:00",
    status: "realizado",
    leadId: "1",
  },
  {
    id: "a2",
    clienteNome: "Amanda Costa",
    clienteTelefone: "(13) 99723-4567",
    motoId: "2",
    motoLabel: "Yamaha MT-07 2022",
    data: "2026-05-20",
    hora: "14:30",
    status: "agendado",
    leadId: "2",
  },
  {
    id: "a3",
    clienteNome: "Lucas Ferreira",
    clienteTelefone: "(13) 99634-5678",
    motoId: "3",
    motoLabel: "Kawasaki Z400 2023",
    data: "2026-05-21",
    hora: "10:00",
    status: "agendado",
    observacoes: "Já veio uma vez, quer testar de novo antes de fechar.",
    leadId: "3",
  },
  {
    id: "a4",
    clienteNome: "Mariana Lima",
    clienteTelefone: "(13) 99545-6789",
    motoId: "4",
    motoLabel: "Honda CG 160 Fan 2021",
    data: "2026-05-21",
    hora: "15:00",
    status: "agendado",
    leadId: "4",
  },
  {
    id: "a5",
    clienteNome: "Carlos Pinto",
    clienteTelefone: "(13) 99321-0987",
    motoId: "7",
    motoLabel: "Honda Biz 125 2023",
    data: "2026-05-22",
    hora: "09:30",
    status: "agendado",
  },
  {
    id: "a6",
    clienteNome: "Fernanda Rocha",
    clienteTelefone: "(13) 99367-8901",
    motoId: "2",
    motoLabel: "Yamaha MT-07 2022",
    data: "2026-05-15",
    hora: "11:00",
    status: "realizado",
    leadId: "6",
  },
  {
    id: "a7",
    clienteNome: "Bruno Alves",
    clienteTelefone: "(13) 99278-9012",
    motoId: "6",
    motoLabel: "Suzuki GSX-S750 2022",
    data: "2026-05-13",
    hora: "16:00",
    status: "nao_compareceu",
    leadId: "7",
  },
  {
    id: "a8",
    clienteNome: "Paulo Mendes",
    clienteTelefone: "(13) 99456-7890",
    motoId: "1",
    motoLabel: "Honda CB 300R 2023",
    data: "2026-05-23",
    hora: "10:30",
    status: "agendado",
    leadId: "5",
  },
]

// ── DASHBOARD SUMMARY ──────────────────────────────────────────────
export const dashboardData = {
  faturamentoMes: 24200,
  metaMes: 40000,
  totalEstoque: motos.filter((m) => m.status !== "vendida").reduce((s, m) => s + m.precoVenda, 0),
  qtdDisponiveis: motos.filter((m) => m.status === "disponivel").length,
  qtdReservadas: motos.filter((m) => m.status === "reservada").length,
  qtdEmConserto: motos.filter((m) => m.status === "em_conserto").length,
  leadsAtivos: leads.filter((l) => !["ganho", "perdido"].includes(l.estagio)).length,
  followUpsAtrasados: leads.filter(
    (l) => !["ganho", "perdido"].includes(l.estagio) && l.ultimoContato < "2026-05-17"
  ).length,
  contasPagar7dias: despesas
    .filter((d) => d.status === "pendente" && d.dataVencimento <= "2026-05-27")
    .reduce((s, d) => s + d.valor, 0),
  saldoCaixa: 18750,
}
