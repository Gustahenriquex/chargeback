const originalColumns = [
  "NSU",
  "Data da Transação",
  "Data Abertura de Chargeback",
  "Prazo de contestação",
  "Valor do Chargeback",
  "Bandeira",
  "Valor taxa",
  "Transportadora",
  "Número do Rastreio",
  "Data de envio para o cliente",
  "Retorno de aprovação",
  "ID interno",
  "Motivo de recusa",
  "Obs",
  "Ação",
  "Aprovação por quem?",
];

const generatedColumns = [
  "Classificação IA",
  "Risco",
  "Pendências",
  "Próxima ação",
  "Status prazo",
  "Data análise",
  "Origem classificação",
];

const allColumns = [...originalColumns, ...generatedColumns];

const headerToField = {
  "NSU": "nsu",
  "Data da Transação": "dataTransacao",
  "Data Abertura de Chargeback": "dataAberturaChargeback",
  "Prazo de contestação": "prazoContestacao",
  "Valor do Chargeback": "valorChargeback",
  "Bandeira": "bandeira",
  "Valor taxa": "valorTaxa",
  "Transportadora": "transportadora",
  "Número do Rastreio": "numeroRastreio",
  "Data de envio para o cliente": "dataEnvioCliente",
  "Retorno de aprovação": "retornoAprovacao",
  "ID interno": "idInterno",
  "Motivo de recusa": "motivoRecusa",
  "Obs": "obs",
  "Ação": "acao",
  "Aprovação por quem?": "aprovacaoPorQuem",
  "Classificação IA": "classificacaoIa",
  "Risco": "risco",
  "Pendências": "pendencias",
  "Próxima ação": "proximaAcao",
  "Status prazo": "statusPrazo",
  "Data análise": "dataAnalise",
  "Origem classificação": "origemClassificacao",
};

const fieldToHeader = Object.fromEntries(Object.entries(headerToField).map(([header, field]) => [field, header]));

const aliases = {
  nsu: ["nsu", "numero nsu", "codigo nsu"],
  dataTransacao: ["data da transacao", "data transacao", "dt transacao", "data compra"],
  dataAberturaChargeback: ["data abertura de chargeback", "data de abertura de chargeback", "abertura chargeback", "data abertura contestacao"],
  prazoContestacao: ["prazo de contestacao", "prazo contestacao", "data limite", "limite contestacao", "vencimento contestacao"],
  valorChargeback: ["valor do chargeback", "valor chargeback", "valor contestado", "valor da contestacao"],
  bandeira: ["bandeira", "cartao bandeira", "bandeira cartao"],
  valorTaxa: ["valor taxa", "valor da taxa", "taxa", "fee"],
  transportadora: ["transportadora", "logistica", "carrier"],
  numeroRastreio: ["numero do rastreio", "rastreio", "codigo rastreio", "cod rastreio", "tracking", "tracking number"],
  dataEnvioCliente: ["data de envio para o cliente", "data envio cliente", "data envio", "envio cliente", "data postagem"],
  retornoAprovacao: ["retorno de aprovacao", "aprovacao", "retorno", "status aprovacao"],
  idInterno: ["id interno", "id", "pedido", "id pedido"],
  motivoRecusa: ["motivo de recusa", "motivo recusa", "recusa", "motivo"],
  obs: ["obs", "observacao", "observacoes", "comentario"],
  acao: ["acao", "tratativa"],
  aprovacaoPorQuem: ["aprovacao por quem", "responsavel", "aprovador"],
  classificacaoIa: ["classificacao ia", "classificacao"],
  risco: ["risco"],
  pendencias: ["pendencias"],
  proximaAcao: ["proxima acao", "acao recomendada"],
  statusPrazo: ["status prazo", "status do prazo"],
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
  "Encerrar caso",
];

const editableFields = new Set([
  "retornoAprovacao",
  "motivoRecusa",
  "obs",
  "acao",
  "aprovacaoPorQuem",
  "classificacaoIa",
  "risco",
  "proximaAcao",
]);

const state = {
  rows: [],
  selectedId: null,
  filters: {
    bandeira: "",
    transportadora: "",
    retornoAprovacao: "",
    classificacaoIa: "",
    risco: "",
    statusPrazo: "",
  },
};

const els = {
  fileInput: document.getElementById("fileInput"),
  classifyButton: document.getElementById("classifyButton"),
  exportXlsxButton: document.getElementById("exportXlsxButton"),
  exportCsvButton: document.getElementById("exportCsvButton"),
  clearFiltersButton: document.getElementById("clearFiltersButton"),
  summaryCards: document.getElementById("summaryCards"),
  table: document.getElementById("chargebackTable"),
  tableWrap: document.getElementById("tableWrap"),
  emptyState: document.getElementById("emptyState"),
  toast: document.getElementById("toast"),
  drawer: document.getElementById("drawer"),
  drawerTitle: document.getElementById("drawerTitle"),
  drawerSubtitle: document.getElementById("drawerSubtitle"),
  drawerClassification: document.getElementById("drawerClassification"),
  drawerRisk: document.getElementById("drawerRisk"),
  drawerDeadline: document.getElementById("drawerDeadline"),
  drawerDetails: document.getElementById("drawerDetails"),
  drawerChecklist: document.getElementById("drawerChecklist"),
  drawerPendencies: document.getElementById("drawerPendencies"),
  drawerEvidence: document.getElementById("drawerEvidence"),
  drawerAction: document.getElementById("drawerAction"),
  drawerObs: document.getElementById("drawerObs"),
  drawerResponsible: document.getElementById("drawerResponsible"),
};

