# Produto 10 — Landing Page & Ticker Tape

## O que é?
A **vitrine pública** da plataforma Synapta Investimentos — a primeira página que qualquer visitante vê antes de criar conta. Apresenta o produto, destaca funcionalidades, mostra carteiras modelo, depoimentos e guia o usuário para o cadastro.

---

## O que faz?

| Seção | Descrição |
|-------|-----------|
| **HeroSection** | Headline principal, CTA de cadastro, demonstração visual |
| **TickerTape** | Faixa animada de cotações de ações em tempo real |
| **FeaturesSection** | Cards das principais funcionalidades da plataforma |
| **CarteirasSection** | Carteiras modelo com ativos e métricas |
| **OnboardingSteps** | Passos visuais do processo de diagnóstico |
| **TestimonialsSection** | Depoimentos de clientes fictícios |
| **FooterSection** | Links, logo e aviso legal |

---

## Estrutura das Seções

### HeroSection
**Conteúdo:**
- Headline: "Invista como um profissional. Sem complicação."
- Subheadline sobre o Modelo de Markowitz democratizado
- 2 CTAs: "Começar agora gratuitamente" (→ /auth/cadastro) e "Ver como funciona"
- Métricas de destaque: Retorno médio das carteiras, índice Sharpe
- Gráfico de fronteira eficiente visual (decorativo)

**Design:** Dark mode com gradiente radial dourado, partículas animadas

---

### TickerTape
**O que é:** Faixa horizontal que rola automaticamente com cotações de 15 ações.

**Como funciona:**
```
Dados: mockTickerTape (15 tickers da B3)
Animação: CSS keyframes (marquee scroll horizontal)
Conteúdo: ticker, preço (R$), variação (%)
Coloração: verde se positiva, vermelho se negativa
```

**Tickers exibidos:**
PETR4, VALE3, ITUB4, BBDC4, ABEV3, WEGE3, RENT3, RDOR3, TOTS3, VIVT3, SUZB3, EGIE3, BBAS3, CPLE6, TAEE11

> ⚠️ Dados **mockados** — não são cotações ao vivo na landing page.

---

### FeaturesSection
**6 cards de funcionalidades:**

| # | Funcionalidade | Ícone |
|---|---------------|-------|
| 1 | Otimizador Markowitz | Gráfico de bolhas |
| 2 | Screening de Ações | Lupa/filtro |
| 3 | Diagnóstico Financeiro | Checklist |
| 4 | Preços em Tempo Real | Raio/velocidade |
| 5 | Consultor IA | Robô |
| 6 | Carteiras Personalizadas | Pasta de documentos |

---

### CarteirasSection
**3 carteiras modelo em cards:**

| Carteira | Perfil | Retorno Est. | Sharpe |
|---------|--------|-------------|--------|
| Conservadora | Conservador | 12.4% a.a. | 1.51 |
| Moderada | Moderado | 18.7% a.a. | 1.29 |
| Arrojada | Arrojado | 26.3% a.a. | 1.15 |

Cada card exibe: ativos com pesos percentuais, risco, horizonte recomendado, CTA para cadastro.

---

### OnboardingSteps
**4 passos visuais:**
1. Responda ao diagnóstico financeiro (5 min)
2. Receba seu perfil de investidor
3. Veja a carteira ideal calculada por Markowitz
4. Invista com confiança

---

### TestimonialsSection
**6 depoimentos mockados:**

| Pessoa | Cargo | Tema do depoimento |
|--------|-------|-------------------|
| Carlos Mendes | Engenheiro, 38 anos | Linguagem simples, crescimento de 23% |
| Ana Paula Ferreira | Médica, 45 anos | Confiança com o Markowitz |
| Roberto Silva | Empresário, 52 anos | Screening economiza horas |
| Juliana Costa | Professora, 31 anos | Começou do zero com R$ 500/mês |
| Marcos Oliveira | Contador, 41 anos | Fidelidade matemática ao Markowitz |
| Fernanda Lima | Advogada, 36 anos | Diagnóstico honesto sobre dívidas |

---

## Onde mora o código?

