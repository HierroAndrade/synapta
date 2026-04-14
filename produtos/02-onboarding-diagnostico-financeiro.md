# Produto 02 — Onboarding: Diagnóstico Financeiro Pessoal

## O que é?
Um questionário guiado em **6 etapas** que coleta dados financeiros do usuário para gerar um **diagnóstico personalizado** com perfil de risco, alocação sugerida e alertas financeiros. É o produto que "alimenta" todos os outros com dados pessoais do usuário.

---

## O que faz?

| Função | Descrição |
|--------|-----------|
| **Coleta de renda** | Renda mensal, fontes extras de renda, maiores gastos |
| **Coleta de patrimônio** | Total guardado, tipos de ativos, dívidas |
| **Definição de objetivos** | O que quer conquistar financeiramente e em quanto tempo |
| **Diagnóstico de perfil de risco** | Avaliação comportamental (reação a quedas, experiência, % em risco) |
| **Análise de proteção** | Seguro de vida, plano de saúde, dependentes, reserva de emergência |
| **Diagnóstico final** | Perfil calculado automaticamente com alocação e métricas |
| **Alertas personalizados** | Identifica problemas como dívidas caras e reserva insuficiente |
| **Persistência** | Salva todos os dados no Supabase e atualiza o perfil do usuário |

---

## As 6 Etapas

### Etapa 1 — Renda & Gastos
**Campos coletados:**
- Renda mensal líquida (obrigatório)
- Gastos mensais totais (obrigatório)
- Outras fontes de renda (multi-select opcional): Aluguéis, Dividendos, Freelas, Pensão, Aposentadoria, Negócio próprio
- Maiores categorias de gasto (multi-select opcional): Moradia, Alimentação, Transporte, Saúde, Educação, Lazer, Dívidas, Outros

**Feedback em tempo real:** Mostra a sobra mensal disponível para investir.

---

### Etapa 2 — Patrimônio & Dívidas
**Campos coletados:**
- Total guardado/investido hoje (R$)
- Tipos de ativos que já possui (multi-select): Poupança, Renda Fixa, Ações, Fundos, Imóveis, Cripto, Previdência
- Toggle: Possui dívidas?
- Se sim: valor total das dívidas, taxa de juros (% a.a.), prazo para quitar (meses)

**Lógica especial:** Juros acima de 15% a.a. exibem alerta vermelho imediato.

---

### Etapa 3 — Objetivos
**Campos coletados:**
- Objetivos financeiros (multi-select visual com cards): Reserva de Emergência, Aposentadoria, Renda Passiva, Crescer Patrimônio, Comprar Imóvel, Educação, Viagem, Negócio Próprio
- Objetivo principal (seleção única entre os escolhidos)
- Horizonte de investimento (slider: 1 a 30 anos)

---

### Etapa 4 — Perfil de Risco
**Radio cards com pontuação:**
- **Reação a quedas:** Vender tudo / Esperar preocupado / Manter tranquilo / Comprar mais (0-3 pontos)
- **Experiência em renda variável:** Nunca/Pouca/Média/Experiente (0-3 pontos)
- **% do patrimônio aceitável em risco:** Até 10% / Até 30% / Até 60% / Mais de 60% (0-3 pontos)

---

### Etapa 5 — Proteção & Reserva
**Campos coletados:**
- Toggle: Tem seguro de vida?
- Toggle: Tem plano de saúde?
- Toggle: Família depende da sua renda?
- Meses que conseguiria viver sem renda
- Meses de gastos na reserva de emergência (atual)

---

### Etapa 6 — Diagnóstico Final (gerado automaticamente)
O sistema **calcula o perfil** a partir dos pontos coletados nas etapas 3, 4 e 5:

```typescript
// Algoritmo de cálculo de perfil
pontos = reacaoQueda(0-3) + experienciaRV(0-3) + percentualRisco(0-3)
       + bonus_horizonte(0-2) - penalidade_dividas(0-2) - penalidade_reserva(0-1)

// Resultado:
pontos <= 3  → "conservador"
pontos <= 7  → "moderado"
pontos >= 8  → "arrojado"
```

**Exibido ao usuário:**
- Badge do perfil (Conservador / Moderado / Arrojado)
- Retorno esperado, volatilidade e Sharpe estimados
- Barra visual de alocação sugerida
- Alertas prioritários (reserva insuficiente, dívidas caras, sem seguro+dependentes, sem plano de saúde)
- Carteira sugerida pelo perfil

---

## Alocação Sugerida por Perfil

