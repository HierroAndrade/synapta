import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

/**
 * Esse arquivo representa a Camada 4 (Repositório). 
 * É O ÚNICO lugar de todo o projeto onde há import e chamadas diretas pro Banco de Dados.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://xxx.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "eyJxxxx"; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export class AuthRepository {
  async register(email: string, pass: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { full_name: fullName } },
    });

    if (error) throw new Error(error.message);
    return data;
  }

  async login(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
       console.error("[Supabase Auth Error]:", error.message);
       if (error.message.includes("Invalid login credentials")) {
         throw new Error("CREDENTIALS_REJECTED"); 
       }
       throw new Error("DATABASE_ERROR");
    }
    return data;
  }

  /**
   * Valida o JWT e retorna os dados do usuário se for válido.
   */
  async validateToken(token: string) {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return null;
    }
    
    return data.user;
  }
}

// Exportar uma instância única para ser usada pelos middlewares
export const authRepository = new AuthRepository();
