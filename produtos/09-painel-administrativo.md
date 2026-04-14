# Produto 09 — Painel Administrativo

## O que é?
O **back-office completo** da plataforma Synapta, acessível apenas para usuários com `role: 'admin'`. Permite gerenciar tudo que acontece na plataforma: usuários, carteiras recomendadas, ativos e métricas gerais.

---

## O que faz?

Organizado em **4 abas**:

| Aba | Função |
|-----|--------|
| **Visão Geral** | Dashboard com métricas da plataforma e últimos cadastros |
| **Carteiras Recomendadas** | Editar as carteiras modelo e seus ativos |
| **Usuários** | Ver, filtrar e gerenciar todos os usuários |
| **Plataforma** | Status dos serviços, estatísticas e tabelas do banco |

---

## Controle de Acesso

```typescript
// Ao carregar a página:
if (!user || user.role !== 'admin') {
  navigate('/dashboard')  // Redireciona não-admins
}
```

Somente usuários com `role: 'admin'` na tabela `profiles` podem acessar `/admin`.

---

## Aba 1: Visão Geral (Dashboard Admin)

### Métricas em Cards
| Métrica | Fonte |
|---------|-------|
| Total de Usuários | `profiles.count` |
| Onboarding Completo | `profiles WHERE onboarding_completo = true` |
| Carteiras Ativas | `carteiras_recomendadas WHERE ativo = true` |
| Ativos Cadastrados | `carteira_ativos.count` de todas as carteiras |

### Últimos Cadastros
Tabela dos 5 usuários mais recentes com:
- Nome e avatar (inicial)
- Data de cadastro
- Role (admin/cliente)
- Status do onboarding

---

## Aba 2: Carteiras Recomendadas

### O que é?
Edição das carteiras modelo que são exibidas para os clientes na aba "Recomendações" do produto Carteira.

### Funcionalidades
- Listar todas as carteiras com nome, tagline, retorno esperado, Sharpe
- Ver os ativos de cada carteira
- **Editar carteira:** nome, tagline, descrição, retorno esperado, volatilidade, Sharpe, horizonte, alertas/dicas
- **Editar ativo:** ticker, nome, setor, peso (%), DY, P/L, motivo curto, explicação completa

### Tabela: `carteiras_recomendadas` (Supabase)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | PK |
| `key` | text | Slug único (ex: `conservadora`) |
| `nome` | text | Nome exibido (ex: "Carteira Conservadora") |
| `tagline` | text | Subtítulo curto |
| `descricao` | text | Descrição completa |
| `retorno_esperado` | text | Ex: "10–14% a.a." |
| `volatilidade` | text | Ex: "6–10%" |
| `sharpe` | text | Ex: "1.4–1.6" |
| `horizonte` | text | Ex: "2-5 anos" |
| `perfis` | text[] | Perfis atendidos |
| `alertas` | text[] | Dicas/alertas exibidos ao cliente |
| `ativo` | boolean | Se está publicada para clientes |

### Tabela: `carteira_ativos` (Supabase)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | PK |
| `carteira_id` | uuid | FK → carteiras_recomendadas |
| `ticker` | text | Código B3 |
| `nome` | text | Nome da empresa |
| `setor` | text | Setor da empresa |
| `peso` | numeric | Percentual na carteira (%) |
| `dy` | text | Dividend Yield (ex: "12.4%") |
| `pl` | numeric | Preço/Lucro |
| `tipo` | text | Tipo de ativo |
| `explicacao` | text | Texto explicativo completo |
| `motivo_curto` | text | Motivo resumido para o cliente |
| `ordem` | int | Ordem de exibição |

---

## Aba 3: Usuários

### O que é?
Listagem, filtragem e gestão de todos os usuários cadastrados na plataforma.

### Filtros disponíveis
- Por perfil: Todos / Conservador / Moderado / Arrojado
- Por onboarding: Todos / Concluído / Pendente

### O que é exibido por usuário
- Nome + data de cadastro
- Role (admin/cliente) — com botão para alternar
- Status do onboarding (OK/Pendente)
- Carteira recomendada (baseada no perfil)
- Total investido (calculado das transações)
- Patrimônio declarado (do onboarding)
- Número de transações

### Modal de Detalhes do Usuário
Ao clicar em "Detalhes":
- Perfil de investidor
- Carteira recomendada
- Total invertido na carteira
- Patrimônio declarado
- Renda mensal
- Objetivo principal
- Posições na carteira (ticker, quantidade, preço médio, total)
- Últimas 8 transações

