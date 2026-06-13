const originalColumns = [
  "NSU",
  "Tipo Chargeback",
  "Data da Transação",
  "Data Abertura de Chargeback",
  "Prazo de contestação",
  "Valor do Chargeback",
  "Valor do Pedido",
  "Bandeira",
  "Valor taxa",
  "Nome do Cliente",
  "Transportadora",
  "Número do Rastreio",
  "Data de envio para o cliente",
  "Retorno de aprovação",
  "ID interno",
  "Seller / Loja",
  "ID Signifyd",
  "Contestado por CTC",
  "Motivo contato cliente",
  "Motivo de recusa",
  "Obs",
  "Ação",
  "Aprovação por quem?",
];

const generatedColumns = [
  "Classificação IA",
  "Risco",
  "Plataforma",
  "Pendências",
  "Próxima ação",
  "Status prazo",
  "Status VTEX",
  "Data faturamento",
  "Data análise",
  "Origem classificação",
];

const allColumns = [...originalColumns, ...generatedColumns];

const headerToField = {
  "NSU": "nsu",
  "Tipo Chargeback": "tipoChargeback",
  "Data da Transação": "dataTransacao",
  "Data Abertura de Chargeback": "dataAberturaChargeback",
  "Prazo de contestação": "prazoContestacao",
  "Valor do Chargeback": "valorChargeback",
  "Valor do Pedido": "valorPedido",
  "Bandeira": "bandeira",
  "Valor taxa": "valorTaxa",
  "Nome do Cliente": "nomeCliente",
  "Transportadora": "transportadora",
  "Número do Rastreio": "numeroRastreio",
  "Data de envio para o cliente": "dataEnvioCliente",
  "Retorno de aprovação": "retornoAprovacao",
  "ID interno": "idInterno",
  "Seller / Loja": "sellerLoja",
  "ID Signifyd": "idSignifyd",
  "Contestado por CTC": "contestadoCtc",
  "Motivo contato cliente": "motivoContatoCliente",
  "Motivo de recusa": "motivoRecusa",
  "Obs": "obs",
  "Ação": "acao",
  "Aprovação por quem?": "aprovacaoPorQuem",
  "Classificação IA": "classificacaoIa",
  "Risco": "risco",
  "Plataforma": "plataformaContestacao",
  "Pendências": "pendencias",
  "Próxima ação": "proximaAcao",
  "Status prazo": "statusPrazo",
  "Status VTEX": "statusVtex",
  "Data faturamento": "dataFaturamento",
  "Data análise": "dataAnalise",
  "Origem classificação": "origemClassificacao",
};

const fieldToHeader = Object.fromEntries(Object.entries(headerToField).map(([header, field]) => [field, header]));

const aliases = {
  nsu: ["nsu", "numero nsu", "codigo nsu"],
  tipoChargeback: ["tipo chargeback", "tipo", "motivo chargeback", "fraude desacordo"],
  dataTransacao: ["data da transacao", "data transacao", "dt transacao", "data compra"],
  dataAberturaChargeback: ["data abertura de chargeback", "data de abertura de chargeback", "abertura chargeback", "data abertura contestacao"],
  prazoContestacao: ["prazo de contestacao", "prazo contestacao", "data limite", "limite contestacao", "vencimento contestacao"],
  valorChargeback: ["valor do chargeback", "valor chargeback", "valor contestado", "valor da contestacao"],
  valorPedido: ["valor do pedido", "valor pedido", "total pedido"],
  bandeira: ["bandeira", "cartao bandeira", "bandeira cartao"],
  valorTaxa: ["valor taxa", "valor da taxa", "taxa", "fee"],
  nomeCliente: ["nome do cliente", "cliente", "customer name"],
  transportadora: ["transportadora", "logistica", "carrier"],
  numeroRastreio: ["numero do rastreio", "rastreio", "codigo rastreio", "cod rastreio", "tracking", "tracking number"],
  dataEnvioCliente: ["data de envio para o cliente", "data envio cliente", "data envio", "envio cliente", "data postagem"],
  retornoAprovacao: ["retorno de aprovacao", "aprovacao", "retorno", "status aprovacao"],
  idInterno: ["id interno", "id", "pedido", "id pedido"],
  sellerLoja: ["seller", "loja", "seller loja"],
  idSignifyd: ["id signifyd", "signifyd", "codigo unico", "codigo signifyd"],
  contestadoCtc: ["contestado por ctc", "contestado", "ctc"],
  motivoContatoCliente: ["motivo contato cliente", "motivo de contato", "zendesk", "ocorrencia cliente"],
  motivoRecusa: ["motivo de recusa", "motivo recusa", "recusa", "motivo"],
  obs: ["obs", "observacao", "observacoes", "comentario"],
  acao: ["acao", "tratativa"],
  aprovacaoPorQuem: ["aprovacao por quem", "responsavel", "aprovador"],
  classificacaoIa: ["classificacao ia", "classificacao"],
  risco: ["risco"],
  plataformaContestacao: ["plataforma", "plataforma contestacao", "plataforma de contestacao"],
  pendencias: ["pendencias"],
  proximaAcao: ["proxima acao", "acao recomendada"],
  statusPrazo: ["status prazo", "status do prazo"],
  statusVtex: ["status vtex", "status pedido", "status do pedido"],
  dataFaturamento: ["data faturamento", "faturamento", "data da nota", "data nf"],
  dataAnalise: ["data analise", "analisado em"],
  origemClassificacao: ["origem classificacao", "classification source"],
};

const classifications = [
  "Fraude",
  "Compensação",
  "Questionamento",
  "Experiência do Cliente",
  "Automação",
  "Transportadora",
  "Documento Pendente",
  "Taxa/Bandeira",
  "Sem Classificação",
];

const risks = ["Baixo", "Médio", "Alto"];
const deadlineStatuses = ["Dentro do prazo", "Próximo do vencimento", "Vencido", "Sem prazo informado"];
const nextActions = [
  "Enviar documentação de defesa",
  "Solicitar comprovante de entrega",
  "Cobrar retorno da transportadora",
  "Validar pedido no OMS",
  "Encaminhar para financeiro",
  "Revisar motivo de recusa",
  "Aguardar retorno da adquirente",
  "Contestar na Signifyd",
  "Contestar na Pagar.me",
  "Solicitar documento para loja",
  "Consultar atendimento Zendesk",
  "Acompanhar cancelamento/devolucao",
  "Encerrar caso",
];

const editableFields = new Set([
  "dataAberturaChargeback",
  "prazoContestacao",
  "valorChargeback",
  "valorPedido",
  "bandeira",
  "valorTaxa",
  "nomeCliente",
  "transportadora",
  "numeroRastreio",
  "dataEnvioCliente",
  "retornoAprovacao",
  "idInterno",
  "sellerLoja",
  "motivoRecusa",
  "obs",
  "acao",
  "aprovacaoPorQuem",
  "tipoChargeback",
  "idSignifyd",
  "contestadoCtc",
  "motivoContatoCliente",
  "classificacaoIa",
  "risco",
  "proximaAcao",
]);

const autoReclassifyFields = new Set([
  "tipoChargeback",
  "dataAberturaChargeback",
  "prazoContestacao",
  "valorChargeback",
  "valorPedido",
  "bandeira",
  "valorTaxa",
  "transportadora",
  "numeroRastreio",
  "dataEnvioCliente",
  "retornoAprovacao",
  "idInterno",
  "motivoRecusa",
  "obs",
  "acao",
  "idSignifyd",
  "motivoContatoCliente",
]);

const state = {
  rows: [],
  selectedId: null,
  filters: {
    search: "",
    bandeira: "",
    transportadora: "",
    retornoAprovacao: "",
    classificacaoIa: "",
    risco: "",
    statusPrazo: "",
  },
  attachmentsByRow: new Map(),
};

const STORAGE_KEY = "chargebackChecklistRows";
const STORAGE_VERSION = 1;
const dateFields = new Set([
  "dataTransacao",
  "dataAberturaChargeback",
  "prazoContestacao",
  "dataEnvioCliente",
  "dataFaturamento",
  "dataAnalise",
]);

