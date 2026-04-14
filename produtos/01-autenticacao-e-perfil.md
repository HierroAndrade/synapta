# Produto 01 — Autenticação & Perfil de Usuário

## O que é?
Sistema completo de autenticação e gerenciamento de identidade dos usuários da plataforma Synapta Investimentos. É a **porta de entrada** para todo o ecossistema — sem ele, nenhum outro produto funciona.

---

## O que faz?

| Função | Descrição |
|--------|-----------|
| **Cadastro** | Cria conta com e-mail, senha e nome |
| **Login** | Autentica com e-mail e senha |
| **Logout** | Encerra a sessão com segurança |
| **Roles** | Diferencia usuário `cliente` de `admin` |
| **Perfil de risco** | Armazena o perfil (`conservador`, `moderado`, `arrojado`) |
| **Flag de onboarding** | Rastreia se o usuário completou o diagnóstico financeiro |
| **Atualização de dados** | Permite atualizar nome, perfil e onboarding via `updateUser()` |
| **Sessão persistente** | Mantém o usuário logado entre recarregamentos via listener de estado |

---

## Como funciona internamente?

### Fluxo de Login
```
Usuário preenche e-mail + senha
     ↓
supabase.auth.signInWithPassword()
     ↓
Listener onAuthStateChange() dispara
     ↓
fetchProfile(userId) → lê tabela `profiles`
     ↓
User state populado com: id, email, nome, role, perfil, onboardingCompleto
     ↓
Redirecionamento para /dashboard (se onboarding completo) ou /onboarding
```

### Fluxo de Cadastro
```
Usuário preenche e-mail, senha e nome
     ↓
supabase.auth.signUp() — cria conta na tabela auth.users
     ↓
Trigger do Supabase cria registro em `profiles` automaticamente
     ↓
Patch adicional atualiza o campo `nome` em `profiles`
     ↓
Usuário redirecionado para /onboarding
```

---

## Onde mora o código?

| Arquivo | Função |
|---------|--------|
| `src/hooks/useAuth.ts` | Hook principal + Context + Provider |
| `src/lib/supabase.ts` | Client do Supabase configurado |
| `src/pages/auth/LoginPage.tsx` | Tela de login |
| `src/pages/auth/CadastroPage.tsx` | Tela de cadastro |
| `src/App.tsx` | Wrap com `AuthContext.Provider` |
| `src/router/` | Guards de rota (redireciona se não autenticado) |

---

## Estrutura de Dados

### Tabela: `profiles` (Supabase)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | FK para `auth.users` |
| `nome` | text | Nome completo do usuário |
| `role` | enum | `'cliente'` ou `'admin'` |
| `perfil` | enum | `'conservador'`, `'moderado'`, `'arrojado'` ou `null` |
| `onboarding_completo` | boolean | Se completou o diagnóstico |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Última atualização |

### Interface TypeScript: `User`
```typescript
interface User {
  id: string;
  email: string;
  nome: string;
  role: 'cliente' | 'admin';
  perfil?: 'conservador' | 'moderado' | 'arrojado';
  onboardingCompleto?: boolean;
}
```

---

## APIs e Integrações Externas

| Integração | Uso |
|------------|-----|
| **Supabase Auth** | Login, cadastro, logout, sessão, JWT token |
| **Supabase DB** | Leitura e escrita na tabela `profiles` |

### Variáveis de Ambiente Necessárias
```env
VITE_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
```

---

## Tratamento de Erros

| Erro | Mensagem exibida ao usuário |
|------|-----------------------------|
| Credenciais inválidas | "E-mail ou senha incorretos." |
| E-mail já cadastrado | "Este e-mail já está cadastrado. Tente fazer login." |
| Rate limit de cadastro | "Muitas tentativas de cadastro. Aguarde alguns minutos..." |
| Erro genérico | Mensagem original do Supabase |

---

## Dependências do Produto

- `@supabase/supabase-js` v2.57.4
- React Context API (nativo)
- React Router DOM v7 (para guards de rota)

---

## Status de Implementação

- [x] Login com e-mail e senha
- [x] Cadastro com nome
- [x] Logout
- [x] Controle de roles (cliente/admin)
- [x] Persistência de sessão
- [x] Atualização de perfil e onboarding
- [ ] Login social (Google, GitHub) — não implementado
- [ ] Recuperação de senha (rota `/auth/reset` existe mas não implementada)
- [ ] Verificação de e-mail

---

## Observações Importantes

> O produto **não tem autenticação isolada** — funciona como provider global via React Context. Todos os outros produtos dependem do `useAuth()` hook para saber quem é o usuário logado.

> A tabela `profiles` é criada automaticamente por um **trigger no Supabase** quando o usuário se cadastra em `auth.users`. O código faz apenas um patch para atualizar o `nome`.
