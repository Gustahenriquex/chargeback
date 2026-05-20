# Checklist Chargeback & Contestacao

Aplicacao web para controle operacional de chargebacks/contestacoes, pronta para deploy na Vercel.

## Arquitetura

- `index.html`
- `styles.css`
- `app.js`
- `api/vtex-order.js`
- `vercel.json`

O app funciona com upload de CSV/XLSX, classificacao em memoria, edicao inline, filtros, painel lateral do caso e exportacao CSV/XLSX.

Tambem consulta pedidos na VTEX pelo backend serverless da Vercel. Configure as variaveis de ambiente no projeto:

- `VTEX_ACCOUNT`: nome da conta VTEX.
- `VTEX_ENVIRONMENT`: opcional, padrao `vtexcommercestable`.
- `VTEX_APP_KEY`: app key com permissao de leitura de pedidos.
- `VTEX_APP_TOKEN`: app token correspondente.

Ao informar pedido/NSU, o app tenta buscar o pedido na OMS VTEX, preencher ID interno, status, bandeira, transportadora, rastreio e calcular o prazo de contestacao como 10 dias apos o faturamento. No painel do caso, e possivel anexar fotos/evidencias e baixar um e-mail `.eml` padrao para envio da solicitacao.

## Deploy na Vercel

1. Suba este repositorio para o GitHub.
2. Na Vercel, escolha `Add New Project`.
3. Importe o repositorio.
4. Use as configuracoes padrao. Nao precisa de build command.
5. Publique.

Se usar Vercel CLI:

```powershell
vercel
vercel --prod
```
