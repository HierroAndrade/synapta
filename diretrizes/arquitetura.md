# Diretrizes de Clean Architecture & Acoplamento Fraco

Para organizar o crescimento do sistema (Autenticação, Integrações, Checkout e Inteligência Artificial) e evitar uma "salada de código" incontrolável no futuro, o Synapta Invest deve ser guiado por princípios de **Clean Architecture** (Arquitetura Limpa). 

O foco central aqui é o **Acoplamento Fraco e a Alta Coesão**. O seu código de React ("A Tela") não deveria saber como o banco de dados ("Supabase") salva os dados. Se no futuro mudarmos do Supabase para o Firebase ou AWS, o código React não deve ser alterado minimamente.

Abaixo estão as diretrizes que devemos seguir sempre que codificarmos uma nova funcionalidade:

---

## 1. Regra de Dependência (A Regra de Ouro)
O código fonte só deve depender de camadas internas. 
As regras de negócios da aplicação não devem depender de bibliotecas externas (React, Supabase, Stripe, UI).
- O Frontend (React/UI) deve consumir Regras de Negócio (UseCases).
- Os UseCases devem consumir Repositórios ou Modais.
- A Regra de Negócio **nunca** faz acesso direto à UI ou à infraestrutura.

## 2. Divisão em 3 Camadas Primárias

Sempre que criarmos fluxos mais robustos (ex: Auth, Pagamento, IA), tentaremos respeitar essas divisões abstratas:

### Camada 1: Domínio / Entidades (Domain Layer)
*O Coração do Synapta*
Aqui vivem os tipos e as regras financeiras puras. Interfaces que definem o que é um "Usuário", uma "Carteira" ou uma "Transação", independentemente de como o sistema é construído.
- **Exemplo:** A tipagem estrita via TypeScript (Zod schemas).

### Camada 2: Casos de Uso / Aplicação (Application/Service Layer)
*A Orquestração e Repasse*
Aqui é onde preparamos e empacotamos os pedidos. 
**Nota Importante:** O Frontend é essencialmente "burro". Ele é apenas uma interface visual. Toda a lógica de negócios pesada, verificação de segurança, cálculos e transações reais acontecem no **Backend**. A responsabilidade do Frontend se resume a capturar o dado, enviar para o Backend e exibir a resposta.
- **Exemplo:** `AuthService.ts` pega as credenciais, dispara a requisição e retorna os dados validados.

### Camada 3: Infraestrutura & Adapters (Infrastructure Layer)
*As Fronteiras (Borda)*
É a camada mais suja, que interage com o mundo real. APIs externas, rotas HTTP e bancos de dados.
- **Controllers:** (No Backend) Recebem a `Request`, validam os schemas e despacham pro `Service` adequado. Devolve a `Response` formatada pro cliente.

### Camada 4: Repositórios (Data Access Layer - OBRIGATÓRIO)
*Os Guardiões do Banco*
**Regra Estrita:** Um `Service` NUNCA deve escrever a sintaxe de banco de dados diretamente nele. É obrigatório criar um "Repository".
- **O que faz:** Fica na pasta `src/repositories/`. É o único grupo de arquivos autorizados a importar SDKs de banco de dados (`supabase`, `mongoose`, `pg`, etc).
- **Por quê:** O Service pede "Salvar Usuário", e o Repository sabe a linguagem de máquina pra salvar. Se trocar o banco, só a pasta Repository muda.

---

## 5. Por que Isolar o Banco e a Lógica Estritamente no Backend?

Essa arquitetura exige mais esforço inicial do que simplesmente rodar um banco de dados (BaaS/Supabase) diretamente nos botões do Frontend. No entanto, é **innegociável** para o Synapta pelos seguintes motivos:

1. **Cálculos Pesados (Proteção do Dispositivo):** O Synapta roda cálculos matemáticos avançados (Markowitz, Otimização de Risco, IA). Se processarmos isso no Frontend, o navegador de um usuário com um celular mais modesto vai travar, demorar uma eternidade e destruir a experiência. O Backend processa tudo em servidores de alta capacidade e só devolve o resultado final.
2. **Estabilidade de Integrações Externas (O Risco do F5):** Operações como *Cobrar Cartão via Stripe*, *Gerar Inteligência Artificial* ou *Disparar um E-mail* não podem ficar vulneráveis à aba do usuário. Se o código estiver rodando no Frontend e o usuário apertar "F5", atualizar a página ou perder o 4G, o código morre no meio da execução. E-mails são perdidos, cobranças ficam pela metade. No Backend, o processo é blindado contra a conexão do usuário.
3. **Manutenção e Separação de Responsabilidades:** Com a arquitetura limpa e separada, podemos alterar as regras financeiras, trocar o banco de dados, ou até mesmo criar um aplicativo mobile no futuro, sem reescrever uma única linha da lógica de negócios, pois ela está encapsulada de forma isolada.

