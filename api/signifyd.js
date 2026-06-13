function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function env(name) {
  return process.env[name] || "";
}

function normalizeEndpoint(value) {
  return value === "representments" ? "representments" : "chargebacks";
}

function endpointUrl(endpoint) {
  if (endpoint === "representments") {
    return "https://api.signifyd.com/v3/orders/events/chargebacks/representments/outcomes";
  }
  return "https://api.signifyd.com/v3/orders/events/chargebacks";
}

function authHeader(username, password) {
  return `Basic ${Buffer.from(`${username || ""}:${password || ""}`).toString("base64")}`;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

async function proxySignifyd({ endpoint, username, password, teamId, payload }) {
  const url = endpointUrl(normalizeEndpoint(endpoint));
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: authHeader(username, password),
  };
  const effectiveTeamId = String(teamId || env("SIGNIFYD_TEAM_ID") || "").trim();
  if (effectiveTeamId) headers["SIGNIFYD-TEAM-ID"] = effectiveTeamId;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload || {}),
  });
  const text = await response.text();
  let body = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return {
    ok: response.ok,
    status: response.status,
    endpoint: url,
    body,
  };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Método não permitido." });
  }

  try {
    const body = await parseBody(req);
    const username = String(body.username || "").trim();
    if (!username) {
      return sendJson(res, 400, { error: "Informe a username/API key da Signifyd." });
    }

    const result = await proxySignifyd({
      endpoint: body.endpoint,
      username,
      password: body.password || "",
      teamId: body.teamId || "",
      payload: body.payload,
    });
    return sendJson(res, result.status, result);
  } catch (error) {
    return sendJson(res, error.status || 500, {
      error: "Falha ao enviar para a Signifyd.",
      details: error.message || String(error),
    });
  }
};
