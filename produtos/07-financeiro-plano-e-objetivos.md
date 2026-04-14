# Produto 07 — Financeiro: Plano, Patrimônio, Objetivos, Dívidas e Reserva

## O que é?
O produto mais completo de **saúde financeira pessoal** da plataforma. Ele transforma os dados do onboarding em um plano de ação personalizado, além de permitir ao usuário gerenciar seus objetivos financeiros (metas), dívidas e reserva de emergência — tudo com projeções interativas de patrimônio.

---

## O que faz?

Organizado em **5 abas**:

| Aba | Função |
|-----|--------|
| **Meu Plano** | Plano financeiro personalizado baseado no perfil + projeção editável |
| **Patrimônio** | Evolução histórica, distribuição e indicadores de saúde financeira |
| **Objetivos** | CRUD de metas financeiras com barra de progresso e aportes |
| **Dívidas** | CRUD de dívidas com priorização por taxa de juros |
| **Reserva** | Monitoramento da reserva de emergência |

---

## Aba 1: Meu Plano

### O que exibe?
- Perfil atual do usuário (conservador/moderado/arrojado) com carteira recomendada
- Como distribuir o aporte mensal (renda fixa, renda variável, reserva)
- Projeção de patrimônio editável
- Próximos passos numerados e priorizados

### Como é calculado?

```typescript
function calcularPlano(onboardingData):
  sobra = renda_mensal - gastos_mensais
  reservaMeta = gastos_mensais × 6  // Meta: 6 meses de gastos
  reservaFaltante = max(0, reservaMeta - reserva_atual)

  alocacoes = {
    conservador: { rendaFixa: 70%, rendaVariavel: 25%, reserva: 5% },
    moderado:    { rendaFixa: 35%, rendaVariavel: 55%, reserva: 10% },
    arrojado:    { rendaFixa: 15%, rendaVariavel: 75%, reserva: 10% },
  }

  aporteMensal = max(0, sobra × 70%)
  aporteRendaFixa     = aporteMensal × alocacao.rendaFixa%
  aporteRendaVariavel = aporteMensal × alocacao.rendaVariavel%
  aporteReserva       = min(sobra × 30%, reservaFaltante)
```

### Projeção de Patrimônio (juros compostos)

```typescript
// Parâmetros editáveis pelo usuário:
// - Aporte mensal (R$)
// - Retorno anual esperado (%)
// - Horizonte (anos)

function calcularProjecao(patrimonioInicial, aporteMensal, retornoAnual, anos):
  retornoMensal = retornoAnual / 12
  para cada mês de 1 até anos×12:
    valorAtual = valorAtual × (1 + retornoMensal) + aporteMensal
  
  // Retorna snapshot anual do patrimônio
```

**Retornos pré-configurados por perfil:**
- Conservador → 12% a.a.
- Moderado → 17% a.a.
- Arrojado → 25% a.a.

### Próximos Passos (4 passos automáticos)
```
1. Complete sua reserva de emergência
   (Urgente se reserva < 50%)
2. Quite as dívidas com juros altos
   (Feito se totalDividas = 0)
3. Comece a investir na carteira recomendada
4. Revise sua carteira a cada 6 meses
```

---

## Aba 2: Patrimônio

- **Gráfico de evolução:** AreaChart dos últimos 12 meses (dados mockados)
- **Distribuição do patrimônio:**
  - Ações (B3): 72% do patrimônio total
  - Renda Fixa: 20%
  - Reserva de Emergência: valor real do onboarding
- **Indicadores de saúde financeira:**
  - Taxa de Poupança: `sobra / renda_mensal` (bom se ≥20%)
  - Dívida/Patrimônio: `totalDividas / patrimonio_total` (bom se ≤30%)
  - Meses de Reserva: `reserva_atual / gastos_mensais` (bom se ≥6)

---

## Aba 3: Objetivos (Metas Financeiras)

### O que é?
CRUD completo de metas financeiras pessoais com acompanhamento de progresso.

### Funcionalidades

| Função | Descrição |
|--------|-----------|
| **Criar meta** | Nome, valor atual, valor meta, prazo (mês/ano) |
| **Aporte** | Adicionar valor a uma meta existente |
| **Progresso visual** | Barra de progresso colorida + badge de status |
| **Estimativa de tempo** | Calcula quantos meses faltam com base na sobra |
| **Status badge** | Iniciando / Em progresso / Quase lá / Concluída |
| **Cor automática** | Atribui cor automaticamente da paleta rotativa |

### Persistência

```typescript
// Criar:
supabase.from('metas').insert({
  user_id, nome, atual, meta, prazo, cor
})

// Aporte:
supabase.from('metas').update({ atual: novoAtual, updated_at })
.eq('id', metaId)
```

