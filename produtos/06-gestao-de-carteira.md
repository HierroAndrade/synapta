# Produto 06 — Gestão de Carteira

## O que é?
O módulo de **gerenciamento da carteira de ações** do usuário. Permite registrar compras e vendas, acompanhar posições, ver o histórico de transações e visualizar carteiras recomendadas pela Synapta de acordo com o perfil de investidor.

---

## O que faz?

| Função | Descrição |
|--------|-----------|
| **Posições Atuais (Holdings)** | Tabela com todos os ativos, quantidade, preço médio, preço atual, valor total e ganho/perda |
| **Histórico de Transações** | Lista de todas as compras e vendas registradas |
| **Registrar Transação** | Modal para adicionar nova compra ou venda |
| **Alocação por Setor** | Gráfico de pizza com distribuição percentual por setor |
| **Carteiras Recomendadas** | 3 carteiras modelo (Conservadora, Moderada, Arrojada) com detalhamento |
| **Métricas de Resumo** | Valor atual total, total investido, ganho/perda em R$ e % |

---

## As 3 Abas da Página

### Aba 1: Posições Atuais (Holdings)
Exibe tabela com colunas:
- Ação (ticker + setor)
- Quantidade em carteira
- Preço médio de compra
- Preço atual + variação % do dia
- Valor total atual
- Ganho/Perda (R$ e %)

**Cálculo de preço médio:** usa método FIFO/custo médio ponderado:
```
preçoMédio = custoTotal / quantidadeAtual
custoTotal ajustado nas vendas pelo preço médio vigente
```

---

### Aba 2: Histórico de Transações
Tabela com: Data, Ticker, Tipo (COMPRA/VENDA), Quantidade, Preço unitário, Total.

Os dados são carregados do Supabase em tempo real.

---

### Aba 3: Carteiras Recomendadas
3 carteiras modelo criadas pela Synapta:

**Carteira Conservadora (Perfil: conservador)**
| Classe | Percentual | Exemplos |
|--------|-----------|---------|
| Renda Fixa | 60% | Tesouro Selic, CDB, LCI/LCA |
| Ações Dividendos | 25% | PETR4, ITUB4, BBAS3, EGIE3 |
| FIIs | 10% | Fundos Imobiliários de tijolo |
| Reserva | 5% | CDB liquidez diária |

Retorno esperado: 10–14% a.a. | Volatilidade: 6–10% | Sharpe: 1.4–1.6

**Carteira Moderada (Perfil: moderado)**
| Classe | Percentual | Exemplos |
|--------|-----------|---------|
| Ações (mix) | 50% | WEGE3, RENT3, ITUB4, VALE3, PETR4, RDOR3 |
| Renda Fixa | 30% | CDB, Tesouro IPCA+, LCI |
| FIIs | 15% | Fundos diversificados |
| Reserva | 5% | Liquidez imediata |

Retorno esperado: 15–20% a.a. | Volatilidade: 12–16% | Sharpe: 1.2–1.4

**Carteira Arrojada (Perfil: arrojado)**
| Classe | Percentual | Exemplos |
|--------|-----------|---------|
| Ações Crescimento | 70% | WEGE3, INTB3, PRIO3, RECV3, SMTO3, MELI34 |
| Ações Dividendos | 15% | Âncora de estabilidade |
| Renda Fixa | 10% | Proteção mínima |
| Reserva | 5% | Para oportunidades |

Retorno esperado: 22–30% a.a. | Volatilidade: 18–25% | Sharpe: 1.0–1.2

---

## Modal: Registrar Nova Transação

**Campos:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| Tipo | Select visual (2 botões) | Compra ou Venda |
| Ticker | Text input (auto-UPPERCASE) | Código da ação (ex: PETR4) |
| Quantidade | Number | Número de ações |
| Preço | Number | Preço unitário da operação |

**Validação:**
- Para **vendas**: verifica se o usuário tem quantidade suficiente em carteira antes de permitir
- Total calculado automaticamente: `quantidade × preço`

