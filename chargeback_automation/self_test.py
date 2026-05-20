from __future__ import annotations

from datetime import date, timedelta

from .classifier import classify_record


def assert_equal(actual, expected, label: str) -> None:
    if actual != expected:
        raise AssertionError(f"{label}: esperado {expected!r}, obtido {actual!r}")


def assert_contains(actual: str, expected: str, label: str) -> None:
    if expected not in actual:
        raise AssertionError(f"{label}: esperado conter {expected!r}, obtido {actual!r}")


def run() -> None:
    today = date(2026, 5, 20)

    without_tracking = classify_record({"data_envio_cliente": today}, today=today)
    assert_contains(without_tracking.pendencias, "Sem rastreio informado", "linha sem rastreio")

    expired = classify_record({"prazo_contestacao": today - timedelta(days=1)}, today=today)
    assert_equal(expired.risco, "Alto", "prazo vencido risco")
    assert_equal(expired.status_prazo, "Vencido", "prazo vencido status")

    fraud = classify_record({"obs": "cliente desconhece a compra, possível fraude"}, today=today)
    assert_equal(fraud.classificacao_ia, "Fraude", "obs fraude")

    compensation = classify_record({"obs": "solicitar estorno e ajuste financeiro"}, today=today)
    assert_equal(compensation.classificacao_ia, "Compensação", "obs estorno")

    logistics = classify_record(
        {
            "numero_rastreio": "BR123",
            "transportadora": "Correios",
            "data_envio_cliente": today,
            "prazo_contestacao": today + timedelta(days=10),
        },
        today=today,
    )
    assert_equal(logistics.risco, "Baixo", "evidencia logistica completa")
    assert_equal(logistics.pendencias, "", "sem pendencias logisticas")

    no_deadline = classify_record({}, today=today)
    assert_equal(no_deadline.status_prazo, "Sem prazo informado", "sem prazo")

    print("Todos os testes de classificação passaram.")


if __name__ == "__main__":
    run()
