create table if not exists public.chargeback_checklist (
    id uuid primary key default gen_random_uuid(),
    nsu text,
    data_transacao date,
    data_abertura_chargeback date,
    prazo_contestacao date,
    valor_chargeback numeric,
    bandeira text,
    valor_taxa numeric,
    transportadora text,
    numero_rastreio text,
    data_envio_cliente date,
    retorno_aprovacao text,
    id_interno text,
    motivo_recusa text,
    obs text,
    acao text,
    aprovacao_por_quem text,
    classificacao_ia text,
    risco text,
    pendencias text,
    proxima_acao text,
    status_prazo text,
    status_vtex text,
    data_faturamento date,
    classification_source text,
    imported_file_name text,
    analyzed_at timestamp,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_chargeback_checklist_nsu
    on public.chargeback_checklist (nsu);

create index if not exists idx_chargeback_checklist_bandeira
    on public.chargeback_checklist (bandeira);

create index if not exists idx_chargeback_checklist_transportadora
    on public.chargeback_checklist (transportadora);

create index if not exists idx_chargeback_checklist_risco
    on public.chargeback_checklist (risco);

create index if not exists idx_chargeback_checklist_status_prazo
    on public.chargeback_checklist (status_prazo);

create index if not exists idx_chargeback_checklist_status_vtex
    on public.chargeback_checklist (status_vtex);

create index if not exists idx_chargeback_checklist_classificacao_ia
    on public.chargeback_checklist (classificacao_ia);

create index if not exists idx_chargeback_checklist_prazo_contestacao
    on public.chargeback_checklist (prazo_contestacao);