const els = {
  fileInput: document.getElementById("fileInput"),
  classifyButton: document.getElementById("classifyButton"),
  exportXlsxButton: document.getElementById("exportXlsxButton"),
  exportCsvButton: document.getElementById("exportCsvButton"),
  clearFiltersButton: document.getElementById("clearFiltersButton"),
  clearDataButton: document.getElementById("clearDataButton"),
  filterResultCount: document.getElementById("filterResultCount"),
  summaryCards: document.getElementById("summaryCards"),
  table: document.getElementById("chargebackTable"),
  tableWrap: document.getElementById("tableWrap"),
  emptyState: document.getElementById("emptyState"),
  toast: document.getElementById("toast"),
  manualNsu: document.getElementById("manualNsu"),
  manualTipo: document.getElementById("manualTipo"),
  manualDataChargeback: document.getElementById("manualDataChargeback"),
  manualMotivo: document.getElementById("manualMotivo"),
  manualPedido: document.getElementById("manualPedido"),
  manualCliente: document.getElementById("manualCliente"),
  manualSeller: document.getElementById("manualSeller"),
  manualValor: document.getElementById("manualValor"),
  manualTaxa: document.getElementById("manualTaxa"),
  manualBandeira: document.getElementById("manualBandeira"),
  manualTransportadora: document.getElementById("manualTransportadora"),
  manualRastreio: document.getElementById("manualRastreio"),
  manualDataEnvio: document.getElementById("manualDataEnvio"),
  manualCreateButton: document.getElementById("manualCreateButton"),
  vtexOrderInput: document.getElementById("vtexOrderInput"),
  vtexLookupButton: document.getElementById("vtexLookupButton"),
  vtexLookupStatus: document.getElementById("vtexLookupStatus"),
  drawer: document.getElementById("drawer"),
  drawerTitle: document.getElementById("drawerTitle"),
  drawerSubtitle: document.getElementById("drawerSubtitle"),
  drawerClassification: document.getElementById("drawerClassification"),
  drawerRisk: document.getElementById("drawerRisk"),
  drawerDeadline: document.getElementById("drawerDeadline"),
  drawerDetails: document.getElementById("drawerDetails"),
  drawerVtexSection: document.getElementById("drawerVtexSection"),
  drawerVtexOpenLink: document.getElementById("drawerVtexOpenLink"),
  drawerVtexSummary: document.getElementById("drawerVtexSummary"),
  drawerVtexItems: document.getElementById("drawerVtexItems"),
  drawerVtexJson: document.getElementById("drawerVtexJson"),
  drawerChecklist: document.getElementById("drawerChecklist"),
  drawerWorkflow: document.getElementById("drawerWorkflow"),
  drawerPendencies: document.getElementById("drawerPendencies"),
  drawerEvidence: document.getElementById("drawerEvidence"),
  drawerEmailTo: document.getElementById("drawerEmailTo"),
  drawerEvidenceFiles: document.getElementById("drawerEvidenceFiles"),
  drawerDocumentList: document.getElementById("drawerDocumentList"),
  copyEmailButton: document.getElementById("copyEmailButton"),
  downloadEmailButton: document.getElementById("downloadEmailButton"),
  drawerAction: document.getElementById("drawerAction"),
  drawerReturn: document.getElementById("drawerReturn"),
  drawerRefusalReason: document.getElementById("drawerRefusalReason"),
  drawerClassificationEdit: document.getElementById("drawerClassificationEdit"),
  drawerRiskEdit: document.getElementById("drawerRiskEdit"),
  drawerObs: document.getElementById("drawerObs"),
  drawerResponsible: document.getElementById("drawerResponsible"),
  drawerContested: document.getElementById("drawerContested"),
  drawerSignifydId: document.getElementById("drawerSignifydId"),
  drawerCustomerReason: document.getElementById("drawerCustomerReason"),
};

const filterElements = {
  search: document.getElementById("filterSearch"),
  bandeira: document.getElementById("filterBandeira"),
  transportadora: document.getElementById("filterTransportadora"),
  retornoAprovacao: document.getElementById("filterRetorno"),
  classificacaoIa: document.getElementById("filterClassificacao"),
  risco: document.getElementById("filterRisco"),
  statusPrazo: document.getElementById("filterStatus"),
};

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeHeader(value) {
  return normalizeText(value).replace(/[^a-z0-9]/g, "");
}

const aliasMap = new Map();
for (const [field, header] of Object.entries(fieldToHeader)) {
  aliasMap.set(normalizeHeader(header), field);
}
for (const [field, values] of Object.entries(aliases)) {
  values.forEach((value) => aliasMap.set(normalizeHeader(value), field));
}

function fieldForHeader(header) {
  return aliasMap.get(normalizeHeader(header));
}

function hasValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function parseMoney(value) {
  if (!hasValue(value)) return "";
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[^\d,.-]/g, "");
  if (!cleaned || cleaned === "-") return value;
  const normalized = cleaned.includes(",") && cleaned.includes(".")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned.replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : value;
}

function parseDate(value) {
  if (!hasValue(value)) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number") {
    const date = new Date(Math.round((value - 25569) * 86400 * 1000));
    return Number.isNaN(date.getTime()) ? value : date;
  }
  const text = String(value).trim();
  const isoDateOnly = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoDateOnly) {
    const date = new Date(Number(isoDateOnly[1]), Number(isoDateOnly[2]) - 1, Number(isoDateOnly[3]));
    return Number.isNaN(date.getTime()) ? value : date;
  }
  const br = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (br) {
    const year = br[3].length === 2 ? Number(`20${br[3]}`) : Number(br[3]);
    const date = new Date(year, Number(br[2]) - 1, Number(br[1]));
    return Number.isNaN(date.getTime()) ? value : date;
  }
  const iso = new Date(text);
  return Number.isNaN(iso.getTime()) ? value : iso;
}

function formatDate(value) {
  const date = parseDate(value);
  if (!(date instanceof Date)) return value ?? "";
  return date.toLocaleDateString("pt-BR");
}

function formatCurrency(value) {
  if (!hasValue(value)) return "";
  const number = typeof value === "number" ? value : parseMoney(value);
  if (typeof number !== "number" || !Number.isFinite(number)) return value;
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function serializeRow(row) {
  const copy = { ...row };
  dateFields.forEach((field) => {
    const date = parseDate(copy[field]);
    if (date instanceof Date) copy[field] = date.toISOString();
  });
  delete copy.vtexRaw;
  return copy;
}

function hydrateRow(row) {
  const copy = { ...row, id: row.id || crypto.randomUUID() };
  dateFields.forEach((field) => {
    if (field in copy) copy[field] = parseDate(copy[field]);
  });
  return copy;
}

function saveRows() {
  try {
    const payload = {
      version: STORAGE_VERSION,
      rows: state.rows.map(serializeRow),
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("Não foi possível salvar a base local.", error);
  }
}

function loadRows() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const payload = JSON.parse(raw);
    const rows = Array.isArray(payload) ? payload : payload.rows;
    if (!Array.isArray(rows)) return;
    state.rows = rows.map(hydrateRow).map((row) => {
      const classified = classifyOperationalRow(row);
      return {
        ...classified,
        classificacaoIa: row.classificacaoIa || classified.classificacaoIa,
        proximaAcao: row.proximaAcao || classified.proximaAcao,
        risco: classified.statusPrazo === "Vencido" ? "Alto" : (row.risco || classified.risco),
      };
    });
  } catch (error) {
    console.warn("Não foi possível carregar a base local.", error);
    localStorage.removeItem(STORAGE_KEY);
  }
}