---

## 3. Práticas do Dia a Dia no React (O "Frontend Limpo")

Para não burocratizarmos demais a Clean Architecture no frontend (o que geraria código em excesso e improdutivo), traduzimos os princípios para:

1. **Evitar Smart Components Pesados:** Componentes Visuais (ex: `Hero.tsx`) não devem rodar lógicas matemáticas complexas ou instanciar clients via `import { supabase } from 'lib/supabase'`.
2. **Uso de Custom Hooks:** Isole regras de negócio visuais e de interação com serviços dentro de hooks (ex: `useAuth`, `usePricing`, `useMarkowitz`). O componente só recebe o Hook e as propriedades vitais.
3. **Repository Pattern em Services:** Chamadas externas (ex: `Supabase.auth()`, `Stripe.checkout()`, `Gemini API`) devem ter seus arquivos dentro da subpasta `src/services` abstratamente construídas. O componente invoca `AuthService.login(email, pass)` e não a API do Supabase em si.
4. **Injeção de Dependências Oculta:** Use **React Contexts** para prover módulos prontos aos componentes da árvore, mantendo dependências limpas e testáveis rapidamente.

---

## 4. O Exemplo Prático (Autenticação)

Em vez de fazermos:
*(Errado e Altamente Acoplado)*
```tsx
// LoginPage.tsx
import { supabase } from '../lib/supabase';
function Login() {
  const handleLogin = async () => {
    await supabase.auth.signInWithPassword({ email, password });
  }
}
```

Nós faremos:
*(Certo e Acoplamento Fraco)*
```tsx
// services/AuthService.ts
export const AuthService = {
   signIn: async (credentials) => { /* Interação com o Supabase */ }
}

// hooks/useAuth.tsx
export const useAuth = () => {
   // Chama AuthService.signIn() e retorna os estados puros pro component.
}

// LoginPage.tsx
import { useAuth } from '../hooks/useAuth';
function Login() {
   const { login, loading } = useAuth();
   // Interliga a UI pura aos métodos da arquitetura.
}
```

## 6. Proteção de Rotas e Middlewares (Route Guards)

O Frontend deve ser protegido de forma proativa (antes da página ser renderizada para o usuário). Não devemos confiar apenas em verificações de estado dentro dos componentes React (`useEffect` ou hooks) para bloquear o acesso a rotas privadas (ex: `/dashboard`), pois isso resulta em um sistema reativo e frágil ("pisca" a tela, falha em Server Components ou HMR).

Para seguir as **Diretrizes de Segurança**, adotamos o seguinte padrão arquitetural para proteção de rotas no Next.js:

1. **O Porteiro (Middleware):** A validação primária de rotas protegidas deve ocorrer no arquivo `middleware.ts` do Next.js (na raiz de `src/`). Este arquivo executa **no servidor (Edge)** antes mesmo da página HTML ser construída.
2. **Leitura Exclusiva de Cookies:** O middleware deve validar a existência do **Cookie de Sessão (`sb_token`)**, o qual foi setado pelo Backend de forma segura (`httpOnly`). Ele **NUNCA** deve tentar ler ou depender do `sessionStorage` ou `localStorage`.
3. **Redirecionamento Rápido:** Caso o token não exista no cookie, o middleware redireciona imediatamente o usuário para a página de `/auth/login`, impedindo o carregamento da interface privada e prevenindo falhas no meio de fluxos complexos (como a perda de token no passo final de um formulário).

## Resumo
**Clean Architecture não é sobre onde os arquivos ficam, mas sobre QUEM conhece QUEM.** A tela conhece o Hook. O Hook conhece o Serviço. E o Serviço conversa com o Banco/Mundo real. O Banco não conhece nada. O Serviço também nunca interage com o `window` ou o HTML. Acoplamento fraco, substituição fácil.
