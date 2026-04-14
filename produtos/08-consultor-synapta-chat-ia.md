# Produto 08 — Consultor Synapta (Chat IA)

## O que é?
Um **chatbot financeiro** conversacional que funciona como um consultor digital de investimentos. Responde dúvidas sobre indicadores, estratégias, Markowitz, dividendos e conceitos financeiros em linguagem acessível, com respostas personalizadas pelo perfil e nome do usuário.

---

## O que faz?

| Função | Descrição |
|--------|-----------|
| **Chat conversacional** | Interface de mensagens estilo WhatsApp |
| **Respostas personalizadas** | Usa o nome e perfil do usuário nas respostas |
| **Sugestões de perguntas** | Chips clicáveis na tela inicial com perguntas frequentes |
| **Contexto financeiro** | Responde sobre DY, Markowitz, Sharpe, dívidas, diversificação |
| **Simulação de digitação** | Delay de 1–1.5s para imitar resposta natural do assistente |
| **Auto-scroll** | A conversa rola automaticamente para a última mensagem |

---

## Como funciona?

```
Usuário digita ou clica em sugestão
     ↓
enviar(texto)
     ↓
Adiciona mensagem do usuário na lista
     ↓
setLoading(true)
     ↓
await sleep(1000 + random × 500ms)  // simula processamento
     ↓
gerarResposta(texto, userName, perfil)
     ↓
Adiciona resposta do assistente
     ↓
setLoading(false), scroll para baixo
```

> ⚠️ **Não há API de IA conectada atualmente.** As respostas são geradas por **lógica de pattern-matching local** (if/else com palavras-chave).

---

## Sistema de Respostas (Pattern Matching)

O sistema detecta palavras-chave no texto do usuário e retorna respostas pré-escritas enriquecidas com o nome e perfil do usuário:

| Palavra-chave detectada | Tema da resposta |
|------------------------|-----------------|
| `dividend`, `dy` | Explicação completa de Dividend Yield com percentuais de referência |
| `markowitz`, `otimiz` | Explicação do Modelo de Markowitz e como usar o otimizador |
| `dívida`, `divida`, `quitar` | Regra de priorização de dívidas por taxa de juros |
| `sharpe` | Explicação do Sharpe Ratio com como interpretar os valores |
| `diversif` | Regras práticas de diversificação com alocação por perfil |
| *(qualquer outra coisa)* | Resposta genérica com lista de tópicos disponíveis |

**Exemplo de resposta personalizada (DY):**
```
Ótima pergunta, Carlos! O Dividend Yield (DY) é a porcentagem do preço 
da ação que a empresa paga em dividendos por ano.

Exemplo: se uma ação custa R$ 100 e paga R$ 6 em dividendos, o DY é 6%.

✅ Acima de 5% é considerado bom para renda passiva.
⚠️ Cuidado: DY muito alto pode indicar que o preço caiu muito...

Para seu perfil moderado, ações com DY entre 4-8% são um bom equilíbrio.
```

---

## Sugestões de Perguntas (Chips)

Exibidas apenas quando há 1 ou menos mensagens na conversa (chat "limpo"):

1. "O que é Dividend Yield e como usar?"
2. "Como funciona o Modelo de Markowitz?"
3. "Devo quitar dívidas antes de investir?"
4. "O que é Sharpe Ratio?"
5. "Como diversificar minha carteira?"

---

## Interface

### Header do Chat
- Nome: **Consultor Synapta**
- Status: "Online — responde em segundos" (com ponto verde animado)

### Bolhas de Mensagem
| Emissor | Estilo |
|---------|--------|
| Usuário | Direita, fundo dourado suave, borda |
| Assistente | Esquerda, fundo escuro neutro, borda |

### Indicador de "Digitando"
3 pontos animados (bounce com delay escalonado: 0ms, 150ms, 300ms)

### Formatação de Resposta
O texto do assistente suporta **negrito markdown**: `**texto**` → `<strong>texto</strong>`. Quebras de linha são renderizadas como parágrafos.

---

## Onde mora o código?

| Arquivo | Função |
|---------|--------|
| `src/pages/chat/page.tsx` | Página completa (168 linhas) |
| `src/hooks/useAuth.ts` | Dados do usuário (nome e perfil para personalização) |

---

## Estrutura de Dados

### Interface: `Message` (local, sem persistência)
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;  // hora no formato HH:MM
}
```

> O histórico de conversa **não é salvo** — reseta ao sair da página. A tabela `chat_historico` existe no modelo de dados mas não está integrada.

---

## APIs e Integrações Externas

| Integração | Status | Uso Planejado |
|------------|--------|--------------|
| **GPT / Claude / Gemini** | ❌ Não conectado | Substituir pattern-matching por IA real |
| **Supabase Edge Function** | ❌ Não implementado | Proxy para API de IA com contexto do usuário |
| **Supabase DB (`chat_historico`)** | ❌ Não conectado | Persistir histórico de conversas |

> Atualmente o produto funciona **100% offline**, sem chamadas externas.

---

## Dados do Usuário Usados

| Dado | Origem | Uso |
|------|--------|-----|
| `user.nome` | `useAuth()` → `profiles` | Personaliza as respostas ("Ótima pergunta, Carlos!") |
| `user.perfil` | `useAuth()` → `profiles` | Personaliza recomendações por perfil de risco |

---

## Tabela Planejada: `chat_historico` (Supabase)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | PK |
| `user_id` | uuid | FK → profiles |
| `role` | enum | `'user'` ou `'assistant'` |
| `content` | text | Conteúdo da mensagem |
| `created_at` | timestamp | Data e hora |

*Tabela criada no modelo de dados mas não integrada ao código ainda.*

---

## Status de Implementação

- [x] Interface de chat completa
- [x] Envio e exibição de mensagens
- [x] Personalização por nome do usuário
- [x] Personalização por perfil de risco
- [x] Pattern-matching para 5 tópicos financeiros
- [x] Chips de sugestão de perguntas
- [x] Indicador de "digitando" (loading)
- [x] Formatação markdown (negrito)
- [x] Auto-scroll para última mensagem
- [x] Timestamp em cada mensagem
- [ ] **API de IA real** (GPT/Claude/Gemini) — maior pendência
- [ ] Contexto da carteira do usuário nas respostas
- [ ] Persistência do histórico no Supabase
- [ ] Histórico de conversas anteriores
- [ ] Respostas com dados reais da carteira e metas
- [ ] Sugestões contextuais baseadas na situação financeira
- [ ] Upload de documentos (extrato, nota de corretagem)

---

## Caminho para uma IA Real

O produto está preparado para integrar com uma IA real. O fluxo seria:

```
1. Frontend envia mensagem para Supabase Edge Function (proxy)
2. Edge Function adiciona contexto do usuário (carteira, perfil, metas)
3. Chama OpenAI / Anthropic / Google com contextø
4. Retorna resposta para o frontend
5. Frontend salva no banco (chat_historico)
```

As variáveis de ambiente já preparadas no `.env`:
- `VITE_PUBLIC_SUPABASE_URL`
- `VITE_PUBLIC_SUPABASE_ANON_KEY`

---

## Observações

> Este é o produto com **maior gap** entre o estado atual e o ideal. O pattern-matching funciona bem para demonstração, mas uma IA real com contexto da carteira transformaria completamente o valor do produto.

> O projeto menciona em `project_plan.md` que o chat deve ter **"contexto do cliente"** — ou seja, ao integrar IA, as respostas devem ser geradas com conhecimento do patrimônio, perfil e metas do usuário, não apenas respostas genéricas.