function addDaysToDate(value, days) {
  const date = parseDate(value);
  if (!(date instanceof Date)) return "";
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function normalizeChargebackType(value) {
  const text = normalizeText(value);
  if (text.includes("desacordo") || text.includes("comercial")) return "Desacordo Comercial";
  if (text.includes("nao contestar") || text.includes("não contestar") || text.includes("cancelado") || text.includes("extraviado") || text.includes("devolvido")) return "Não contestar";
  if (text.includes("fraude") || text.includes("nao reconhe") || text.includes("não reconhe")) return "Fraude";
  return value || "";
}

function deadlineForType(type, chargebackDate) {
  const normalized = normalizeChargebackType(type);
  if (normalized === "Fraude") return addDaysToDate(chargebackDate, 7);
  if (normalized === "Desacordo Comercial") return addDaysToDate(chargebackDate, 10);
  return "";
}

function platformForType(type) {
  const normalized = normalizeChargebackType(type);
  if (normalized === "Fraude") return "Signifyd";
  if (normalized === "Desacordo Comercial") return "Pagar.me";
  if (normalized === "Não contestar") return "Acompanhamento interno";
  return "";
}
function buildSignifydPayload(row, endpoint) {
  if (endpoint === "representments") {
    return {
      orderId: row.idInterno || row.nsu || "",
      chargebackId: row.idSignifyd || row.nsu || row.idInterno || "",
      partnerChargebackId: row.nsu || row.idInterno || "",
      outcome: row.contestadoCtc === "Sim" ? "WON" : "LOST",
      metadata: {
        source: "checklist-chargeback-mensal",
        caseId: row.id,
        endpoint,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  return {
    orderId: row.idInterno || row.nsu || "",
    chargebackId: row.idSignifyd || row.nsu || row.idInterno || "",
    partnerChargebackId: row.nsu || row.idInterno || "",
    partnerMerchantId: row.sellerLoja || "",
    chargeback: {
      type: row.tipoChargeback || "",
      status: row.retornoAprovacao || row.statusVtex || "",
      reason: row.motivoRecusa || row.motivoContatoCliente || row.obs || "",
      amount: row.valorChargeback || "",
      currency: "BRL",
      feeAmount: row.valorTaxa || "",
      cardBrand: row.bandeira || "",
      customerName: row.nomeCliente || "",
      trackingNumber: row.numeroRastreio || "",
      carrier: row.transportadora || "",
      transactionDate: formatDate(row.dataTransacao) || "",
      openedAt: formatDate(row.dataAberturaChargeback) || "",
      dueAt: formatDate(row.prazoContestacao) || "",
      notes: row.obs || "",
    },
    fulfillments: [
      {
        trackingNumber: row.numeroRastreio || "",
        carrier: row.transportadora || "",
        deliveredAt: formatDate(row.dataEnvioCliente) || "",
      },
    ],
    metadata: {
      source: "checklist-chargeback-mensal",
      caseId: row.id,
      endpoint,
      generatedAt: new Date().toISOString(),
    },
  };
}
function classifyOperationalRow(row) {
  const type = normalizeChargebackType(row.tipoChargeback);
  const base = classifyRow({
    ...row,
    tipoChargeback: type,
    prazoContestacao: row.prazoContestacao || deadlineForType(type, row.dataAberturaChargeback),
  });
  const pending = String(base.pendencias || "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
  if (!hasValue(base.idInterno)) pending.push("Pedido VTEX nao informado");
  if (type === "Fraude" && !hasValue(base.idSignifyd)) pending.push("ID Signifyd pendente");
  if (type === "Desacordo Comercial" && !hasValue(base.motivoContatoCliente)) {
    pending.push("Motivo de contato do cliente pendente");
  }

  const actionByType = {
    Fraude: "Contestar na Signifyd",
    "Desacordo Comercial": "Contestar na Pagar.me",
    "Nao contestar": "Acompanhar cancelamento/devolucao",
  };
  const platform = base.plataformaContestacao || platformForType(type);
  return {
    ...base,
    tipoChargeback: type || base.tipoChargeback || "",
    plataformaContestacao: platform,
    pendencias: [...new Set(pending)].join("; "),
    risco: normalizeText(type).includes("contestar") ? "Baixo" : base.risco,
    proximaAcao: normalizeText(type).includes("contestar") ? "Acompanhar cancelamento/devolucao" : (actionByType[type] || base.proximaAcao),
  };
}

function normalizeRecord(raw) {
  const record = { id: crypto.randomUUID() };
  for (const [header, value] of Object.entries(raw)) {
    const field = fieldForHeader(header);
    if (field) record[field] = value;
  }
  ["valorChargeback", "valorPedido", "valorTaxa"].forEach((field) => {
    if (field in record) record[field] = parseMoney(record[field]);
  });
  ["dataTransacao", "dataAberturaChargeback", "prazoContestacao", "dataEnvioCliente", "dataFaturamento", "dataAnalise"].forEach((field) => {
    if (field in record) record[field] = parseDate(record[field]);
  });
  return record;
}

function rowIsEmpty(row) {
  return Object.entries(row)
    .filter(([key]) => key !== "id")
    .every(([, value]) => !hasValue(value));
}

function containsAny(text, terms) {
  return terms.some((term) => text.includes(normalizeText(term)));
}

function deadlineStatus(value) {
  const date = parseDate(value);
  if (!(date instanceof Date)) return "Sem prazo informado";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const near = new Date(today);
  near.setDate(near.getDate() + 5);
  if (date < today) return "Vencido";
  if (date <= near) return "Próximo do vencimento";
  return "Dentro do prazo";
}

function classifyCategory(row) {
  const type = normalizeChargebackType(row.tipoChargeback);
  if (type === "Fraude") return "Fraude";
  if (type === "Desacordo Comercial") return "Experiência do Cliente";
  if (type === "Não contestar") return "Sem Classificação";
  const blob = normalizeText([row.obs, row.motivoRecusa, row.acao, row.retornoAprovacao].filter(hasValue).join(" "));
  if (containsAny(blob, ["fraude", "cliente desconhece", "compra nao reconhecida", "chargeback indevido"])) return "Fraude";
  if (containsAny(blob, ["reembolso", "estorno", "compensacao", "ajuste financeiro"])) return "Compensação";
  if (containsAny(blob, ["duvida", "questionamento", "validar", "analisar"])) return "Questionamento";
  if (containsAny(blob, ["transportadora", "rastreio", "envio", "entrega", "extravio", "atraso", "postagem", "logistica"])) return "Transportadora";
  const hasFinancialSignal = hasValue(row.bandeira) || hasValue(row.valorTaxa);
  if (hasFinancialSignal && containsAny(blob, ["financeiro", "taxa", "bandeira", "adquirente", "tarifa", "valor divergente"])) return "Taxa/Bandeira";
  return "Sem Classificação";
}

function chooseNextAction(row, classification, pendencies, status) {
  const type = normalizeChargebackType(row.tipoChargeback);
  if (type === "Fraude") return "Contestar na Signifyd";
  if (type === "Desacordo Comercial") return "Contestar na Pagar.me";
  if (type === "Não contestar") return "Acompanhar cancelamento/devolucao";
  if (hasValue(row.motivoRecusa)) return "Revisar motivo de recusa";
  if (pendencies.includes("Sem data de envio") || pendencies.includes("Sem rastreio informado")) return "Solicitar comprovante de entrega";
  if (pendencies.includes("Transportadora não informada")) return "Validar pedido no OMS";
  if (classification === "Fraude") return "Enviar documentação de defesa";
  if (classification === "Compensação" || classification === "Taxa/Bandeira") return "Encaminhar para financeiro";
  if (classification === "Questionamento") return "Validar pedido no OMS";
  if (classification === "Transportadora") return "Cobrar retorno da transportadora";
  if (status === "Vencido") return "Encerrar caso";
  return "Aguardar retorno da adquirente";
}

function classifyRow(row) {
  const status = deadlineStatus(row.prazoContestacao);
  const pendencies = [];
  if (!hasValue(row.numeroRastreio)) pendencies.push("Sem rastreio informado");
  if (!hasValue(row.dataEnvioCliente)) pendencies.push("Sem data de envio");
  if (!hasValue(row.transportadora)) pendencies.push("Transportadora não informada");

  const logisticsComplete = hasValue(row.numeroRastreio) && hasValue(row.transportadora) && hasValue(row.dataEnvioCliente);
  let risk = logisticsComplete ? "Baixo" : "Médio";
  if (status === "Vencido" || !hasValue(row.dataEnvioCliente)) risk = "Alto";
  if (hasValue(row.motivoRecusa) && risk === "Baixo") risk = "Médio";

  const classification = classifyCategory(row);
  return {
    ...row,
    classificacaoIa: classification,
    risco: risk,
    pendencias: pendencies.join("; "),
    proximaAcao: chooseNextAction(row, classification, pendencies, status),
    statusPrazo: status,
    statusVtex: row.statusVtex || row.statusPedido || "",
    dataFaturamento: row.dataFaturamento || "",
    dataAnalise: new Date(),
    origemClassificacao: row.origemClassificacao || "Automática - regras locais",
  };
}

function normalizeVtexRecord(data) {
  return classifyOperationalRow({
    id: crypto.randomUUID(),
    nsu: data.nsu || data.lookup || "",
    idInterno: data.idInterno || "",
    prazoContestacao: parseDate(data.prazoContestacao),
    dataFaturamento: parseDate(data.dataFaturamento),
    dataTransacao: parseDate(data.dataTransacao),
    dataAberturaChargeback: parseDate(data.dataAberturaChargeback),
    valorChargeback: parseMoney(data.valorChargeback),
    valorPedido: parseMoney(data.valorChargeback),
    bandeira: data.bandeira || "",
    nomeCliente: data.customer?.name || "",
    transportadora: data.transportadora || "",
    numeroRastreio: data.numeroRastreio || "",
    retornoAprovacao: data.retornoAprovacao || data.statusPedido || "",
    statusVtex: data.statusPedido || "",
    sellerLoja: Array.isArray(data.sellers) ? data.sellers.map((seller) => seller.name || seller.id).filter(Boolean).join(", ") : "",
    obs: data.obs || "",
    origemClassificacao: data.origemClassificacao || "VTEX + regras locais",
    vtexAdminUrl: data.adminOrderUrl || "",
    vtexCustomer: data.customer || null,
    vtexAddress: data.address || null,
    vtexPayment: data.payment || null,
    vtexItems: Array.isArray(data.items) ? data.items : [],
    vtexTotals: Array.isArray(data.totals) ? data.totals : [],
    vtexSellers: Array.isArray(data.sellers) ? data.sellers : [],
    vtexRaw: data.raw || null,
  });
}

function createManualCase() {
  const nsu = els.manualNsu.value.trim();
  const pedido = els.manualPedido.value.trim();
  const type = normalizeChargebackType(els.manualTipo.value);
  const chargebackDate = parseDate(els.manualDataChargeback.value);
  if (!nsu && !pedido) {
    showToast("Informe pelo menos NSU ou pedido VTEX.");
    return;
  }
  const row = classifyOperationalRow({
    id: crypto.randomUUID(),
    nsu,
    tipoChargeback: type,
    dataAberturaChargeback: chargebackDate,
    prazoContestacao: deadlineForType(type, chargebackDate),
    valorChargeback: parseMoney(els.manualValor.value),
    valorPedido: parseMoney(els.manualValor.value),
    valorTaxa: parseMoney(els.manualTaxa.value),
    bandeira: els.manualBandeira.value.trim(),
    idInterno: pedido,
    nomeCliente: els.manualCliente.value.trim(),
    sellerLoja: els.manualSeller.value.trim(),
    transportadora: els.manualTransportadora.value.trim(),
    numeroRastreio: els.manualRastreio.value.trim(),
    dataEnvioCliente: parseDate(els.manualDataEnvio.value),
    motivoRecusa: "",
    obs: els.manualMotivo.value.trim(),
    origemClassificacao: "Manual + regras locais",
  });
  state.rows.unshift(row);
  saveRows();
  updateFilterOptions();
  render();
  openDrawer(row.id);
  [els.manualNsu, els.manualDataChargeback, els.manualMotivo, els.manualPedido, els.manualCliente, els.manualSeller, els.manualValor, els.manualTaxa, els.manualBandeira, els.manualTransportadora, els.manualRastreio, els.manualDataEnvio].forEach((input) => {
    input.value = "";
  });
  showToast("Caso manual criado.");
}

async function lookupVtexOrder() {
  const term = els.vtexOrderInput.value.trim();
  if (!term) {
    showToast("Informe o pedido ou NSU para consultar na VTEX.");
    return;
  }
  els.vtexLookupButton.disabled = true;
  els.vtexLookupStatus.textContent = "Consultando VTEX...";
  try {
    const response = await fetch(`/api/vtex-order?orderId=${encodeURIComponent(term)}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Não foi possível consultar a VTEX.");
    const nextRow = normalizeVtexRecord(data);
    const existingIndex = state.rows.findIndex((row) => {
      return (
        (nextRow.idInterno && row.idInterno === nextRow.idInterno) ||
        (nextRow.nsu && row.nsu === nextRow.nsu)
      );
    });
    let openedId = nextRow.id;
    if (existingIndex >= 0) {
      openedId = state.rows[existingIndex].id;
      const existing = state.rows[existingIndex];
      const merged = { ...existing, ...nextRow, id: openedId };
      ["tipoChargeback", "dataAberturaChargeback", "valorChargeback", "valorTaxa", "idSignifyd", "contestadoCtc", "motivoContatoCliente", "obs"].forEach((field) => {
        if (!hasValue(nextRow[field]) && hasValue(existing[field])) merged[field] = existing[field];
      });
      state.rows[existingIndex] = classifyOperationalRow(merged);
    } else {
      state.rows.unshift(nextRow);
    }
    saveRows();
    updateFilterOptions();
    render();
    openDrawer(openedId);
    els.vtexLookupStatus.textContent = `Pedido ${nextRow.idInterno || term} carregado e adicionado à base.`;
    showToast("Dados da VTEX adicionados à base.");
  } catch (error) {
    els.vtexLookupStatus.textContent = error.message;
    showToast(error.message);
  } finally {
    els.vtexLookupButton.disabled = false;
  }
}

function classifyAll() {
  state.rows = state.rows.map(classifyOperationalRow);
  saveRows();
  render();
  showToast("Classificação automática concluída.");
}

async function importFile(file) {
  if (!file) return;
  try {
    const extension = file.name.split(".").pop().toLowerCase();
    let records = [];
    if (extension === "csv") {
      const text = await file.text();
      records = parseCsvText(text);
    } else {
      if (!window.XLSX) throw new Error("Biblioteca XLSX ainda não carregou. Tente novamente em alguns segundos.");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      records = XLSX.utils.sheet_to_json(sheet, { defval: "" }).map(normalizeRecord).filter((row) => !rowIsEmpty(row));
    }
    state.rows = records.map(classifyOperationalRow);
    saveRows();
    updateFilterOptions();
    render();
    showToast(`${records.length} caso(s) importado(s).`);
  } catch (error) {
    showToast(error.message || "Não foi possível importar o arquivo.");
  } finally {
    els.fileInput.value = "";
  }
}

function parseCsvText(text) {
  const delimiter = detectDelimiter(text);
  const rows = parseDelimited(text, delimiter);
  const headers = rows.shift() || [];
  return rows
    .filter((row) => row.some(hasValue))
    .map((row) => {
      const raw = {};
      headers.forEach((header, index) => {
        raw[header] = row[index] ?? "";
      });
      return normalizeRecord(raw);
    })
    .filter((row) => !rowIsEmpty(row));
}

function detectDelimiter(text) {
  const sample = text.split(/\r?\n/).slice(0, 5).join("\n");
  const candidates = [";", ",", "\t", "|"];
  return candidates
    .map((delimiter) => ({ delimiter, count: (sample.match(new RegExp(`\\${delimiter}`, "g")) || []).length }))
    .sort((a, b) => b.count - a.count)[0].delimiter;
}

function parseDelimited(text, delimiter) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function filteredRows() {
  const search = normalizeText(state.filters.search);
  return state.rows.filter((row) => {
    if (search) {
      const blob = normalizeText(
        allColumns
          .map((column) => {
            const field = headerToField[column];
            return displayValue(field, row[field]);
          })
          .join(" ")
      );
      if (!blob.includes(search)) return false;
    }
    return Object.entries(state.filters)
      .filter(([field]) => field !== "search")
      .every(([field, value]) => !value || String(row[field] ?? "") === value);
  });
}

function updateFilterOptions() {
  for (const [field, select] of Object.entries(filterElements)) {
    if (!select) continue;
    if (field === "search") {
      select.value = state.filters.search;
      continue;
    }
    const current = state.filters[field];
    const values = [...new Set(state.rows.map((row) => row[field]).filter(hasValue).map(String))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    select.innerHTML = `<option value="">Todos</option>${values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}`;
    select.value = values.includes(current) ? current : "";
    state.filters[field] = select.value;
  }
}

function render() {
  renderSummary();
  renderTable();
  if (state.selectedId) renderDrawer();
}

function renderSummary() {
  const rows = filteredRows();
  const statusCount = countBy(rows, "statusPrazo");
  const totalValue = rows.reduce((sum, row) => sum + (typeof row.valorChargeback === "number" ? row.valorChargeback : 0), 0);
  const cards = [
    ["Total de casos", rows.length],
    ["Dentro do prazo", statusCount["Dentro do prazo"] || 0],
    ["Próximos do vencimento", statusCount["Próximo do vencimento"] || 0],
    ["Vencidos", statusCount.Vencido || 0],
    ["Valor total contestado", formatCurrency(totalValue)],
    ["Casos sem rastreio", rows.filter((row) => !hasValue(row.numeroRastreio)).length],
    ["Risco alto", rows.filter((row) => row.risco === "Alto").length],
  ];
  els.summaryCards.innerHTML = cards
    .map(([label, value]) => `<article class="summary-card"><span>${label}</span><strong>${value}</strong></article>`)
    .join("");
}

function renderTable() {
  const rows = filteredRows();
  els.emptyState.hidden = state.rows.length > 0;
  els.tableWrap.hidden = state.rows.length === 0;
  if (els.filterResultCount) {
    els.filterResultCount.textContent = state.rows.length
      ? `${rows.length} de ${state.rows.length} caso(s) exibidos`
      : "0 casos exibidos";
  }
  if (!state.rows.length) {
    els.table.innerHTML = "";
    return;
  }

  const headerHtml = `<th class="table-action-col">Caso</th>${allColumns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}`;
  const bodyHtml = rows.length
    ? rows.map((row) => {
      const attachmentsCount = attachmentsForRow(row.id).length;
      const actionCell = `<td class="table-action-col" data-id="${row.id}">
        <button class="row-action-button" type="button" data-open-case="${row.id}">Abrir</button>
        <button class="row-action-button row-action-primary" type="button" data-attach-case="${row.id}">
          Comprovantes${attachmentsCount ? ` (${attachmentsCount})` : ""}
        </button>
      </td>`;
      const cells = allColumns
        .map((column) => {
          const field = headerToField[column];
          const value = displayValue(field, row[field]);
          const editable = editableFields.has(field) ? ' contenteditable="true"' : "";
          const badge = badgeClass(field, row[field]);
          const content = badge ? `<span class="badge ${badge}">${escapeHtml(value)}</span>` : escapeHtml(value);
          return `<td data-id="${row.id}" data-field="${field}" title="${escapeHtml(value)}"${editable}>${content}</td>`;
        })
        .join("");
      const selectedClass = row.id === state.selectedId ? ' class="selected-row"' : "";
      return `<tr data-id="${row.id}"${selectedClass}>${actionCell}${cells}</tr>`;
    }).join("")
    : `<tr><td class="no-results-row" colspan="${allColumns.length + 1}">Nenhum caso encontrado com os filtros atuais.</td></tr>`;
  els.table.innerHTML = `<thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody>`;
}

function displayValue(field, value) {
  if (["dataTransacao", "dataAberturaChargeback", "prazoContestacao", "dataEnvioCliente", "dataFaturamento", "dataAnalise"].includes(field)) return formatDate(value);
  if (["valorChargeback", "valorPedido", "valorTaxa"].includes(field)) return formatCurrency(value);
  return value ?? "";
}

function badgeClass(field, value) {
  if (field === "risco") {
    if (value === "Baixo") return "badge-green";
    if (value === "Médio") return "badge-yellow";
    if (value === "Alto") return "badge-red";
  }
  if (field === "statusPrazo") {
    if (value === "Dentro do prazo") return "badge-green";
    if (value === "Próximo do vencimento") return "badge-yellow";
    if (value === "Vencido") return "badge-red";
    if (value === "Sem prazo informado") return "badge-yellow";
  }
  if (field === "retornoAprovacao") {
    const normalized = normalizeText(value);
    if (normalized.includes("aprov")) return "badge-green";
    if (normalized.includes("recus")) return "badge-red";
    if (normalized.includes("pend") || normalized.includes("analise")) return "badge-yellow";
  }
  if (field === "classificacaoIa") return "badge-blue";
  return "";
}

function countBy(rows, field) {
  return rows.reduce((acc, row) => {
    const key = row[field] || "";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function parseFieldValue(field, value) {
  if (dateFields.has(field)) return parseDate(value);
  if (["valorChargeback", "valorPedido", "valorTaxa"].includes(field)) return parseMoney(value);
  return value;
}

function updateCell(id, field, value) {
  const row = state.rows.find((item) => item.id === id);
  if (!row) return;
  row[field] = parseFieldValue(field, value);
  if (["tipoChargeback", "dataAberturaChargeback"].includes(field)) {
    row.prazoContestacao = row.prazoContestacao || deadlineForType(row.tipoChargeback, row.dataAberturaChargeback);
  }
  if (autoReclassifyFields.has(field)) {
    Object.assign(row, classifyOperationalRow(row));
  }
  saveRows();
  updateFilterOptions();
  render();
}

function attachmentsForRow(rowId) {
  return state.attachmentsByRow.get(rowId) || [];
}

function addAttachments(rowId, files) {
  const current = attachmentsForRow(rowId);
  const next = [...current];
  for (const file of files) {
    const exists = next.some((item) => {
      return item.name === file.name && item.size === file.size && item.lastModified === file.lastModified;
    });
    if (!exists) next.push(file);
  }
  state.attachmentsByRow.set(rowId, next);
}

function removeAttachment(rowId, index) {
  const next = attachmentsForRow(rowId).filter((_, fileIndex) => fileIndex !== index);
  if (next.length) {
    state.attachmentsByRow.set(rowId, next);
  } else {
    state.attachmentsByRow.delete(rowId);
  }
  render();
}

function formatFileSize(size) {
  if (!Number.isFinite(size)) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function openDrawer(id) {
  state.selectedId = id;
  renderTable();
  renderDrawer();
  els.drawer.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  state.selectedId = null;
  els.drawer.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
  renderTable();
}

function renderDrawer() {
  const row = state.rows.find((item) => item.id === state.selectedId);
  if (!row) return;
  els.drawerTitle.textContent = `Caso ${row.nsu || row.idInterno || "sem identificação"}`;
  els.drawerSubtitle.textContent = `${row.bandeira || "Sem bandeira"} · ${formatCurrency(row.valorChargeback) || "Sem valor"}`;
  setBadge(els.drawerClassification, row.classificacaoIa, "classificacaoIa");
  setBadge(els.drawerRisk, row.risco, "risco");
  setBadge(els.drawerDeadline, row.statusPrazo, "statusPrazo");

  const details = [
    ["NSU", row.nsu],
    ["Tipo chargeback", row.tipoChargeback],
    ["Plataforma", row.plataformaContestacao],
    ["ID interno", row.idInterno],
    ["ID Signifyd", row.idSignifyd],
    ["Nome cliente", row.nomeCliente],
    ["Seller / Loja", row.sellerLoja],
    ["Data da transação", formatDate(row.dataTransacao)],
    ["Abertura chargeback", formatDate(row.dataAberturaChargeback)],
    ["Prazo contestação", formatDate(row.prazoContestacao)],
    ["Data faturamento", formatDate(row.dataFaturamento)],
    ["Valor chargeback", formatCurrency(row.valorChargeback)],
    ["Valor pedido", formatCurrency(row.valorPedido)],
    ["Bandeira", row.bandeira],
    ["Transportadora", row.transportadora],
    ["Número do rastreio", row.numeroRastreio],
    ["Data envio cliente", formatDate(row.dataEnvioCliente)],
    ["Retorno aprovação", row.retornoAprovacao],
    ["Status VTEX", row.statusVtex],
    ["Motivo de recusa", row.motivoRecusa],
    ["Motivo contato cliente", row.motivoContatoCliente],
    ["Contestado por CTC", row.contestadoCtc],
    ["Risco de perda", row.risco],
  ];
  els.drawerDetails.innerHTML = details.map(([label, value]) => `<dt>${label}</dt><dd>${escapeHtml(value || "")}</dd>`).join("");
  renderVtexOrder(row);

  els.drawerChecklist.innerHTML = checklist(row)
    .map((item) => `<div class="check-item"><div><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.detail)}</small></div><span class="badge ${item.ok ? "badge-green" : "badge-red"}">${item.ok ? "Sim" : "Não"}</span></div>`)
    .join("");
  els.drawerWorkflow.innerHTML = workflowForCase(row)
    .map((item) => `<div class="workflow-item"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.body)}</span></div>`)
    .join("");

  const pendencies = String(row.pendencias || "").split(";").map((item) => item.trim()).filter(Boolean);
  els.drawerPendencies.innerHTML = pendencies.length ? pendencies.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>Nenhuma pendência encontrada.</li>";
  els.drawerEvidence.innerHTML = evidenceListForCase(row).map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  els.drawerAction.innerHTML = nextActions.map((action) => `<option value="${escapeHtml(action)}">${escapeHtml(action)}</option>`).join("");
  els.drawerAction.value = row.proximaAcao || nextActions[0];
  els.drawerReturn.value = row.retornoAprovacao || "";
  els.drawerRefusalReason.value = row.motivoRecusa || "";
  els.drawerClassificationEdit.innerHTML = ["", ...classifications]
    .map((classification) => `<option value="${escapeHtml(classification)}">${escapeHtml(classification)}</option>`)
    .join("");
  els.drawerClassificationEdit.value = row.classificacaoIa || "";
  els.drawerRiskEdit.innerHTML = ["", ...risks].map((risk) => `<option value="${escapeHtml(risk)}">${escapeHtml(risk)}</option>`).join("");
  els.drawerRiskEdit.value = row.risco || "";
  els.drawerObs.value = row.obs || "";
  els.drawerResponsible.value = row.aprovacaoPorQuem || "";
  els.drawerContested.value = row.contestadoCtc || "";
  els.drawerSignifydId.value = row.idSignifyd || "";
  els.drawerCustomerReason.value = row.motivoContatoCliente || "";
  els.drawerEmailTo.value = localStorage.getItem("chargebackEmailTo") || "";
  els.drawerEvidenceFiles.value = "";
  renderDocumentList(row.id);
}

function renderVtexOrder(row) {
  const hasVtexData = Boolean(row.vtexRaw || row.vtexItems?.length || row.vtexCustomer || row.vtexAddress || row.vtexPayment);
  els.drawerVtexSection.hidden = !hasVtexData;
  if (!hasVtexData) return;

  const customer = row.vtexCustomer || {};
  const address = row.vtexAddress || {};
  const payment = row.vtexPayment || {};
  const totals = Array.isArray(row.vtexTotals) ? row.vtexTotals : [];
  const totalText = totals.length
    ? totals.map((total) => `${total.name || total.id}: ${formatCurrency(total.value)}`).join(" | ")
    : "";
  const addressText = [
    address.street,
    address.number,
    address.complement,
    address.neighborhood,
    address.city,
    address.state,
    address.postalCode,
  ].filter(hasValue).join(", ");

  const summary = [
    ["Cliente", customer.name],
    ["E-mail", customer.email],
    ["Documento", customer.document],
    ["Telefone", customer.phone],
    ["Endereco", addressText],
    ["Recebedor", address.receiverName],
    ["Pagamento", payment.paymentSystemName || payment.group],
    ["Parcelas", payment.installments],
    ["Valor pagamento", formatCurrency(payment.value)],
    ["TID", payment.tid],
    ["NSU pagamento", payment.nsu],
    ["Totais VTEX", totalText],
  ];
  els.drawerVtexSummary.innerHTML = summary
    .map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || "")}</dd>`)
    .join("");

  if (row.vtexAdminUrl) {
    els.drawerVtexOpenLink.hidden = false;
    els.drawerVtexOpenLink.href = row.vtexAdminUrl;
  } else {
    els.drawerVtexOpenLink.hidden = true;
    els.drawerVtexOpenLink.removeAttribute("href");
  }

  els.drawerVtexItems.innerHTML = renderVtexItems(row.vtexItems || []);
  els.drawerVtexJson.textContent = JSON.stringify(row.vtexRaw || {}, null, 2);
}

function renderVtexItems(items) {
  if (!items.length) return `<p class="muted-note">Nenhum item retornado pela VTEX.</p>`;
  const rows = items.map((item) => {
    return `<tr>
      <td>${escapeHtml(item.refId || item.id || "")}</td>
      <td>${escapeHtml(item.name || item.skuName || "")}</td>
      <td>${escapeHtml(item.quantity ?? "")}</td>
      <td>${escapeHtml(formatCurrency(item.sellingPrice))}</td>
    </tr>`;
  }).join("");
  return `<table>
    <thead><tr><th>SKU</th><th>Item</th><th>Qtd.</th><th>Valor</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function renderDocumentList(rowId) {
  const files = attachmentsForRow(rowId);
  if (!files.length) {
    els.drawerDocumentList.innerHTML = `<p class="muted-note">Nenhum documento adicionado neste caso.</p>`;
    return;
  }
  els.drawerDocumentList.innerHTML = files.map((file, index) => {
    return `<div class="document-item">
      <span>${escapeHtml(file.name)} <small>${escapeHtml(formatFileSize(file.size))}</small></span>
      <button type="button" class="document-remove" data-remove-attachment="${index}">Remover</button>
    </div>`;
  }).join("");
}

function setBadge(element, value, field) {
  element.textContent = value || "";
  element.className = `badge ${badgeClass(field, value)}`;
}

function checklist(row) {
  const deadline = parseDate(row.prazoContestacao);
  const validDeadline = deadline instanceof Date && deadline >= startOfToday();
  return [
    ["NSU preenchido?", hasValue(row.nsu), "Obrigatório para localização do caso."],
    ["Data da transação preenchida?", hasValue(row.dataTransacao), "Ajuda a reconciliar pedido, adquirente e OMS."],
    ["Data de abertura do chargeback preenchida?", hasValue(row.dataAberturaChargeback), "Necessária para medir SLA de contestação."],
    ["Prazo de contestação preenchido?", deadline instanceof Date, "Sem prazo, priorizar manualmente."],
    ["Prazo ainda válido?", validDeadline, row.statusPrazo || ""],
    ["Valor do chargeback preenchido?", hasValue(row.valorChargeback), "Necessário para relatório financeiro."],
    ["Bandeira preenchida?", hasValue(row.bandeira), "Apoia tratativa com adquirente."],
    ["Valor taxa preenchido?", hasValue(row.valorTaxa), "Apoia conferência financeira."],
    ["Transportadora preenchida?", hasValue(row.transportadora), "Evidência logística incompleta sem transportadora."],
    ["Número de rastreio preenchido?", hasValue(row.numeroRastreio), "Evidência logística incompleta sem rastreio."],
    ["Data de envio ao cliente preenchida?", hasValue(row.dataEnvioCliente), "Sem envio, risco de perda sobe."],
    ["Retorno de aprovação preenchido?", hasValue(row.retornoAprovacao), "Indica andamento com adquirente/área responsável."],
    ["Motivo de recusa preenchido, se aplicável?", true, "Preencher quando houver recusa ou divergência."],
    ["Ação definida?", hasValue(row.acao) || hasValue(row.proximaAcao), row.proximaAcao || ""],
    ["Responsável definido?", hasValue(row.aprovacaoPorQuem), "Responsável/aprovador pendente quando vazio."],
  ].map(([label, ok, detail]) => ({ label, ok, detail }));
}

function workflowForCase(row) {
  const type = normalizeChargebackType(row.tipoChargeback);
  if (type === "Fraude") {
    return [
      { title: "Plataforma", body: "Contestar na Signifyd." },
      { title: "Prazo", body: "7 dias corridos a partir do recebimento/data do chargeback." },
      { title: "Localizar pedido", body: "Use o codigo unico da VTEX; se houver divisao de pedido, use o primeiro com final -01." },
      { title: "Documentos", body: "Anexe endereco de entrega e comprovante de entrega, preferencialmente JPG quando for imagem." },
      { title: "Dados obrigatorios", body: "Rastreio, transportadora, numero/data/motivo/valor do chargeback e valor da taxa." },
      { title: "Depois do envio", body: "Preencha data/status, ID Signifyd e marque Contestado por CTC = Sim." },
    ];
  }
  if (type === "Desacordo Comercial") {
    return [
      { title: "Plataforma", body: "Contestar na Pagar.me." },
      { title: "Prazo", body: "10 dias corridos para contestacao." },
      { title: "Atendimento", body: "Consulte Zendesk/atendimento e registre o motivo de contato do cliente." },
      { title: "Documentos", body: "Comprovante de entrega, dados do pedido, nota fiscal, explicacao da ocorrencia e comprovante de estorno se houver." },
      { title: "Depois do envio", body: "Anexe os arquivos na Pagar.me e marque Contestado por CTC = Sim." },
    ];
  }
  if (normalizeText(type).includes("contestar")) {
    return [
      { title: "Quando nao contestar", body: "Casos cancelados, extraviados, devolvidos ou em processo de devolucao." },
      { title: "Acao", body: "Acompanhe diariamente para garantir produto/ressarcimento e evitar perda dupla." },
    ];
  }
  return [{ title: "Definir tipo", body: "Escolha Fraude, Desacordo Comercial ou Nao contestar para exibir o fluxo correto." }];
}

function evidenceList(row) {
  const evidence = ["Comprovante da transação", "Pedido/ID interno validado no OMS"];
  if (!hasValue(row.numeroRastreio)) evidence.push("Número de rastreio");
  if (!hasValue(row.transportadora)) evidence.push("Confirmação da transportadora");
  if (!hasValue(row.dataEnvioCliente)) evidence.push("Data/comprovante de envio ao cliente");
  if (row.classificacaoIa === "Fraude") evidence.push("Documentação de defesa contra fraude");
  if (row.classificacaoIa === "Taxa/Bandeira") evidence.push("Conferência financeira de taxa/bandeira");
  return evidence;
}

function evidenceListForCase(row) {
  const base = evidenceList(row);
  const type = normalizeChargebackType(row.tipoChargeback);
  const extra = [];
  if (type === "Fraude") extra.push("Endereco de entrega", "Comprovante de entrega", "Codigo de rastreio", "ID Signifyd");
  if (type === "Desacordo Comercial") extra.push("Nota fiscal", "Explicacao da ocorrencia", "Comprovante de estorno se houver", "Motivo de contato do cliente");
  return [...new Set([...base, ...extra])];
}

function buildEmailTemplate(row) {
  const subject = `Solicitação de chargeback - Pedido ${row.idInterno || "sem ID"} / NSU ${row.nsu || "sem NSU"}`;
  const attachments = attachmentsForRow(row.id);
  const pendencies = String(row.pendencias || "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
  const body = [
    "Prezados,",
    "",
    "Segue solicitação de análise/contestação de chargeback com as evidências do pedido.",
    "",
    `Pedido/ID interno: ${row.idInterno || ""}`,
    `NSU: ${row.nsu || ""}`,
    `Tipo chargeback: ${row.tipoChargeback || ""}`,
    `Plataforma: ${row.plataformaContestacao || ""}`,
    `Nome cliente: ${row.nomeCliente || ""}`,
    `Seller/Loja: ${row.sellerLoja || ""}`,
    `Status VTEX: ${row.statusVtex || row.retornoAprovacao || ""}`,
    `Data da transação: ${formatDate(row.dataTransacao)}`,
    `Data de faturamento: ${formatDate(row.dataFaturamento)}`,
    `Prazo de contestação: ${formatDate(row.prazoContestacao)}`,
    `Valor contestado: ${formatCurrency(row.valorChargeback)}`,
    `Valor pedido: ${formatCurrency(row.valorPedido)}`,
    `Bandeira: ${row.bandeira || ""}`,
    `Transportadora: ${row.transportadora || ""}`,
    `Número de rastreio: ${row.numeroRastreio || ""}`,
    `Classificação: ${row.classificacaoIa || ""}`,
    `Risco: ${row.risco || ""}`,
    `Próxima ação: ${row.proximaAcao || ""}`,
    "",
    "Pendências encontradas:",
    pendencies.length ? pendencies.map((item) => `- ${item}`).join("\n") : "- Nenhuma pendência encontrada.",
    "",
    "Evidências anexadas:",
    attachments.length
      ? attachments.map((file) => `- ${file.name}`).join("\n")
      : "- Sem anexos adicionados nesta tela.",
    "",
    "Observação operacional:",
    row.obs || "",
    "",
    "Atenciosamente,",
    "Equipe de Chargeback",
  ].join("\n");
  return { subject, body };
}

async function copyEmailBody() {
  const row = state.rows.find((item) => item.id === state.selectedId);
  if (!row) return;
  const { body } = buildEmailTemplate(row);
  const to = els.drawerEmailTo.value.trim();
  if (to) localStorage.setItem("chargebackEmailTo", to);
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard indisponível.");
    await navigator.clipboard.writeText(body);
    showToast("Corpo do e-mail copiado.");
  } catch {
    const filename = `chargeback_${row.idInterno || row.nsu || "caso"}_email.txt`.replace(/[\\/:*?"<>|]/g, "_");
    downloadBlob(body, filename, "text/plain;charset=utf-8");
    showToast("Não consegui copiar; baixei o texto do e-mail.");
  }
}

function base64Utf8(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary);
}

function wrapBase64(base64) {
  return base64.match(/.{1,76}/g)?.join("\r\n") || "";
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function encodeHeader(value) {
  return `=?UTF-8?B?${base64Utf8(value)}?=`;
}

async function downloadEmailDraft() {
  const row = state.rows.find((item) => item.id === state.selectedId);
  if (!row) return;
  const to = els.drawerEmailTo.value.trim();
  if (to) localStorage.setItem("chargebackEmailTo", to);
  const { subject, body } = buildEmailTemplate(row);
  const boundary = `chargeback_${Date.now()}`;
  const attachments = attachmentsForRow(row.id);
  const lines = [
    `To: ${to}`,
    `Subject: ${encodeHeader(subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(base64Utf8(body)),
  ];

  for (const file of attachments) {
    const base64 = await fileToBase64(file);
    lines.push(
      `--${boundary}`,
      `Content-Type: ${file.type || "application/octet-stream"}; name="${file.name}"`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${file.name}"`,
      "",
      wrapBase64(base64)
    );
  }

  lines.push(`--${boundary}--`, "");
  const filename = `chargeback_${row.idInterno || row.nsu || "caso"}.eml`.replace(/[\\/:*?"<>|]/g, "_");
  downloadBlob(lines.join("\r\n"), filename, "message/rfc822");
  showToast("E-mail padrão gerado com anexos.");
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

async function sendSignifydRequest() {
  const row = state.rows.find((item) => item.id === state.selectedId);
  if (!row) return;

  let payload;
  try {
    payload = readSignifydPayload() || buildSignifydPayload(row, normalizeSignifydEndpoint(els.signifydEndpoint.value));
  } catch (error) {
    setSignifydStatus("Payload JSON inválido.", "error");
    setSignifydResponse({ error: "JSON inválido", details: String(error.message || error) });
    return;
  }

  const username = els.signifydUsername.value.trim();
  const password = els.signifydPassword.value;
  const teamId = els.signifydTeamId.value.trim();
  const endpoint = normalizeSignifydEndpoint(els.signifydEndpoint.value);

  if (!username) {
    setSignifydStatus("Informe a username/API key antes de enviar.", "error");
    return;
  }

  setSignifydStatus("Enviando chargeback via API da Signifyd...", "info");
  setSignifydResponse({ request: payload });

  try {
    const response = await fetch("/api/signifyd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint,
        username,
        password,
        teamId,
        payload,
      }),
    });

    const text = await response.text();
    let body = text;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }

    setSignifydResponse(body);
    if (response.ok) {
      setSignifydStatus(`Chargeback enviado via API. HTTP ${response.status}.`, "success");
    } else {
      setSignifydStatus(`Signifyd retornou HTTP ${response.status}.`, "error");
    }
  } catch (error) {
    setSignifydStatus("Falha ao enviar chargeback via API da Signifyd.", "error");
    setSignifydResponse({ error: String(error.message || error) });
  }
}

function exportRows(format) {
  if (!state.rows.length) {
    showToast("Importe uma base antes de exportar.");
    return;
  }
  const exportData = state.rows.map((row) => {
    const output = {};
    allColumns.forEach((column) => {
      const field = headerToField[column];
      output[column] = displayValue(field, row[field]);
    });
    return output;
  });
  const today = new Date().toISOString().slice(0, 10);
  if (format === "csv") {
    downloadBlob(toCsv(exportData), `chargeback_checklist_export_${today}.csv`, "text/csv;charset=utf-8");
    return;
  }
  if (!window.XLSX) {
    showToast("Biblioteca XLSX ainda não carregou. Tente novamente em alguns segundos.");
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(exportData, { header: allColumns });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Chargeback Checklist");
  XLSX.writeFile(workbook, `chargeback_checklist_export_${today}.xlsx`);
}

function toCsv(rows) {
  const lines = [allColumns.join(";")];
  rows.forEach((row) => {
    lines.push(allColumns.map((column) => csvEscape(row[column])).join(";"));
  });
  return `\ufeff${lines.join("\n")}`;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function runChargebackClassifierExamples() {
  const past = new Date();
  past.setDate(past.getDate() - 1);
  const future = new Date();
  future.setDate(future.getDate() + 10);
  const examples = [
    {
      name: "Linha sem rastreio",
      row: { prazoContestacao: future, transportadora: "Correios", dataEnvioCliente: future },
      assert: (result) => String(result.pendencias).includes("Sem rastreio informado"),
    },
    {
      name: "Prazo vencido",
      row: { prazoContestacao: past, numeroRastreio: "BR123", transportadora: "Correios", dataEnvioCliente: future },
      assert: (result) => result.risco === "Alto" && result.statusPrazo === "Vencido",
    },
    {
      name: "Obs fraude",
      row: { prazoContestacao: future, obs: "cliente desconhece fraude" },
      assert: (result) => result.classificacaoIa === "Fraude",
    },
    {
      name: "Obs estorno",
      row: { prazoContestacao: future, obs: "solicitar estorno" },
      assert: (result) => result.classificacaoIa === "Compensação",
    },
    {
      name: "Evidência logística completa",
      row: { prazoContestacao: future, numeroRastreio: "BR123", transportadora: "Correios", dataEnvioCliente: future },
      assert: (result) => result.risco === "Baixo",
    },
    {
      name: "Sem prazo",
      row: {},
      assert: (result) => result.statusPrazo === "Sem prazo informado",
    },
  ];
  return examples.map((example) => {
    const result = classifyOperationalRow({ id: crypto.randomUUID(), ...example.row });
    return { name: example.name, passed: example.assert(result), result };
  });
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => els.toast.classList.remove("show"), 3200);
}

els.fileInput.addEventListener("change", (event) => importFile(event.target.files[0]));
els.manualCreateButton.addEventListener("click", createManualCase);
els.vtexLookupButton.addEventListener("click", lookupVtexOrder);
els.vtexOrderInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") lookupVtexOrder();
});
els.classifyButton.addEventListener("click", classifyAll);
els.exportXlsxButton.addEventListener("click", () => exportRows("xlsx"));
els.exportCsvButton.addEventListener("click", () => exportRows("csv"));
els.clearFiltersButton.addEventListener("click", () => {
  Object.keys(state.filters).forEach((key) => {
    state.filters[key] = "";
    if (filterElements[key]) filterElements[key].value = "";
  });
  renderSummary();
  renderTable();
});
if (els.clearDataButton) {
  els.clearDataButton.addEventListener("click", () => {
    if (!window.confirm("Limpar todos os casos salvos neste navegador?")) return;
    state.rows = [];
    state.selectedId = null;
    state.attachmentsByRow.clear();
    localStorage.removeItem(STORAGE_KEY);
    updateFilterOptions();
    render();
    closeDrawer();
    showToast("Base local limpa.");
  });
}

for (const [field, select] of Object.entries(filterElements)) {
  if (!select) continue;
  const eventName = field === "search" ? "input" : "change";
  select.addEventListener(eventName, () => {
    state.filters[field] = select.value;
    renderSummary();
    renderTable();
  });
}

els.table.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-case]");
  if (openButton) {
    openDrawer(openButton.dataset.openCase);
    return;
  }
  const attachButton = event.target.closest("[data-attach-case]");
  if (attachButton) {
    openDrawer(attachButton.dataset.attachCase);
    els.drawerEvidenceFiles.click();
    return;
  }
  const row = event.target.closest("tr[data-id]");
  const cell = event.target.closest("td[contenteditable='true']");
  if (cell) return;
  if (row) openDrawer(row.dataset.id);
});