| Perfil | Retorno Est. | Risco Est. | Sharpe Est. | Renda Fixa | Ações Div. | FIIs | Reserva |
|--------|-------------|------------|-------------|------------|------------|------|---------|
| Conservador | 10–14% a.a. | 6–10% vol. | 1.4–1.6 | 60% | 25% | 10% | 5% |
| Moderado | 15–20% a.a. | 12–16% vol. | 1.2–1.4 | 30% | 50% | 15% | 5% |
| Arrojado | 22–30% a.a. | 18–25% vol. | 1.0–1.2 | 10% | 70% | 15% | 5% |

---

## Como funciona a persistência?

```typescript
// Ao finalizar o onboarding:
1. updateUser({ perfil: perfilCalculado, onboardingCompleto: true })
   → Atualiza tabela 'profiles'

2. supabase.from('onboarding_data').upsert({ ...todosOsDados })
   → Cria ou atualiza (onConflict: 'user_id') na tabela 'onboarding_data'

3. navigate('/dashboard')
```

---

## Onde mora o código?

| Arquivo | Função |
|---------|--------|
| `src/pages/onboarding/OnboardingPage.tsx` | Página completa (884 linhas) |
| `src/hooks/useAuth.ts` | `updateUser()` para salvar perfil |
| `src/lib/supabase.ts` | Client + TypeScript types |

---

## Estrutura de Dados

### Tabela: `onboarding_data` (Supabase)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | PK |
| `user_id` | uuid | FK → profiles |
| `renda_mensal` | numeric | Renda mensal líquida |
| `gastos_mensais` | numeric | Total de gastos mensais |
| `outras_rendas` | text[] | Array de fontes extra de renda |
| `maiores_gastos` | text[] | Categorias de maior gasto |
| `patrimonio_total` | numeric | Total investido/guardado |
| `tipos_ativos` | text[] | Ativos que já possui |
| `tem_dividas` | boolean | Possui dívidas ativas |
| `total_dividas` | numeric | Valor total das dívidas |
| `taxa_juros_dividas` | numeric | Taxa de juros média (% a.a.) |
| `prazo_dividas` | numeric | Prazo para quitar (meses) |
| `objetivos` | text[] | Objetivos selecionados |
| `objetivo_principal` | text | Objetivo prioritário |
| `horizonte_anos` | int | Horizonte de investimento (anos) |
| `reacao_queda` | text | ID da opção de reação a quedas |
| `experiencia_rv` | text | ID do nível de experiência |
| `percentual_risco` | text | ID do percentual em risco |
| `tem_seguro_vida` | boolean | Possui seguro de vida |
| `tem_plano_saude` | boolean | Possui plano de saúde |
| `familia_depende` | boolean | Família financeiramente dependente |
| `meses_sem_renda` | numeric | Meses sem renda que sobreviveria |
| `meses_reserva` | numeric | Meses de gastos em reserva |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Última atualização |

---

## APIs e Integrações Externas

| Integração | Uso |
|------------|-----|
| **Supabase DB** | Upsert em `onboarding_data`, update em `profiles` |
| **Supabase Auth** | Obtém `user.id` para associar os dados |

> **Nenhuma API externa** é consumida neste produto. Todo o processamento é local/frontend.

---

## Inputs do Usuário (Resumo)

| Tipo de Input | Campos |
|---------------|--------|
| Números | Renda, gastos, patrimônio, dívidas, taxa de juros, prazo, meses |
| Multi-select | Fontes de renda, categorias de gasto, tipos de ativos, objetivos |
| Radio cards | Reação a quedas, experiência, % em risco |
| Toggles (on/off) | Tem dívidas, seguro de vida, plano de saúde, família depende |
| Slider | Horizonte de investimento (1–30 anos) |

---

## Status de Implementação

- [x] Etapas 1 a 5 completas com validação
- [x] Etapa 6 com diagnóstico automatizado
- [x] Algoritmo de cálculo de perfil de risco
- [x] Alertas personalizados (reserva, dívidas, proteção)
- [x] Alocação sugerida por perfil
- [x] Persistência no Supabase
- [x] Atualização do perfil do usuário após conclusão
- [ ] Modo de edição do onboarding após conclusão
- [ ] Onboarding adaptativo (pula etapas irrelevantes)

---

## Observações

> O onboarding é **obrigatório** — se o usuário não completou, é redirecionado para `/onboarding` após o login. Isso é controlado pela flag `onboarding_completo` na tabela `profiles`.

> Os dados do onboarding **alimentam diretamente** os produtos de Financeiro, Dashboard e Carteiras Recomendadas.