### Ação: Alternar Role (Admin/Cliente)

```typescript
// Toggle de admin:
supabase.from('profiles')
  .update({ role: novoRole })
  .eq('id', userId)
```

---

## Aba 4: Plataforma

### O que é?
Visão técnica do status da plataforma e estatísticas gerais.

### Status dos Serviços (indicadores estáticos)
| Serviço | Status atual |
|---------|-------------|
| Banco de Dados (Supabase) | ✅ Operacional |
| Autenticação (Supabase Auth) | ✅ Operacional |
| API de Preços (Yahoo Finance) | ✅ Operacional |

> Status fixo no código. Não há health check real implementado.

### Estatísticas Gerais
- Total de usuários
- Com onboarding completo
- Por perfil (Conservador / Moderado / Arrojado / Sem perfil)
- Carteiras ativas
- Total de ativos

### Distribuição de Perfis
Barras de progresso mostrando % de usuários em cada perfil.

### Tabelas do Banco de Dados
Lista das tabelas existentes:
- `profiles`
- `onboarding_data`
- `transacoes`
- `metas`
- `dividas`
- `carteiras_recomendadas`
- `carteira_ativos`

---

## Fluxo de Carregamento de Dados

```typescript
// loadData() — carrega tudo em paralelo:
Promise.all([
  supabase.from('profiles').select('*').order('created_at', desc),
  supabase.from('carteiras_recomendadas').select('*').order('key'),
  supabase.from('transacoes').select('*').order('data', desc),
  supabase.from('onboarding_data').select('user_id, patrimonio_total, renda_mensal, gastos_mensais, objetivo_principal, horizonte_anos, tem_dividas, total_dividas'),
])

// Após carregar carteiras, busca os ativos:
supabase.from('carteira_ativos').select('*').in('carteira_id', [...ids])
```

---

## Onde mora o código?

| Arquivo | Função |
|---------|--------|
| `src/pages/admin/page.tsx` | Página completa (822 linhas) |
| `src/lib/supabase.ts` | Client Supabase |
| `src/hooks/useAuth.ts` | Verificação de role admin |

---

## APIs e Integrações Externas

| Integração | Uso |
|------------|-----|
| **Supabase DB** | Todas as tabelas (leitura + atualização) |
| **Supabase Auth** | Verificação de role do usuário logado |

> Sem APIs externas — toda operação é no Supabase.

---

## Modais do Admin

### Modal: Editar Carteira
Campos editáveis:
- Nome, Tagline, Retorno Esperado, Volatilidade, Sharpe, Horizonte
- Descrição (textarea)
- Alertas/Dicas (textarea — uma por linha, convertida para array)

### Modal: Editar Ativo
Campos editáveis:
- Ticker, Nome, Setor, DY
- Peso (%), P/L (numéricos)
- Motivo Curto (input)
- Explicação Completa (textarea 6 linhas)

### Modal: Detalhes do Usuário
Somente leitura — mostra o perfil completo do cliente.

---

## Status de Implementação

- [x] Acesso restrito por role (admin only)
- [x] Dashboard com métricas da plataforma
- [x] Últimos cadastros
- [x] Listagem de usuários com filtros
- [x] Modal de detalhes do usuário (carteira + transações)
- [x] Toggle de role (admin ↔ cliente)
- [x] Edição de carteiras recomendadas
- [x] Edição de ativos das carteiras
- [x] Aba de status da plataforma
- [x] Distribuição de perfis de usuário
- [ ] Criar novas carteiras (só edição)
- [ ] Adicionar/remover ativos de carteiras
- [ ] Upload de PDFs de relatórios
- [ ] Importação de CSV/Excel de fundamentos
- [ ] Desativar/banir usuário
- [ ] Health check real dos serviços
- [ ] Painel de transações da plataforma inteira
- [ ] Busca de usuários por nome

---

## Observações

> O admin pode ver **todas as transações** de todos os usuários — isso exige que as **RLS (Row Level Security) do Supabase** estejam configuradas para dar acesso total ao role admin.

> As carteiras recomendadas editadas pelo admin aparecerão em tempo real para os clientes no produto Carteira (Produto 06). Mas atualmente o **Produto 06 ainda usa dados hardcoded** — a integração com o banco para carteiras ainda precisa ser completada.