const filterElements = {
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

function normalizeRecord(raw) {
  const record = { id: crypto.randomUUID() };
  for (const [header, value] of Object.entries(raw)) {
    const field = fieldForHeader(header);
    if (field) record[field] = value;
  }
  ["valorChargeback", "valorTaxa"].forEach((field) => {
    if (field in record) record[field] = parseMoney(record[field]);
  });
  ["dataTransacao", "dataAberturaChargeback", "prazoContestacao", "dataEnvioCliente", "dataAnalise"].forEach((field) => {
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
    dataAnalise: new Date(),
    origemClassificacao: "Automática - regras locais",
  };
}

function classifyAll() {
  state.rows = state.rows.map(classifyRow);
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
    state.rows = records.map(classifyRow);
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
  return state.rows.filter((row) => {
    return Object.entries(state.filters).every(([field, value]) => !value || String(row[field] ?? "") === value);
  });
}

function updateFilterOptions() {
  for (const [field, select] of Object.entries(filterElements)) {
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
  const rows = state.rows;
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
  if (!state.rows.length) {
    els.table.innerHTML = "";
    return;
  }

  const headerHtml = allColumns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
  const bodyHtml = rows
    .map((row) => {
      const cells = allColumns
        .map((column) => {
          const field = headerToField[column];
          const value = displayValue(field, row[field]);
          const editable = editableFields.has(field) ? ' contenteditable="true"' : "";
          const badge = badgeClass(field, row[field]);
          const content = badge ? `<span class="badge ${badge}">${escapeHtml(value)}</span>` : escapeHtml(value);
          return `<td data-id="${row.id}" data-field="${field}"${editable}>${content}</td>`;
        })
        .join("");
      return `<tr data-id="${row.id}">${cells}</tr>`;
    })
    .join("");
  els.table.innerHTML = `<thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody>`;
}

function displayValue(field, value) {
  if (["dataTransacao", "dataAberturaChargeback", "prazoContestacao", "dataEnvioCliente", "dataAnalise"].includes(field)) return formatDate(value);
  if (["valorChargeback", "valorTaxa"].includes(field)) return formatCurrency(value);
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

function updateCell(id, field, value) {
  const row = state.rows.find((item) => item.id === id);
  if (!row) return;
  row[field] = value;
  updateFilterOptions();
  render();
}

function openDrawer(id) {
  state.selectedId = id;
  renderDrawer();
  els.drawer.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  state.selectedId = null;
  els.drawer.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
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
    ["ID interno", row.idInterno],
    ["Data da transação", formatDate(row.dataTransacao)],
    ["Abertura chargeback", formatDate(row.dataAberturaChargeback)],
    ["Prazo contestação", formatDate(row.prazoContestacao)],
    ["Valor chargeback", formatCurrency(row.valorChargeback)],
    ["Bandeira", row.bandeira],
    ["Transportadora", row.transportadora],
    ["Número do rastreio", row.numeroRastreio],
    ["Data envio cliente", formatDate(row.dataEnvioCliente)],
    ["Retorno aprovação", row.retornoAprovacao],
    ["Motivo de recusa", row.motivoRecusa],
    ["Risco de perda", row.risco],
  ];
  els.drawerDetails.innerHTML = details.map(([label, value]) => `<dt>${label}</dt><dd>${escapeHtml(value || "")}</dd>`).join("");

  els.drawerChecklist.innerHTML = checklist(row)
    .map((item) => `<div class="check-item"><div><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.detail)}</small></div><span class="badge ${item.ok ? "badge-green" : "badge-red"}">${item.ok ? "Sim" : "Não"}</span></div>`)
    .join("");

  const pendencies = String(row.pendencias || "").split(";").map((item) => item.trim()).filter(Boolean);
  els.drawerPendencies.innerHTML = pendencies.length ? pendencies.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>Nenhuma pendência encontrada.</li>";
  els.drawerEvidence.innerHTML = evidenceList(row).map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  els.drawerAction.innerHTML = nextActions.map((action) => `<option value="${escapeHtml(action)}">${escapeHtml(action)}</option>`).join("");
  els.drawerAction.value = row.proximaAcao || nextActions[0];
  els.drawerObs.value = row.obs || "";
  els.drawerResponsible.value = row.aprovacaoPorQuem || "";
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

function evidenceList(row) {
  const evidence = ["Comprovante da transação", "Pedido/ID interno validado no OMS"];
  if (!hasValue(row.numeroRastreio)) evidence.push("Número de rastreio");
  if (!hasValue(row.transportadora)) evidence.push("Confirmação da transportadora");
  if (!hasValue(row.dataEnvioCliente)) evidence.push("Data/comprovante de envio ao cliente");
  if (row.classificacaoIa === "Fraude") evidence.push("Documentação de defesa contra fraude");
  if (row.classificacaoIa === "Taxa/Bandeira") evidence.push("Conferência financeira de taxa/bandeira");
  return evidence;
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
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
els.classifyButton.addEventListener("click", classifyAll);
els.exportXlsxButton.addEventListener("click", () => exportRows("xlsx"));
els.exportCsvButton.addEventListener("click", () => exportRows("csv"));
els.clearFiltersButton.addEventListener("click", () => {
  Object.keys(state.filters).forEach((key) => {
    state.filters[key] = "";
    filterElements[key].value = "";
  });
  renderTable();
});

for (const [field, select] of Object.entries(filterElements)) {
  select.addEventListener("change", () => {
    state.filters[field] = select.value;
    renderTable();
  });
}

els.table.addEventListener("click", (event) => {
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
els.drawerObs.addEventListener("change", () => {
  if (state.selectedId) updateCell(state.selectedId, "obs", els.drawerObs.value);
});
els.drawerResponsible.addEventListener("change", () => {
  if (state.selectedId) updateCell(state.selectedId, "aprovacaoPorQuem", els.drawerResponsible.value);
});

updateFilterOptions();
render();
