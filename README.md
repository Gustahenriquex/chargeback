# Checklist Chargeback & Contestação

Automação local para alimentar a planilha:

`C:\Users\gustavopereira\OneDrive - CTC FRANCHISING S A\Área de Trabalho\Cópia de Chargeback.xlsx`

Ela importa CSV/XLSX opcional, classifica os casos, adiciona as colunas de análise, cria abas de resumo e checklist, aplica filtros/cores no Excel e exporta o relatório final.

## Versão Web para Vercel

O projeto também tem uma versão web estática pronta para Vercel:

- `index.html`
- `styles.css`
- `app.js`
- `vercel.json`

Na Vercel, o navegador não consegue acessar automaticamente o arquivo local do OneDrive. Por isso, a versão web funciona com upload de CSV/XLSX, classificação em memória, edição inline, filtros, painel lateral do caso e exportação CSV/XLSX.

Para publicar:

1. Suba este repositório para o GitHub.
2. Na Vercel, escolha `Add New Project`.
3. Importe o repositório.
4. Use as configurações padrão. Não precisa de build command.
5. Publique.

Se usar Vercel CLI:

```powershell
vercel
vercel --prod
```

## Como rodar

1. Feche a planilha no Excel antes de executar.
2. Clique em `run_chargeback_automation.cmd`.
3. O resultado fica na própria planilha e na pasta `exports`.

Para importar um arquivo antes de classificar:

```powershell
.\run_chargeback_automation.cmd --import-file "C:\caminho\arquivo.csv"
```

Para enviar e-mail automaticamente, preencha variáveis de ambiente com base no `config.example.env` e rode com:

```powershell
.\run_chargeback_automation.cmd --send-email
```

Sem SMTP configurado, a automação cria um arquivo `.eml` na pasta `exports`, pronto para abrir e enviar manualmente.

## Agendamento mensal

Para agendar todo dia 1 às 08:00 no Windows Task Scheduler:

```powershell
powershell -ExecutionPolicy Bypass -File .\instalar_agendamento_mensal.ps1
```

## Executável .exe

Para gerar um `.exe` com PyInstaller:

```powershell
powershell -ExecutionPolicy Bypass -File .\build_exe.ps1
```

O arquivo será criado em `dist\ChargebackChecklist.exe`.

## Instalação das dependências

Se for rodar pelo `.cmd` em vez do `.exe`, instale as dependências uma vez:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-automation.txt
```

## Validação

```powershell
python -m chargeback_automation.self_test
```

Os testes cobrem:

- linha sem rastreio;
- prazo vencido;
- obs com fraude;
- obs com estorno;
- evidência logística completa;
- linha sem prazo.

## Observações

- Não há banco no diretório atual. A migration pronta para Supabase/Postgres está em `database/chargeback_checklist.sql`.
- A regra "Próximo do vencimento" considera 5 dias por padrão. Altere com `--near-days`.
- A automação não usa chaves de API nem dados reais hardcoded.