**Persistência:**
```typescript
supabase.from('transacoes').insert({
  user_id,
  ticker,
  tipo: 'compra' | 'venda',
  quantidade,
  preco,
  data: hoje,
  total: quantidade × preco,
})
```

---

## Estrutura de Dados

### Tabela: `transacoes` (Supabase)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | PK gerada automaticamente |
| `user_id` | uuid | FK → profiles |
| `ticker` | text | Código B3 (ex: PETR4) |
| `tipo` | enum | `'compra'` ou `'venda'` |
| `quantidade` | numeric | Número de ações |
| `preco` | numeric | Preço unitário da operação |
| `data` | date | Data da transação |
| `total` | numeric | `quantidade × preco` |
| `created_at` | timestamp | Criação do registro |

### Interface: `Holding` (calculada localmente)
```typescript
interface Holding {
  ticker: string;
  setor: string;
  quantidade: number;
  precoMedio: number;  // Calculado a partir das transações
  precoAtual: number;  // Referência local (não ao vivo)
  variacao: number;    // % variação do dia (referência local)
}
```

---

## Tabela de Referência de Preços (hardcoded)

O componente contém uma referência local com preços e setores para os principais tickers. Isso **não é em tempo real** — são valores fixos definidos no código:

```typescript
const tickerInfo = {
  PETR4: { setor: 'Petróleo...', precoAtual: 38.42, variacao: 1.23 },
  VALE3: { setor: 'Materiais Básicos', precoAtual: 62.18, variacao: -0.87 },
  // 14 tickers no total
}
```

Tickers não mapeados recebem `precoAtual = precoMédio` e `variacao = 0`.

---

## Onde mora o código?

| Arquivo | Função |
|---------|--------|
| `src/pages/carteira/page.tsx` | Página completa (857 linhas) |
| `src/mocks/financeiro.ts` | `mockTransacoes` (dados iniciais de demonstração) |
| `src/lib/supabase.ts` | Client Supabase |
| `src/hooks/useAuth.ts` | Dados do usuário (para associar transações) |

---

## Fallback para Mock

Existe um mecanismo de fallback usando `localStorage` para casos em que o usuário não está autenticado ou a query falha:

```typescript
const TRANSACOES_KEY = 'synapta_transacoes';

// Tenta carregar do Supabase. Se falhar, usa o mock salvo no localStorage.
// Ao primeiro acesso sem login, inicializa o localStorage com mockTransacoes.
```

---

## APIs e Integrações Externas

| Integração | Uso |
|------------|-----|
| **Supabase DB** | Leitura e escrita de `transacoes` |
| **Supabase Auth** | Obtém `user.id` para escopo das transações |

> **Sem APIs externas de preços** neste produto. Os preços são referências locais hardcoded.

---

## Status de Implementação

- [x] Listagem de holdings calculadas de transações reais
- [x] Métricas de resumo (valor atual, investido, ganho/perda)
- [x] Modal de nova transação (compra e venda)
- [x] Validação de quantidade na venda
- [x] Histórico de transações
- [x] Alocação por setor (pie chart)
- [x] 3 carteiras recomendadas com detalhe de alocação e ações
- [x] Persistência no Supabase
- [x] Fallback com localStorage
- [ ] Preços ao vivo na carteira (atualmente estáticos)
- [ ] Editar/excluir transações
- [ ] Importar transações em lote (CSV)
- [ ] Filtro por período no histórico
- [ ] Exportar carteira e histórico
- [ ] Dividendos recebidos
- [ ] Nota de corretagem automática

---

## Observações

> Os preços atuais na carteira são **estáticos** (hardcoded). Para uma versão de produção, deveriam usar a mesma lógica de preços ao vivo do Screening (Yahoo Finance via proxy).

> As **carteiras recomendadas** na aba 3 são definidas localmente no componente. Em produção, devem vir do banco de dados (`carteiras_recomendadas`) gerenciado pelo admin, permitindo atualizações sem deploy de código.