| Arquivo | Função |
|---------|--------|
| `src/pages/home/page.tsx` | Composição da landing page |
| `src/pages/home/components/HeroSection.tsx` | Seção hero (7.4KB) |
| `src/pages/home/components/FeaturesSection.tsx` | Cards de features (4.6KB) |
| `src/pages/home/components/CarteirasSection.tsx` | Carteiras modelo (5.5KB) |
| `src/pages/home/components/OnboardingSteps.tsx` | Passos do onboarding (3KB) |
| `src/pages/home/components/TestimonialsSection.tsx` | Depoimentos (2.3KB) |
| `src/pages/home/components/FooterSection.tsx` | Rodapé (2.6KB) |
| `src/pages/home/components/TickerTape.tsx` | Faixa de cotações (1.1KB) |
| `src/mocks/acoes.ts` | `mockTickerTape` e `mockCarteirasModelo` |

---

## APIs e Integrações Externas

> **Nenhuma API externa** na landing page. Todos os dados são mockados.

---

## Stack da Página

- **React 19** com componentes funcionais
- **Tailwind CSS** para estilos
- **Lucide React** para ícones
- **CSS Keyframes** para animação do ticker tape
- **React Router DOM** para links internos (CTAs → /auth/cadastro)

---

## SEO / Meta Tags

```html
<title>Synapta Investimentos</title>
<!-- Implementadas no index.html -->
```

---

## Status de Implementação

- [x] HeroSection com headline e CTAs
- [x] TickerTape animado (dados mockados)
- [x] FeaturesSection com 6 cards
- [x] CarteirasSection com 3 perfis
- [x] OnboardingSteps
- [x] TestimonialsSection
- [x] FooterSection
- [ ] Preços ao vivo no Ticker Tape
- [ ] Vídeo demonstrativo no hero
- [ ] FAQ expandível
- [ ] Seção de planos/preços
- [ ] Calculadora de retorno interativa na landing
- [ ] Animações de scroll (intersection observer)
- [ ] Conformidade LGPD (aviso de cookies)

---

## Observações

> Esta é a única página pública da plataforma — todas as outras requerem autenticação. O design usa dark mode premium com paleta preta + dourado + cinza escuro.

> O **Ticker Tape usa dados mockados intencionalmente** na landing page para garantir funcionamento offline e evitar dependência de API pública no momento do primeiro carregamento.

---

# Produto 11 — Sistema de Preços ao Vivo (Serviço Transversal)

## O que é?
Um **serviço compartilhado** que fornece cotações em tempo real para o Screening de Ações (e potencialmente para a Carteira e Dashboard). É um produto "invisível" — suporta outros produtos, não tem interface própria.

---

## O que faz?

| Função | Descrição |
|--------|-----------|
| `fetchQuote(ticker)` | Busca cotação de uma ação no Yahoo Finance |
| `fetchMultipleQuotes(tickers[])` | Busca múltiplas cotações em paralelo (batch de 5) |
| Cache em memória | Evita requisições desnecessárias (TTL: 60s) |
| `clearCache()` | Limpa o cache manualmente |
| `formatPrice(value)` | Formata preço para pt-BR (ex: "38,42") |
| `formatVariacao(value)` | Formata variação com sinal (ex: "+1,23%") |

---

## Onde mora o código?

`src/services/stockPrices.ts`

---

## APIs Externas Usadas

**Yahoo Finance Chart API (pública, sem auth)**
```
GET https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}.SA
Params: interval=1d&range=1d
Headers: User-Agent: Mozilla/5.0
```

---

## Produtos que dependem deste serviço

| Produto | Status |
|---------|--------|
| Screening de Ações (Produto 03) | ✅ Integrado |
| Dashboard Principal (Produto 05) | ❌ Não integrado (usa preços estáticos) |
| Gestão de Carteira (Produto 06) | ❌ Não integrado (usa preços estáticos) |

---

## Observações

> Em produção, as chamadas diretas ao Yahoo Finance podem falhar por **CORS** no browser. A solução correta é usar uma **Supabase Edge Function** como proxy backend para essas chamadas.
