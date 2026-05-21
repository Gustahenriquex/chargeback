const DAY_MS = 24 * 60 * 60 * 1000;

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function env(name) {
  return process.env[name] || "";
}

function vtexBaseUrl() {
  const account = env("VTEX_ACCOUNT");
  const environment = env("VTEX_ENVIRONMENT") || "vtexcommercestable";
  if (!account) return "";
  if (environment.includes(".")) {
    return `https://${account}.${environment}`;
  }
  return `https://${account}.${environment}.com.br`;
}

function authHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-VTEX-API-AppKey": env("VTEX_APP_KEY"),
    "X-VTEX-API-AppToken": env("VTEX_APP_TOKEN"),
  };
}

async function vtexFetch(path) {
  const response = await fetch(`${vtexBaseUrl()}${path}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }
  if (!response.ok) {
    const error = new Error(`VTEX retornou HTTP ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body;
}

async function getOrderById(orderId) {
  return vtexFetch(`/api/oms/pvt/orders/${encodeURIComponent(orderId)}`);
}

async function searchOrder(term) {
  const list = await vtexFetch(`/api/oms/pvt/orders?q=${encodeURIComponent(term)}&per_page=5&page=1`);
  const first = list?.list?.[0] || list?.orders?.[0] || list?.items?.[0];
  const orderId = first?.orderId || first?.id || first?.sequence;
  if (!orderId) return null;
  return getOrderById(orderId);
}

async function resolveOrder(term) {
  const candidates = [term];
  if (!term.includes("-")) candidates.push(`${term}-01`);
  for (const candidate of candidates) {
    try {
      return await getOrderById(candidate);
    } catch (error) {
      if (![400, 404].includes(error.status)) throw error;
    }
  }
  return searchOrder(term);
}

function firstValidDate(...values) {
  for (const value of values) {
    if (!value) continue;
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
}

function addDays(date, days) {
  if (!date) return null;
  return new Date(date.getTime() + days * DAY_MS);
}

function isoDate(date) {
  return date ? date.toISOString().slice(0, 10) : "";
}

function asCurrencyNumber(cents) {
  return typeof cents === "number" ? cents / 100 : "";
}

function moneyFromCents(cents) {
  return typeof cents === "number" ? cents / 100 : "";
}

function getPackages(order) {
  return Array.isArray(order?.packageAttachment?.packages)
    ? order.packageAttachment.packages
    : [];
}

function getLogisticsInfo(order) {
  return Array.isArray(order?.shippingData?.logisticsInfo)
    ? order.shippingData.logisticsInfo
    : [];
}

function firstNonEmpty(...values) {
  return values.find((value) => value !== null && value !== undefined && String(value).trim() !== "") || "";
}

function findDeepValue(input, keyRegex) {
  const seen = new Set();
  const stack = [input];
  while (stack.length) {
    const current = stack.pop();
    if (!current || typeof current !== "object" || seen.has(current)) continue;
    seen.add(current);
    for (const [key, value] of Object.entries(current)) {
      if (keyRegex.test(key) && value !== null && value !== undefined && String(value).trim() !== "") {
        return value;
      }
      if (value && typeof value === "object") stack.push(value);
    }
  }
  return "";
}

function extractPayment(order) {
  const transaction = order?.paymentData?.transactions?.[0] || {};
  const payment = transaction?.payments?.[0] || {};
  return {
    bandeira: firstNonEmpty(payment.paymentSystemName, payment.group, payment.paymentSystem),
    nsu: firstNonEmpty(
      payment.nsu,
      payment.connectorResponses?.nsu,
      payment.connectorResponses?.NSU,
      transaction.nsu,
      findDeepValue(order?.paymentData, /^nsu$/i)
    ),
    tid: firstNonEmpty(payment.tid, payment.connectorResponses?.tid, findDeepValue(order?.paymentData, /^tid$/i)),
  };
}

function summarizeItems(order) {
  return Array.isArray(order?.items)
    ? order.items.map((item) => ({
        id: item.id || "",
        refId: item.refId || "",
        name: item.name || "",
        skuName: item.skuName || "",
        quantity: item.quantity || 0,
        sellingPrice: moneyFromCents(item.sellingPrice),
        listPrice: moneyFromCents(item.listPrice),
        imageUrl: item.imageUrl || "",
      }))
    : [];
}

function summarizeClient(order) {
  const client = order?.clientProfileData || {};
  return {
    name: [client.firstName, client.lastName].filter(Boolean).join(" "),
    email: client.email || "",
    document: client.document || "",
    phone: client.phone || "",
    corporateName: client.corporateName || "",
  };
}

function summarizeAddress(order) {
  const address = order?.shippingData?.address || {};
  return {
    receiverName: address.receiverName || "",
    street: address.street || "",
    number: address.number || "",
    complement: address.complement || "",
    neighborhood: address.neighborhood || "",
    city: address.city || "",
    state: address.state || "",
    postalCode: address.postalCode || "",
    country: address.country || "",
  };
}

function summarizePayment(order) {
  const transaction = order?.paymentData?.transactions?.[0] || {};
  const payment = transaction?.payments?.[0] || {};
  return {
    paymentSystemName: payment.paymentSystemName || "",
    group: payment.group || "",
    installments: payment.installments || "",
    value: moneyFromCents(payment.value),
    tid: firstNonEmpty(payment.tid, payment.connectorResponses?.tid),
    nsu: firstNonEmpty(payment.nsu, payment.connectorResponses?.nsu, payment.connectorResponses?.NSU),
  };
}

function summarizeTotals(order) {
  return Array.isArray(order?.totals)
    ? order.totals.map((total) => ({
        id: total.id || "",
        name: total.name || "",
        value: moneyFromCents(total.value),
      }))
    : [];
}

function summarizeSellers(order) {
  return Array.isArray(order?.sellers)
    ? order.sellers.map((seller) => ({
        id: seller.id || "",
        name: seller.name || "",
      }))
    : [];
}

function extractShipping(order) {
  const packages = getPackages(order);
  const firstPackage = packages[0] || {};
  const logistics = getLogisticsInfo(order);
  const deliveryId = logistics.flatMap((item) => item.deliveryIds || [])[0] || {};
  return {
    transportadora: firstNonEmpty(
      firstPackage.courier,
      firstPackage.courierName,
      firstPackage.carrier,
      deliveryId.courierName,
      logistics[0]?.selectedSla
    ),
    numeroRastreio: firstNonEmpty(
      firstPackage.trackingNumber,
      firstPackage.trackingUrl,
      deliveryId.trackingNumber,
      findDeepValue(order?.packageAttachment, /tracking(number)?/i)
    ),
  };
}

function normalizeOrder(order, lookup) {
  const packages = getPackages(order);
  const firstPackage = packages[0] || {};
  const invoiceDate = firstValidDate(
    order?.invoicedDate,
    firstPackage.issuanceDate,
    firstPackage.invoiceDate,
    order?.invoiceData?.issuanceDate,
    order?.authorizedDate,
    order?.creationDate
  );
  const payment = extractPayment(order);
  const shipping = extractShipping(order);
  const deadline = addDays(invoiceDate, 10);
  const account = env("VTEX_ACCOUNT");
  const orderId = firstNonEmpty(order?.orderId, order?.sellerOrderId, order?.sequence);
  return {
    lookup,
    nsu: payment.nsu || lookup,
    idInterno: orderId,
    prazoContestacao: isoDate(deadline),
    dataFaturamento: isoDate(invoiceDate),
    dataTransacao: isoDate(firstValidDate(order?.creationDate, order?.authorizedDate)),
    dataAberturaChargeback: "",
    valorChargeback: asCurrencyNumber(order?.value),
    bandeira: payment.bandeira,
    transportadora: shipping.transportadora,
    numeroRastreio: shipping.numeroRastreio,
    statusPedido: firstNonEmpty(order?.statusDescription, order?.status),
    retornoAprovacao: firstNonEmpty(order?.statusDescription, order?.status),
    obs: `Dados consultados na VTEX em ${new Date().toLocaleString("pt-BR")}.`,
    origemClassificacao: "VTEX + regras locais",
    adminOrderUrl: order?.orderId && account ? `https://${account}.myvtex.com/admin/orders/${order.orderId}` : "",
    customer: summarizeClient(order),
    address: summarizeAddress(order),
    payment: summarizePayment(order),
    items: summarizeItems(order),
    totals: summarizeTotals(order),
    sellers: summarizeSellers(order),
    raw: {
      order,
      extracted: {
        trackingSource: shipping.numeroRastreio,
        tid: payment.tid,
      },
    },
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Método não permitido." });
  }

  const missing = ["VTEX_ACCOUNT", "VTEX_APP_KEY", "VTEX_APP_TOKEN"].filter((name) => !env(name));
  if (missing.length) {
    return sendJson(res, 500, {
      error: `Configure as variáveis de ambiente na Vercel: ${missing.join(", ")}.`,
    });
  }

  const term = String(req.query?.orderId || req.query?.nsu || req.query?.q || "").trim();
  if (!term) {
    return sendJson(res, 400, { error: "Informe orderId, nsu ou q." });
  }

  try {
    const order = await resolveOrder(term);
    if (!order) {
      return sendJson(res, 404, { error: "Pedido não encontrado na VTEX." });
    }
    return sendJson(res, 200, normalizeOrder(order, term));
  } catch (error) {
    return sendJson(res, error.status || 500, {
      error: error.message || "Falha ao consultar VTEX.",
      detail: error.body || null,
    });
  }
};
