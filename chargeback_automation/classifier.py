from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any

from .chargeback_types import AnalysisResult
from .parser import is_blank, normalize_text, parse_date


FRAUD_TERMS = [
    "fraude",
    "cliente desconhece",
    "compra nao reconhecida",
    "compra não reconhecida",
    "chargeback indevido",
]

COMPENSATION_TERMS = ["reembolso", "estorno", "compensacao", "compensação", "ajuste financeiro"]

QUESTION_TERMS = ["duvida", "dúvida", "questionamento", "validar", "analisar"]

TRANSPORT_TERMS = [
    "transportadora",
    "rastreio",
    "envio",
    "entrega",
    "extravio",
    "atraso",
    "postagem",
    "logistica",
    "logística",
]

FINANCIAL_TERMS = [
    "financeiro",
    "taxa",
    "bandeira",
    "adquirente",
    "tarifa",
    "fee",
    "valor divergente",
]


def has_value(value: Any) -> bool:
    return not is_blank(value)


def as_date(value: Any) -> date | None:
    parsed = parse_date(value)
    if isinstance(parsed, datetime):
        return parsed.date()
    if isinstance(parsed, date):
        return parsed
    return None


def text_blob(record: dict[str, Any]) -> str:
    fields = ["obs", "motivo_recusa", "acao", "retorno_aprovacao"]
    return " ".join(normalize_text(record.get(field)) for field in fields if has_value(record.get(field)))


def contains_any(text: str, terms: list[str]) -> bool:
    normalized_terms = [normalize_text(term) for term in terms]
    return any(term in text for term in normalized_terms)


def deadline_status(value: Any, today: date, near_days: int) -> str:
    deadline = as_date(value)
    if deadline is None:
        return "Sem prazo informado"
    if deadline < today:
        return "Vencido"
    if deadline <= today + timedelta(days=near_days):
        return "Próximo do vencimento"
    return "Dentro do prazo"


def classify_category(record: dict[str, Any]) -> str:
    blob = text_blob(record)
    if contains_any(blob, FRAUD_TERMS):
        return "Fraude"
    if contains_any(blob, COMPENSATION_TERMS):
        return "Compensação"
    if contains_any(blob, QUESTION_TERMS):
        return "Questionamento"
    if contains_any(blob, TRANSPORT_TERMS):
        return "Transportadora"

    has_financial_signal = has_value(record.get("bandeira")) or has_value(record.get("valor_taxa"))
    if has_financial_signal and contains_any(blob, FINANCIAL_TERMS):
        return "Taxa/Bandeira"
    return "Sem Classificação"


def next_action(record: dict[str, Any], classification: str, pending: list[str], status: str) -> str:
    if has_value(record.get("motivo_recusa")):
        return "Revisar motivo de recusa"
    if "Sem data de envio" in pending or "Sem rastreio informado" in pending:
        return "Solicitar comprovante de entrega"
    if "Transportadora não informada" in pending:
        return "Validar pedido no OMS"
    if classification == "Fraude":
        return "Enviar documentação de defesa"
    if classification in {"Compensação", "Taxa/Bandeira"}:
        return "Encaminhar para financeiro"
    if classification == "Questionamento":
        return "Validar pedido no OMS"
    if classification == "Transportadora":
        return "Cobrar retorno da transportadora"
    if status == "Vencido":
        return "Encerrar caso"
    return "Aguardar retorno da adquirente"


def classify_record(
    record: dict[str, Any],
    today: date | None = None,
    near_days: int = 5,
) -> AnalysisResult:
    today = today or date.today()
    status = deadline_status(record.get("prazo_contestacao"), today=today, near_days=near_days)
    pending: list[str] = []

    if not has_value(record.get("numero_rastreio")):
        pending.append("Sem rastreio informado")
    if not has_value(record.get("data_envio_cliente")):
        pending.append("Sem data de envio")
    if not has_value(record.get("transportadora")):
        pending.append("Transportadora não informada")

    logistics_complete = all(
        has_value(record.get(field))
        for field in ("numero_rastreio", "transportadora", "data_envio_cliente")
    )

    risk = "Médio"
    if logistics_complete:
        risk = "Baixo"
    if status == "Vencido" or not has_value(record.get("data_envio_cliente")):
        risk = "Alto"
    if has_value(record.get("motivo_recusa")) and risk == "Baixo":
        risk = "Médio"

    classification = classify_category(record)
    action = next_action(record, classification, pending, status)

    return AnalysisResult(
        classificacao_ia=classification,
        risco=risk,
        pendencias="; ".join(pending),
        proxima_acao=action,
        status_prazo=status,
        data_analise=today,
    )


def checklist_for_record(
    record: dict[str, Any],
    analysis: AnalysisResult,
    today: date | None = None,
) -> list[tuple[str, str, str]]:
    today = today or date.today()
    deadline = as_date(record.get("prazo_contestacao"))
    deadline_valid = deadline is not None and deadline >= today
    items = [
        ("NSU preenchido?", has_value(record.get("nsu")), "Obrigatório para localização do caso."),
        (
            "Data da transação preenchida?",
            has_value(record.get("data_transacao")),
            "Ajuda a reconciliar pedido, adquirente e OMS.",
        ),
        (
            "Data de abertura do chargeback preenchida?",
            has_value(record.get("data_abertura_chargeback")),
            "Necessária para medir SLA de contestação.",
        ),
        (
            "Prazo de contestação preenchido?",
            deadline is not None,
            "Sem prazo, o caso deve ser priorizado manualmente.",
        ),
        ("Prazo ainda válido?", deadline_valid, analysis.status_prazo),
        (
            "Valor do chargeback preenchido?",
            has_value(record.get("valor_chargeback")),
            "Necessário para relatório financeiro.",
        ),
        ("Bandeira preenchida?", has_value(record.get("bandeira")), "Apoia tratativa com adquirente."),
        ("Valor taxa preenchido?", has_value(record.get("valor_taxa")), "Apoia conferência financeira."),
        (
            "Transportadora preenchida?",
            has_value(record.get("transportadora")),
            "Evidência logística incompleta sem transportadora.",
        ),
        (
            "Número de rastreio preenchido?",
            has_value(record.get("numero_rastreio")),
            "Evidência logística incompleta sem rastreio.",
        ),
        (
            "Data de envio ao cliente preenchida?",
            has_value(record.get("data_envio_cliente")),
            "Sem envio, o risco de perda sobe.",
        ),
        (
            "Retorno de aprovação preenchido?",
            has_value(record.get("retorno_aprovacao")),
            "Indica andamento com adquirente/área responsável.",
        ),
        (
            "Motivo de recusa preenchido, se aplicável?",
            True,
            "Preencher quando houver recusa ou divergência.",
        ),
        ("Ação definida?", has_value(record.get("acao")), analysis.proxima_acao),
        (
            "Responsável definido?",
            has_value(record.get("aprovacao_por_quem")),
            "Responsável/aprovador pendente quando vazio.",
        ),
    ]
    return [(label, "Sim" if ok else "Não", detail) for label, ok, detail in items]
