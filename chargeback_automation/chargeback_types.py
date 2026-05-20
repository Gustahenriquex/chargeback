from __future__ import annotations

from dataclasses import dataclass
from typing import Any


DEFAULT_WORKBOOK_PATH = (
    r"C:\Users\gustavopereira\OneDrive - CTC FRANCHISING S A"
    r"\Área de Trabalho\Cópia de Chargeback.xlsx"
)

ORIGINAL_COLUMNS = [
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
]

GENERATED_COLUMNS = [
    "Classificação IA",
    "Risco",
    "Pendências",
    "Próxima ação",
    "Status prazo",
    "Data análise",
    "Origem classificação",
]

FIELD_TO_HEADER = {
    "nsu": "NSU",
    "data_transacao": "Data da Transação",
    "data_abertura_chargeback": "Data Abertura de Chargeback",
    "prazo_contestacao": "Prazo de contestação",
    "valor_chargeback": "Valor do Chargeback",
    "bandeira": "Bandeira",
    "valor_taxa": "Valor taxa",
    "transportadora": "Transportadora",
    "numero_rastreio": "Número do Rastreio",
    "data_envio_cliente": "Data de envio para o cliente",
    "retorno_aprovacao": "Retorno de aprovação",
    "id_interno": "ID interno",
    "motivo_recusa": "Motivo de recusa",
    "obs": "Obs",
    "acao": "Ação",
    "aprovacao_por_quem": "Aprovação por quem?",
    "classificacao_ia": "Classificação IA",
    "risco": "Risco",
    "pendencias": "Pendências",
    "proxima_acao": "Próxima ação",
    "status_prazo": "Status prazo",
    "data_analise": "Data análise",
    "origem_classificacao": "Origem classificação",
}

HEADER_TO_FIELD = {header: field for field, header in FIELD_TO_HEADER.items()}

CLASSIFICATIONS = [
    "Fraude",
    "Compensação",
    "Questionamento",
    "Experiência do Cliente",
    "Automação",
    "Transportadora",
    "Documento Pendente",
    "Taxa/Bandeira",
    "Sem Classificação",
]

RISKS = ["Baixo", "Médio", "Alto"]

DEADLINE_STATUSES = [
    "Dentro do prazo",
    "Próximo do vencimento",
    "Vencido",
    "Sem prazo informado",
]

NEXT_ACTIONS = [
    "Enviar documentação de defesa",
    "Solicitar comprovante de entrega",
    "Cobrar retorno da transportadora",
    "Validar pedido no OMS",
    "Encaminhar para financeiro",
    "Revisar motivo de recusa",
    "Aguardar retorno da adquirente",
    "Encerrar caso",
]

EDITABLE_FIELDS = [
    "retorno_aprovacao",
    "motivo_recusa",
    "obs",
    "acao",
    "aprovacao_por_quem",
    "classificacao_ia",
    "risco",
    "proxima_acao",
]


@dataclass(slots=True)
class AnalysisResult:
    classificacao_ia: str
    risco: str
    pendencias: str
    proxima_acao: str
    status_prazo: str
    data_analise: Any
    origem_classificacao: str = "Automática - regras locais"

    def as_record(self) -> dict[str, Any]:
        return {
            "classificacao_ia": self.classificacao_ia,
            "risco": self.risco,
            "pendencias": self.pendencias,
            "proxima_acao": self.proxima_acao,
            "status_prazo": self.status_prazo,
            "data_analise": self.data_analise,
            "origem_classificacao": self.origem_classificacao,
        }
