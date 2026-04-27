import { LoginFormData, CadastroFormData } from "@/schemas/authSchemas";

/**
 * AuthService
 * 
 * Este serviço pertence ao Frontend e atua APENAS como uma ponte de comunicação.
 * Ele pega os dados capturados nas telas (já validados pelo Zod) e dispara uma
 * requisição HTTP. 
 * O banco de dados (Supabase) e as lógicas de segurança ficam 100% no Backend.
 */
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

export const AuthService = {
  /**
   * Envia as credenciais para a rota de login do Backend real.
   */
  async signIn(data: LoginFormData) {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      // Repassando a mensagem tratada e limpa enviada pelo Backend.
      throw new Error(result.error || "Falha ao entrar de comunicar com o servidor.");
    }

    return result; // Retorna { user }
  },

  /**
   * Envia os dados de criacão para a rota de cadastro no Backend real.
   */
  async signUp(data: CadastroFormData) {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Ocorreu um erro ao criar sua conta.");
    }

    return result; // Retorna { user }
  },

  /**
   * Comunica o Backend para invalidar a sessão do usuário.
   */
  async signOut() {
    const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Não foi possível realizar o logout.");
    }
  },

  /**
   * Busca os dados do usuário logado (via cookie).
   */
  async getMe() {
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Sessão inválida.");
    }

    const result = await response.json();
    return result.user;
  },
};
