# Produto 03 — Screening de Ações

## O que é?
Uma ferramenta de **triagem de ações fundamentalistas** que permite ao usuário filtrar, ordenar e comparar ações da bolsa brasileira (B3) com base em indicadores financeiros, com **preços em tempo real** via Yahoo Finance.

---

## O que faz?

| Função | Descrição |
|--------|-----------|
| **Listagem de ações** | Exibe tabela com 12 ações pré-cadastradas |
| **Busca** | Filtra por ticker (ex: PETR4) ou nome (ex: Petrobras) |
| **Filtro por setor** | Filtra pelo setor da empresa |
| **Ordenação** | Ordena por DY, P/L, ROE ou ROIC |
| **Preços ao vivo** | Busca cotação atual via Yahoo Finance |
| **Favoritos** | Marca/desmarca ações favoritas (estado local) |
| **Tooltip educativo** | Explica cada indicador ao clicar |
| **Link para ativo** | Navega para a página detalhada `/acao/:ticker` |
| **Auto-refresh** | Atualiza os preços automaticamente a cada 60 segundos |

---

## Como funciona internamente?

### Pipeline de dados

```
1. Dados fundamentalistas → carregados do mock local (mockAcoes)
2. Preços em tempo real   → buscados via Yahoo Finance API
3. Merge                 → preço/variação real sobrepõe o mock quando disponível
4. Exibição              → tabela com indicador visual de fonte (ponto verde = real)
```

### Fluxo de preços ao vivo

```
fetchMultipleQuotes(tickers)
     ↓
Divide tickers em batches de 5 (evita sobrecarga)
     ↓
Para cada batch: fetchQuote(ticker)
     ↓
  Cache em memória? (TTL: 60s)
  └── Sim → retorna cache
  └── Não → fetch('https://query1.finance.yahoo.com/v8/finance/chart/PETR4.SA')
              ├── Sucesso → parseia, armazena no cache, retorna
              └── Falha  → retorna null (fallback para mock)
     ↓
Exibido na tabela com indicador visual (🟢 ao vivo / 🟡 dados locais)
```

---

## Indicadores Exibidos

| Indicador | Nome Completo | Lógica de Coloração |
|-----------|--------------|---------------------|
| **DY** | Dividend Yield | Verde ≥6%, Dourado ≥3%, Cinza <3% |
| **P/L** | Preço/Lucro | Verde ≤10, Normal ≤20, Vermelho >20 |
| **P/VP** | Preço/Valor Patrimonial | Sem coloração especial |
| **ROE** | Retorno sobre Patrimônio | Verde ≥20%, Dourado ≥12%, Cinza <12% |
| **ROIC** | Retorno sobre Capital | Normal (sem coloração) |
| **Margem Líquida** | % da receita que vira lucro | Normal (sem coloração) |

---

## Ações Disponíveis (Mock)

| Ticker | Empresa | Setor |
|--------|---------|-------|
| PETR4 | Petrobras | Petróleo, Gás e Biocombustíveis |
| VALE3 | Vale | Materiais Básicos |
| ITUB4 | Itaú Unibanco | Financeiro |
| BBDC4 | Bradesco | Financeiro |
| ABEV3 | Ambev | Consumo não Cíclico |
| WEGE3 | WEG | Bens Industriais |
| RENT3 | Localiza | Consumo Cíclico |
| RDOR3 | Rede D'Or | Saúde |
| TOTS3 | TOTVS | Tecnologia da Informação |
| VIVT3 | Vivo | Comunicações |
| SUZB3 | Suzano | Materiais Básicos |
| EGIE3 | Engie Brasil | Utilidade Pública |

> ⚠️ Em produção, esses dados viriam de uma importação CSV/Excel com dados fundamentalistas reais.

---

## Onde mora o código?

| Arquivo | Função |
|---------|--------|
| `src/pages/screening/page.tsx` | Página completa (293 linhas) |
| `src/services/stockPrices.ts` | Serviço de preços Yahoo Finance |
| `src/mocks/acoes.ts` | Dados fundamentalistas mockados |

---

## APIs e Integrações Externas

### Yahoo Finance (Principal)
```
URL: https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}.SA
Método: GET
Headers: User-Agent: Mozilla/5.0
Auth: Nenhuma (API pública)
```

**Campos extraídos da resposta:**
| Campo da API | Mapeado para |
|-------------|-------------|
| `meta.regularMarketPrice` | Preço atual |
| `meta.previousClose` | Fechamento anterior (para calcular variação) |
| `meta.regularMarketOpen` | Abertura do dia |
| `meta.regularMarketDayHigh` | Máxima do dia |
| `meta.regularMarketDayLow` | Mínima do dia |
| `meta.regularMarketVolume` | Volume negociado |
| `meta.marketCap` | Valor de mercado |
| `meta.regularMarketTime` | Timestamp da cotação |

> Os tickers brasileiros recebem o sufixo `.SA` automaticamente (ex: `PETR4` → `PETR4.SA`)

### Fallback
Se a API falhar ou retornar vazio, os dados do mock local (`mockAcoes`) são usados como fallback. Um indicador visual avisa o usuário que os dados são locais.

---

## Cache

```typescript
// Implementado em memória (Map<string, {data, expiresAt}>)
const CACHE_TTL = 60 * 1000; // 1 minuto
```

Sem cache permanente — reseta ao recarregar a página. Auto-refresh de 60s via `setInterval`.

---

## Estrutura de Dados

### Interface: `StockQuote`
```typescript
interface StockQuote {
  ticker: string;
  preco: number;
  variacao: number;         // % variação no dia
  variacaoAbsoluta: number; // R$ variação no dia
  abertura: number;
  maxDia: number;
  minDia: number;
  volume: number;
  marketCap: number;
  timestamp: number;
  fonte: 'real' | 'mock';  // indica a origem do dado
}
```

---

## Inputs e Controles do Usuário

| Controle | Tipo | Ação |
|---------|------|------|
| Campo de busca | Text input | Filtra em tempo real por ticker/nome |
| Seletor de setor | Select dropdown | Filtra por setor |
| Botões DY/P/L/ROE/ROIC | Toggle buttons | Ordena a tabela |
| Botão de indicador | Click | Abre tooltip explicativo |
| Botão de favorito | Toggle (ícone estrela) | Marca/desmarca favorito |
| Botão de atualizar | Click (ícone refresh) | Força nova busca de preços |

---

## Status de Implementação

- [x] Listagem de ações com indicadores
- [x] Busca por ticker e nome
- [x] Filtro por setor
- [x] Ordenação por indicadores
- [x] Preços ao vivo (Yahoo Finance)
- [x] Cache em memória com TTL
- [x] Auto-refresh de 60 segundos
- [x] Indicador visual de fonte (real vs mock)
- [x] Tooltips educativos por indicador
- [x] Favoritos (local, sem persistência)
- [x] Link para página detalhada do ativo
- [ ] Dados fundamentalistas reais (via CSV/Excel do admin)
- [ ] Favoritos persistidos no Supabase
- [ ] Comparação side-by-side de ações
- [ ] Filtros avançados (faixas de P/L, DY mínimo, etc.)
- [ ] Exportação de dados

---

## Observações

> O produto atualmente usa **dados fundamentalistas mockados** (hardcoded em `mocks/acoes.ts`). O plano é que o admin importe esses dados via CSV/Excel em uma fase futura.

> Os preços ao vivo podem falhar por **CORS** dependendo do ambiente (o Yahoo Finance não tem CORS configurado para todos os origins). Em produção, isso deveria passar por uma **Supabase Edge Function** como proxy.