els.table.addEventListener("focusout", (event) => {
  const cell = event.target.closest("td[contenteditable='true']");
  if (!cell) return;
  updateCell(cell.dataset.id, cell.dataset.field, cell.textContent.trim());
});

document.querySelectorAll("[data-close-drawer]").forEach((element) => {
  element.addEventListener("click", closeDrawer);
});

els.drawerAction.addEventListener("change", () => {
  if (state.selectedId) updateCell(state.selectedId, "proximaAcao", els.drawerAction.value);
});
els.drawerReturn.addEventListener("change", () => {
  if (state.selectedId) updateCell(state.selectedId, "retornoAprovacao", els.drawerReturn.value);
});
els.drawerRefusalReason.addEventListener("change", () => {
  if (state.selectedId) updateCell(state.selectedId, "motivoRecusa", els.drawerRefusalReason.value);
});
els.drawerClassificationEdit.addEventListener("change", () => {
  if (state.selectedId) updateCell(state.selectedId, "classificacaoIa", els.drawerClassificationEdit.value);
});
els.drawerRiskEdit.addEventListener("change", () => {
  if (state.selectedId) updateCell(state.selectedId, "risco", els.drawerRiskEdit.value);
});
els.drawerObs.addEventListener("change", () => {
  if (state.selectedId) updateCell(state.selectedId, "obs", els.drawerObs.value);
});
els.drawerResponsible.addEventListener("change", () => {
  if (state.selectedId) updateCell(state.selectedId, "aprovacaoPorQuem", els.drawerResponsible.value);
});
els.drawerContested.addEventListener("change", () => {
  if (state.selectedId) updateCell(state.selectedId, "contestadoCtc", els.drawerContested.value);
});
els.drawerSignifydId.addEventListener("change", () => {
  if (state.selectedId) updateCell(state.selectedId, "idSignifyd", els.drawerSignifydId.value);
});
els.drawerCustomerReason.addEventListener("change", () => {
  if (state.selectedId) updateCell(state.selectedId, "motivoContatoCliente", els.drawerCustomerReason.value);
});
els.drawerEvidenceFiles.addEventListener("change", () => {
  if (!state.selectedId) return;
  addAttachments(state.selectedId, Array.from(els.drawerEvidenceFiles.files || []));
  els.drawerEvidenceFiles.value = "";
  render();
  showToast("Documento(s) adicionados ao caso.");
});
els.drawerDocumentList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-attachment]");
  if (!button || !state.selectedId) return;
  removeAttachment(state.selectedId, Number(button.dataset.removeAttachment));
});
els.copyEmailButton.addEventListener("click", copyEmailBody);
els.downloadEmailButton.addEventListener("click", downloadEmailDraft);

window.addEventListener("unhandledrejection", (event) => {
  console.error(event.reason);
  showToast("Ocorreu um erro inesperado. Verifique os dados e tente novamente.");
});

window.runChargebackClassifierExamples = runChargebackClassifierExamples;

loadRows();
updateFilterOptions();
render();