### Tabela: `metas` (Supabase)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | PK |
| `user_id` | uuid | FK → profiles |
| `nome` | text | Nome da meta |
| `atual` | numeric | Valor acumulado atual |
| `meta` | numeric | Valor total da meta |
| `prazo` | text | "YYYY-MM" do prazo |
| `cor` | text | Cor hex da barra de progresso |
| `created_at` | timestamp | Criação |
| `updated_at` | timestamp | Última atualização |

---

## Aba 4: Dívidas

### O que é?
CRUD de dívidas com priorização inteligente — ordena as dívidas da maior para menor taxa de juros e alerta sobre dívidas com juros abusivos.

### Funcionalidades

| Função | Descrição |
|--------|-----------|
| **Registrar dívida** | Nome, valor, parcelas, valor da parcela, taxa de juros, tipo |
| **Alerta de juros altos** | Avisa se taxa > 1% a.m. com dica de priorização |
| **Prioridade** | Marca a dívida de maior juros como "Prioridade" |
| **Quitar** | Marca dívida como quitada (soft delete) |

### Tipos de Dívida
- `cartao` — Cartão de Crédito
- `financiamento` — Financiamento (carro, imóvel)
- `emprestimo` — Empréstimo

### Tabela: `dividas` (Supabase)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | PK |
| `user_id` | uuid | FK → profiles |
| `nome` | text | Nome da dívida |
| `valor` | numeric | Valor total restante |
| `parcelas` | int | Número de parcelas |
| `parcela_valor` | numeric | Valor de cada parcela |
| `taxa_juros` | numeric | Taxa mensal (% a.m.) |
| `tipo` | text | cartao, financiamento, emprestimo |
| `quitada` | boolean | Se foi marcada como quitada |
| `created_at` | timestamp | Criação |
| `updated_at` | timestamp | Última atualização |

---

## Aba 5: Reserva de Emergência

### O que é?
Painel dedicado ao monitoramento da reserva de emergência do usuário.

### O que exibe?
- Barra de progresso da reserva atual vs meta
- Valor atual vs necessário (6× gastos mensais)
- Meses cobertos pela reserva
- Onde guardar (recomenda: Tesouro Selic ou CDB com liquidez diária)

### Fonte dos dados
```typescript
reservaMeta = gastos_mensais × 6   // vem de onboarding_data
reservaAtual = meses_reserva × gastos_mensais  // calculado
reservaPct = (reservaAtual / reservaMeta) × 100
```

---

## Cards de Resumo (topo da página — todos)

| Métrica | Fonte |
|---------|-------|
| Patrimônio Total | `onboarding_data.patrimonio_total` |
| Aporte Sugerido | `calcularPlano().aporteMensal` |
| Reserva de Emergência (%) | Calculado localmente |
| Total em Dívidas | Soma das dívidas ativas do Supabase |

---

## Onde mora o código?

| Arquivo | Função |
|---------|--------|
| `src/pages/financeiro/page.tsx` | Página completa (880 linhas) |
| `src/mocks/financeiro.ts` | Interfaces e dados de demonstração |
| `src/mocks/portfolio.ts` | `mockEvolucaoPatrimonio` para gráfico |
| `src/lib/supabase.ts` | Client Supabase |

---

## APIs e Integrações Externas

| Integração | Uso |
|------------|-----|
| **Supabase DB** | `onboarding_data`, `metas`, `dividas` (CRUD completo) |
| **Supabase Auth** | Escopo dos dados ao usuário logado |

> **Sem APIs externas** — todo processamento é local.

---

## Status de Implementação

- [x] Algoritmo de plano financeiro personalizado
- [x] Projeção de patrimônio editável (juros compostos)
- [x] CRUD de metas financeiras no Supabase
- [x] Aportes em metas com atualização em tempo real
- [x] CRUD de dívidas com priorização por juros
- [x] Marcação de dívida como quitada
- [x] Monitoramento de reserva de emergência
- [x] Indicadores de saúde financeira
- [x] Gráfico de evolução do patrimônio
- [x] Próximos passos automáticos
- [x] Totalmente integrado ao onboarding
- [ ] Distribuição do patrimônio (atualmente usa % estáticas)
- [ ] Gráfico de evolução real (atualmente mockado)
- [ ] Notificações de prazo de metas
- [ ] Deletar metas e dívidas
- [ ] Editar metas existentes
- [ ] Cálculo de data estimada de conquista de metas

---

## Observações

> Este é o produto **mais dependente do onboarding** — se o usuário não preencheu o diagnóstico, exibe um aviso e os cálculos mostram zeros. A renda, gastos, patrimônio e reserva decorrem do onboarding.

> A distribuição do patrimônio na aba Patrimônio usa **percentagens fixas** (72% ações, 20% renda fixa, etc.) — não reflete a carteira real do usuário. Em produção, deveria integrar com a Carteira (Produto 06).
