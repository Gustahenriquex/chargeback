from __future__ import annotations

import os
import smtplib
from email.message import EmailMessage
from pathlib import Path
from typing import Iterable


def split_addresses(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip() for item in value.replace(";", ",").split(",") if item.strip()]


def build_email_message(
    attachments: Iterable[Path],
    subject: str,
    body: str,
    to_addresses: list[str],
    cc_addresses: list[str] | None = None,
    sender: str | None = None,
) -> EmailMessage:
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = sender or os.getenv("SMTP_FROM") or os.getenv("SMTP_USER") or ""
    message["To"] = ", ".join(to_addresses)
    if cc_addresses:
        message["Cc"] = ", ".join(cc_addresses)
    message.set_content(body)

    for attachment in attachments:
        data = attachment.read_bytes()
        maintype = "application"
        subtype = "octet-stream"
        if attachment.suffix.lower() == ".xlsx":
            subtype = "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        elif attachment.suffix.lower() == ".csv":
            maintype = "text"
            subtype = "csv"
        message.add_attachment(
            data,
            maintype=maintype,
            subtype=subtype,
            filename=attachment.name,
        )
    return message


def create_email_draft(
    attachments: Iterable[Path],
    output_dir: Path,
    subject: str,
    body: str,
) -> Path:
    to_addresses = split_addresses(os.getenv("CHARGEBACK_EMAIL_TO"))
    cc_addresses = split_addresses(os.getenv("CHARGEBACK_EMAIL_CC"))
    message = build_email_message(
        attachments=attachments,
        subject=subject,
        body=body,
        to_addresses=to_addresses,
        cc_addresses=cc_addresses,
    )
    output_dir.mkdir(parents=True, exist_ok=True)
    draft_path = output_dir / "chargeback_checklist_email.eml"
    draft_path.write_bytes(bytes(message))
    return draft_path


def send_email(attachments: Iterable[Path], subject: str, body: str) -> str:
    host = os.getenv("SMTP_HOST")
    user = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASSWORD")
    sender = os.getenv("SMTP_FROM") or user
    to_addresses = split_addresses(os.getenv("CHARGEBACK_EMAIL_TO"))
    cc_addresses = split_addresses(os.getenv("CHARGEBACK_EMAIL_CC"))
    if not host or not sender or not to_addresses:
        return (
            "Envio não executado: configure SMTP_HOST, SMTP_FROM/SMTP_USER "
            "e CHARGEBACK_EMAIL_TO."
        )

    port = int(os.getenv("SMTP_PORT", "587"))
    use_tls = os.getenv("SMTP_USE_TLS", "1") not in {"0", "false", "False"}
    message = build_email_message(
        attachments=attachments,
        subject=subject,
        body=body,
        to_addresses=to_addresses,
        cc_addresses=cc_addresses,
        sender=sender,
    )
    recipients = to_addresses + cc_addresses
    with smtplib.SMTP(host, port, timeout=60) as smtp:
        if use_tls:
            smtp.starttls()
        if user and password:
            smtp.login(user, password)
        smtp.send_message(message, from_addr=sender, to_addrs=recipients)
    return f"E-mail enviado para {', '.join(to_addresses)}."
