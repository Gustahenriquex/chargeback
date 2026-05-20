from __future__ import annotations

import argparse
import sys
from datetime import date, datetime
from pathlib import Path

from .chargeback_types import DEFAULT_WORKBOOK_PATH
from .emailer import create_email_draft, send_email
from .excel_io import process_workbook
from .parser import parse_file


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Automação do Checklist Chargeback & Contestação."
    )
    parser.add_argument("--workbook", default=DEFAULT_WORKBOOK_PATH, help="Caminho da planilha base.")
    parser.add_argument("--sheet", default=None, help="Nome da aba base. Se vazio, detecta automaticamente.")
    parser.add_argument("--import-file", default=None, help="CSV/XLSX para importar antes da classificação.")
    parser.add_argument(
        "--export-format",
        choices=["xlsx", "csv", "both", "none"],
        default="both",
        help="Formato de exportação do relatório final.",
    )
    parser.add_argument("--output-dir", default="exports", help="Pasta de saída dos relatórios.")
    parser.add_argument("--near-days", type=int, default=5, help="Dias para considerar próximo do vencimento.")
    parser.add_argument("--today", default=None, help="Data de referência AAAA-MM-DD para testes.")
    parser.add_argument("--no-backup", action="store_true", help="Não criar backup antes de salvar.")
    parser.add_argument("--send-email", action="store_true", help="Enviar e-mail via SMTP configurado por ambiente.")
    parser.add_argument("--email-draft", action="store_true", help="Criar arquivo .eml para envio manual.")
    return parser.parse_args(argv)


def parse_today(value: str | None) -> date:
    if not value:
        return date.today()
    return datetime.strptime(value, "%Y-%m-%d").date()


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    workbook_path = Path(args.workbook)
    output_dir = Path(args.output_dir)
    today = parse_today(args.today)

    try:
        import_records = parse_file(args.import_file, sheet_name=args.sheet) if args.import_file else None
        result = process_workbook(
            workbook_path=workbook_path,
            import_records=import_records,
            output_dir=output_dir,
            sheet_name=args.sheet,
            export_format=args.export_format,
            backup=not args.no_backup,
            near_days=args.near_days,
            today=today,
        )
    except Exception as exc:
        print(f"ERRO: {exc}", file=sys.stderr)
        return 1

    print("Checklist Chargeback & Contestação concluído.")
    print(f"Planilha atualizada: {result['workbook']}")
    print(f"Aba base: {result['sheet']}")
    print(f"Casos analisados: {result['total']}")
    if result["backup"]:
        print(f"Backup criado: {result['backup']}")
    for export in result["exports"]:
        print(f"Exportado: {export}")

    attachments = [Path(path) for path in result["exports"]]
    subject = f"Checklist Chargeback & Contestação - {today.strftime('%d/%m/%Y')}"
    body = (
        "Olá,\n\n"
        "Segue relatório atualizado do Checklist Chargeback & Contestação.\n\n"
        f"Casos analisados: {result['total']}\n"
        "Relatório gerado automaticamente.\n"
    )
    if args.email_draft and attachments:
        draft = create_email_draft(attachments, output_dir=output_dir, subject=subject, body=body)
        print(f"Rascunho de e-mail criado: {draft}")
    if args.send_email and attachments:
        print(send_email(attachments, subject=subject, body=body))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
