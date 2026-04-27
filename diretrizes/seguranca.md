# 🔒 Diretrizes de Segurança — Synapta

> Consulte este documento **sempre que for implementar uma nova funcionalidade**.  
> Marque cada item como revisado antes de abrir um PR.

---

## 1. Autenticação

- [ ] Usar **Supabase Auth** para login/registro — nunca implementar autenticação do zero.
- [ ] Sessões gerenciadas via Supabase (JWT com refresh token automático).
- [ ] Rotas protegidas no Next.js usando middleware ou `getServerSideProps` com verificação de sessão.
- [ ] **NUNCA** armazenar tokens, senhas ou dados sensíveis em `localStorage` ou `sessionStorage`. Estes são vulneráveis a XSS.
- [ ] Sempre utilizar cookies com atributos `httpOnly`, `Secure`, `SameSite=Strict` para armazenar tokens de autenticação.
- [ ] O backend deve setar o cookie via header `Set-Cookie` no momento do login/register — o frontend não manipula o token diretamente.

---

## 2. Autorização (Quem pode acessar o quê)

- [ ] Toda tabela no Supabase deve ter **Row Level Security (RLS) ativado**.
- [ ] Escrever políticas RLS explícitas para `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
- [ ] O usuário nunca deve ver dados de outro usuário — validar sempre via `auth.uid()` no RLS.
- [ ] No Express (backend), verificar o JWT do Supabase em toda rota autenticada.

---

## 3. Validação de Dados

- [ ] Usar **Zod** para validar **todo input** que chega ao backend (body, params, query).
- [ ] Nunca confiar em dados vindos do frontend sem revalidar no servidor.
- [ ] Rejeitar e logar requisições com payloads inesperados (campos extras, tipos errados).

---

## 4. Exposição de Dados

- [ ] Nunca retornar campos desnecessários nas respostas da API (ex: hash de senha, ids internos desnecessários).
- [ ] Variáveis de ambiente **nunca** no frontend (somente `NEXT_PUBLIC_` quando realmente necessário expor).
- [ ] Nunca commitar arquivos `.env` — garantir que estão no `.gitignore`.
- [ ] Segredos de API (OpenAI, etc.) ficam **somente no backend**.

---

## 5. Proteção de API

- [ ] Implementar **rate limiting** em todas as rotas do Express (usar `express-rate-limit`).
- [ ] Configurar **CORS** explicitamente — apenas origens autorizadas (Vercel domain + localhost dev).
- [ ] Usar **helmet.js** no Express para headers de segurança HTTP padrão.
- [ ] Configurar **limite de tamanho do body JSON** no Express: `express.json({ limit: "10kb" })` — previne ataques DoS por JSON Bomb.
- [ ] Rotas que consomem LLM (OpenAI, etc.) devem ter rate limit mais restritivo.

---

## 6. Dependências

- [ ] Rodar `npm audit` antes de subir uma nova funcionalidade.
- [ ] Manter dependências atualizadas — revisar mensalmente.
- [ ] Preferir bibliotecas amplamente adotadas e mantidas.

---

## 7. Logs e Monitoramento

- [ ] Nunca logar dados sensíveis (senhas, tokens, CPF, dados financeiros brutos).
- [ ] Erros do servidor devem retornar mensagens genéricas ao cliente (ex: `"Erro interno"`) — detalhe fica só no log do servidor.
- [ ] Configurar alertas de budget na API da OpenAI para evitar gastos inesperados.

---

## 8. Checklist Rápido Pré-Deploy

| Item | OK? |
|---|---|
| Nenhum segredo no código ou no git | ☐ |
| RLS ativado nas tabelas novas | ☐ |
| Inputs validados com Zod | ☐ |
| Rate limiting na rota nova | ☐ |
| `npm audit` sem vulnerabilidades críticas | ☐ |
| CORS e headers configurados | ☐ |

---

## 9. Prevenção de Abuso de Reembolso (Refund Abuse)

- [ ] **Exigência de CPF:** Para processar qualquer reembolso (Art. 49 CDC), o usuário deve obrigatoriamente fornecer e validar o CPF. Isso permite o rastreio de usuários recorrentes.
- [ ] **Blacklist de Reincidentes:** Se um CPF solicitar reembolso mais de uma vez para o mesmo produto, a conta deve ser marcada para revisão manual ou bloqueio automático de novas assinaturas.
- [ ] **Log de Visualização:** Registrar se o usuário acessou informações sensíveis (como a Carteira Recomendada) antes de solicitar o reembolso, para identificar padrões de má-fé.
- [ ] **Integração com Gateway:** Utilizar as ferramentas de proteção contra fraude do gateway (ex: Stripe Radar) para identificar cartões de crédito associados a múltiplos reembolsos.
